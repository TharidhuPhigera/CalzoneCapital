import './globals.css'
import { Poppins } from 'next/font/google'
import { getServerSession } from 'next-auth'
import SessionProvider from "app/utils/SessionProvider"

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700']
})

export const metadata = {
  title: 'Calzone Capital',
  description: 'Where AI Shapes Your Financial Future!',
  
}

export default async function RootLayout({ children }) {

  const session = await getServerSession();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={poppins.className}>
          {children}
        </body>
      </html>
    </SessionProvider>
  )
}
