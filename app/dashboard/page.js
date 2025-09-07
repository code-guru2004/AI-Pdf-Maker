'use client'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Dashboard({children}) {

  const {user} =  useUser() //get logged in user data

  const allPdf = useQuery(api.fileStorage.getFiles,{
    userEmail:user?.primaryEmailAddress?.emailAddress
  });

  //console.log(allPdf);
  
  return (
    <div>
      <h2 className='text-3xl font-bold'>Workspace 📄</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-10'>
      {
        allPdf?.length>0? allPdf?.map(pdf=>(
          <Link key={pdf?._id} href={'/workspace/'+pdf?.fileId}>
          <div key={pdf?._id} className='flex flex-col items-center justify-center p-5 shadow-md cursor-pointer hover:scale-105 transition-all'>
            <Image
              src='/pdf.png'
              alt='pdf'
              width={70}
              height={70}
            />
            <h2 className='font-medium text-lg mt-3'>{pdf?.fileName}.pdf</h2>
            {/* <h2>{new Date(pdf?._creationTime)}</h2> */}
          </div>
          </Link>
        ))
        :[1,2,3,4,5,6].map((item,idx)=>(
          <div className='bg-slate-200 rounded-md h-[150px] animate-pulse' key={idx}>

          </div>
        ))
      }
      </div>
    </div>
  )
}

export default Dashboard