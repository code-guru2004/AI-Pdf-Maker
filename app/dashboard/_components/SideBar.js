"use client";

import { Button } from "@/components/ui/button";
import { BadgePlus, Building2, Gem, Layout } from "lucide-react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress"
import Link from "next/link";
import UploadPDF from "./UploadPDF";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname } from "next/navigation";



function SideBar() {
  const {user} =  useUser() //get logged in user data
  const path = usePathname()
  const allPdf = useQuery(api.fileStorage.getFiles,{
    userEmail:user?.primaryEmailAddress?.emailAddress
  });

  const getUserInfo = useQuery(api.user.getUserInfo,{
    userEmail:user?.primaryEmailAddress?.emailAddress
  })
  console.log("getUserInfo",getUserInfo);
  

  return (
    <div className="shadow-md h-screen p-7">
      <div>
        <Image src={"/logo.svg"} alt="logo" width={170} height={170} />

        <div className="mt-10">
            <UploadPDF isMaxFile={allPdf?.length>=5 && !getUserInfo?.upgrade?true:false}>
                <Button className='w-full py-6'>Upload PDF <BadgePlus /></Button>
            </UploadPDF>

            <Link href={'/dashboard'}>
              <div className={`flex gap-2 items-center p-3 mt-2 hover:bg-slate-200 cursor-pointer hover:font-medium rounded ${path=='/dashboard'&&'bg-slate-200'}`}>
                <Layout/>
                <h2>Workspace</h2>
              </div>
            </Link>

            <Link href={'/dashboard/upgrade'}>
              <div className={`flex gap-2 items-center p-3 mt-1 hover:bg-slate-200 hover:font-medium cursor-pointer rounded ${path=='/dashboard/upgrade'&&'bg-slate-200'}`}>
                <Gem />
                <h2>Upgrade</h2>
              </div>
            </Link>

            <Link href={'/dashboard/about'}>
              <div className={`flex gap-2 items-center p-3 mt-1 hover:bg-slate-200 hover:font-medium cursor-pointer rounded ${path=='/dashboard/about'&&'bg-slate-200'}`}>
              <Building2/>
                <h2>About Us</h2>
              </div>
            </Link>
        </div>
      </div>

      <div className="absolute bottom-7 w-[80%] flex flex-col justify-center items-center gap-3">
        { getUserInfo?.upgrade===false ?(
        <div>
          <Progress value={allPdf?.length*20} />
          <p className="text-sm tracking-wide">{allPdf?.length>0?allPdf.length:'0'} out of 5 PDF Uploaded</p>
          <p className="text-sm text-slate-500">Upgrade to Upload more Pdf</p>
        </div>
        ):<div className="flex flex-col items-center">
          <p className="text-sm tracking-wide">{allPdf?.length>0?allPdf.length:'0'} is Uploaded</p>
          <p className="text-sm text-slate-500">You are now a premium user</p>
        </div>
        } 
       
        <Link href={"/"} className="text-xs underline underline-offset-1">Version: 1.0.1</Link>
      </div>
    </div>
  );
}

export default SideBar;
