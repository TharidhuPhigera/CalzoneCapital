import React from "react";
import { getServerSession } from "next-auth";
import { redirect, useClient } from "next/navigation";
import Sidebar from '/components/Sidebar';

const Settings = async () => {
    const session = await getServerSession();
    if (!session) {
        redirect("/");
    }

    return (
        <main className="flex min-h-screen bg-[#ffffff]">
            <Sidebar />
            <section className='w-4/5 pl-10 pr-4 pt-4 text-right overflow-y-auto p-8 bg-gray'>
                <div className='flex justify-between items-start'>
                    <h1 className='text-black mb-10 text-4xl pt-14 pl-5'>Settings</h1>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                    {/* Your additional content goes here */}
                </div>
            </section>
        </main>
    );
};

export default Settings
