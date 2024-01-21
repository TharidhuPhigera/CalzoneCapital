import NextAuth from 'next-auth';
import { Credentials, User as AuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '/app/models/User';
import connect from '/app/utils/db';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';


export const authorize = async (
    credentials: Credentials,
    req: any,
    res: any
  ): Promise<{ id: string; email: string } | null> => {
    await connect();
    try {
      console.log('Attempting login with email:', credentials.email);
  
      const user = await User.findOne({ email: credentials.email });
      
      if (user) {
        console.log('User found:', user);
        
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
  
        if (isPasswordCorrect) {
          console.log('Password is correct. Login successful.');
          
          return user
        } else {
          console.log('Password is incorrect.');
          throw new Error('Password is incorrect');
        }
      } else {
        console.log('User not found.');
        throw new Error('User not found');
      }
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
    }
  };
  
export const authOptions: any = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize,
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id || null;
        token.email = user.email || null;
      }
      return token;
    },
    async session(session, user) {
      if (user) {
        session.user = {
          id: user.id || null,
          email: user.email || null,
        };
      }
      return session;
    },
  },
  database: process.env.MONGO_URL,
  pages: {
    signIn: '/login',
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
