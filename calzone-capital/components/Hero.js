import React from 'react'
import Image from 'next/image'

const Hero = () => {
  return (
  <section>
        <div className='grid grid-cols-2 lg:grid-cols-12'>
            <div className='col-span-7 place-self-center text-center sm:text-left'>
                <h1 className='text-[#38bfc3] mb-4 text-7xl lg:text-8xl'>
                <span className='font-bold'>CALZONE</span>{' '}
                <span style={{ letterSpacing: '0.115em' }} className='text-white'>CAPITAL</span>
                </h1>
                <h2 className='text-white mb-4 text-1xl lg:text-2xl' style={{ letterSpacing: '-0.025em' }}>
                    Where AI Shapes Your Financial Future!
                </h2>
                <div>
            </div>
            </div>
            <div className='col-span-5 place-self-center mt-4 lg:mt-0'>
                <Image
                    src="/images/landingpage.png"
                    alt='stock image'
                    width={400}
                    height={400}
                />
            </div>
        </div>
  </section>
  );
}; 

export default Hero