"use client";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useAction, useMutation } from "convex/react";
import { BadgePlus, CloudUpload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import uuid4 from "uuid4";


function UploadPDF({children,isMaxFile}) {

    const router = useRouter()

    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl); //filestorage =>> file name
    const sendFileToDB = useMutation(api.fileStorage.sendFileToDB);
    const getFileUrl = useMutation(api.fileStorage.getFileUrl);
    const embeddDocument = useAction(api.myAction.ingest);

    const {user} = useUser(); //fetching the logged in user details

    const [file,setFile] = useState();
    const [loading , setLoading] = useState(false);
    const [fileName ,setFileName] = useState("");
    const [open ,setOpen] = useState(false)
    //console.log(fileName);
    
    const OnFileSelect=(e)=>{
        setFile(e.target.files[0])
    }

    const onUpload = async()=>{
        setLoading(true);
         //Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();
         // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
        });
        const { storageId } = await result.json();
        //console.log("Storage Id" , storageId);

        const fileId = uuid4();
        const fileUrl= await getFileUrl({
            storageId:storageId
        })
        // Step 3: Save the newly allocated storage id to the database
        const res = await sendFileToDB({
            fileId:fileId,
            storageId:storageId,
            fileName:fileName??"Untitled PDF",
            createdBy:user?.primaryEmailAddress?.emailAddress,
            fileUrl:fileUrl,
        })
        //console.log(res);
        //console.log(file.size);
        
        // Api call
        const apiRes =  await axios.get('/api/pdf-loader?pdfUrl='+fileUrl);

        //console.log(apiRes.data.result);
         await embeddDocument({
          splitText:apiRes.data.result,
          fileId:fileId,

        });
        //console.log(embededRes);
        

        setLoading(false)
        setOpen(false);
        setFileName("")
        setFile()

        //redirect to /workspace
        router.push('/workspace/'+fileId)

    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button className='w-full py-6' disabled={isMaxFile} onClick={()=>setOpen(true)}>Upload PDF <BadgePlus /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF File</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col mt-10 gap-3 rounded-md ">
                    <Label>Select PDF file From Local Storage<span className="text-red-600">*</span></Label>
                    <input type="file" accept="application/pdf" className="text-blue-700"
                        onChange={(e)=>OnFileSelect(e)}
                    />
                </div>
                <div>
                    <Label>File Name<span className="text-red-600">*</span></Label>
                    <Input className="rounded" onChange={(e)=>setFileName(e.target.value)} />
                </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-3">
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                Close
                </Button>
            </DialogClose>
            <Button onClick={()=>onUpload()} disabled={loading || isMaxFile}>
                
                {
                    loading? <Loading/> : "Upload" 
                }
                 {
                    !loading && <CloudUpload />
                 }  
                </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPDF;
