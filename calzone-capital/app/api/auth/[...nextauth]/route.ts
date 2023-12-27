import NextAuth from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "/app/models/User";
import connect from "/app/utils/db";
import bcrypt from "bcryptjs";
import { errorToJSON } from "next/dist/server/render";

export const authOptions: any = {    
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials: any){
                await connect();
                try {
                    const user = await User.findOne({email: credentials.email});
                    if (user){
                        const isPasswordCorrect = await bcrypt.compare(
                            credentials.password,
                            user.password
                        )
                        if (isPasswordCorrect) {
                            return user;
                        } else {
                            // Password is incorrect
                            throw new Error("Password is incorrect");
                        }
                    } else {
                        // User not found
                        throw new Error("User not found");
                    }
                } catch (error) {
                    // Handle the error appropriately
                    console.error(error);
                    return { error: "An error occurred while trying to authenticate." };
                }
            },
        }),
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_ID,
        //     clientSecret: process.env.GOOGLE_SECRET
        // })
    ],
    callbacks: {
        async session({session}) {

            return session
        },
        // async signIn({ profile}) {
        //     try {
        //         await connect();
        //         const existingUser = await User.findOne({ email: profile.email });
        
        //         if (!existingUser) {
        //             const newUser = await User.create({
        //                 email: profile.email || '',
        //                 password: 'generatedDefaultPassword',
        //             });
        
        //             if (!newUser) {
        //                 throw new Error("Failed to create a new user");
        //             }
        //         return newUser;
        //         }
        
        //     return existingUser;
        //     } catch (error) {
        //         console.error(error);
        //         return false;
        //     }
        // }
    }     
}
export const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}