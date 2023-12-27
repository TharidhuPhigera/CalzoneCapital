import React from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Navbar from '/components/Navbar'
import Dashboard from '/components/Dashboard'


const Home = async () => {
    const session = await getServerSession()
    if (!session){
        redirect("/")
    }

    return(
        <main className="flex min-h-screen flex-col bg-[#121212]">
            <Navbar/>
            <Dashboard/>
        </main>
    )
}

export default Home