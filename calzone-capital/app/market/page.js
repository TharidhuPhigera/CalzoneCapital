"use client"
import React from "react";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from "next/navigation";
import Sidebar from '/components/Sidebar';
import Dashboard from '/components/Dashboard';
import Header from '/components/Header';

import StockContext from '/context/StockContext'

const Market = () => {
    const { data: session } = useSession();
    console.log("Session:", session);
    if (!session) {
        redirect("/");
    }
    const [stockSymbol, setStockSymbol] = useState("MSFT");

    return (
        <main className="flex min-h-screen bg-[#ffffff]">
            <Sidebar />
                <StockContext.Provider value={{ stockSymbol, setStockSymbol }}>
                    <Dashboard/>
                </StockContext.Provider>
        </main>
    );
};

export default Market
