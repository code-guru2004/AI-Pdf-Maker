'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import WorkspaceHeader from '../_components/WorkspaceHeader';
import PdfViewer from '../_components/PdfViewer';
import { useQueries, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import TextEditor from '../_components/TextEditor';
import Loading from '@/components/Loading';

function Workspace() {
    const [fileUrl,setFileUrl]=useState("")
   const {fileId} = useParams();

    const fileInfo = useQuery(api.fileStorage.GetFileRecord,{
        fileId:fileId,
    });

   
  return (
    <div>
        <WorkspaceHeader fileName={fileInfo?.fileName}/>

        <div className='grid grid-cols-2 gap-5'>
            <div>
                {/* Text Editor */}
                <TextEditor fileId={fileId} fileName={fileInfo?.fileName}/>
            </div>
            <div>
                {/* PDF Viewer */}
                 <PdfViewer fileUrl={fileInfo?.fileUrl}/>
            </div>
        </div>
    </div>
  )
}

export default Workspace