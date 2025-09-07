import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
import EditorExtensions from './EditorExtensions'
import Highlight from '@tiptap/extension-highlight'
import Strike from '@tiptap/extension-strike'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Heading from '@tiptap/extension-heading'
import Blockquote from '@tiptap/extension-blockquote'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import History from '@tiptap/extension-history'
import Code from '@tiptap/extension-code'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import { IoIosCloudDownload } from "react-icons/io";



function TextEditor({fileId,fileName}) {
  const printRef = React.useRef(null)
        const handleDownload= async()=>{
          const element = printRef.current
          console.log(element);
          if(!element){
            return;
          }
          const canvas = await html2canvas(element,{
            scale:4,
          });
          const data = canvas.toDataURL('image/png');

          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4"
          });
          const imgProps = pdf.getImageProperties(data);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(data,'PNG',0,0,pdfWidth,pdfHeight);
          pdf.save(fileName+"_AI.pdf");

        } 
        const notes = useQuery(api.notes.getNotes,{
          fileId:fileId
        });

        

        const editor = useEditor({
          extensions: [StarterKit,
            Placeholder.configure({
                Placeholder:'Start Writing Something...'
              }),
              Highlight.configure({ multicolor: true }),
              Strike,
              BulletList, ListItem,
              Heading.configure({
                levels: [1, 2, 3],
              }),
              Blockquote,
              Subscript,
              Superscript,
              Underline,
              TextAlign.configure({
                types: ['heading', 'paragraph'],
              }),
              Code,
          ],
          content: '',
          editorProps:{
            attributes:{
                class:'focus:outline-none h-screen p-4 '
            }
          }
        });

        useEffect(()=>{
          editor&&editor.commands.setContent(notes);
        },[notes&&editor]);

        if (!editor) {
            return null
          }

       // console.log(notes);
      
     
  return (
    <div>
      <div className='flex gap-2 items-center'>
        <EditorExtensions editor={editor}/>
        <Button onClick={handleDownload} className="bg-blue-500 text-3xl hover:bg-blue-800" ><IoIosCloudDownload width={40}/></Button>
        </div>
        <div className='overflow-scroll h-[85vh]'>
            <EditorContent ref={printRef} editor={editor} classID='tracking-wide'/>
        </div>
    
    </div>
  )
}

export default TextEditor