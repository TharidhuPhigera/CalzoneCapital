"use client"
import Hero from '../components/Hero'
import Navbar from '../components/Navbar';

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <Navbar/>
      <div className="container mx-auto px-12 py-4">
        <Hero/>
      </div>
    </main>
  );


}
 