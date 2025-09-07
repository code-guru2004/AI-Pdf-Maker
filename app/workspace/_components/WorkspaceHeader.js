'use client'



import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

function WorkspaceHeader({fileName}) {
  return (
    <div className="p-4 flex justify-between shadow-md">
      <Image 
      src={"/logo.svg"} 
      alt="logo" 
      width={170} 
      height={170} 
      />
      <h2 className="text-xl">{fileName}.pdf</h2>
      {/* <div>
        <UserButton/>
      </div> */}
    </div>
  );
}

export default WorkspaceHeader;
