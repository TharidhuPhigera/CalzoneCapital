import React from 'react'
import Card from './Card'

const Dashboard = () => {
  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
        <div className="h-screen grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-8 md:grid-rows-7 xl:grid-cols-5 auto-rows-fr gap-6 p-10">
            <div className="col-span-1 md:col-span-2 xl:col-span-3 row-span-1">
                <Card>
                    Header
                </Card>
            </div>
            <div className="md:col-span-2 row-span-4">
                <Card>
                    Chart
                </Card>
            </div>
            <div>
                <Card>
                    Overview
                </Card>
            </div>
            <div className="row-span-2 xl:row-span-3">
                <Card>
                    Details
                </Card>
            </div>
        </div>
    </main>
  )
}

export default Dashboard