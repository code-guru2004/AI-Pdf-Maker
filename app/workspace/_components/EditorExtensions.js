
import React from 'react'
import { MdFormatListBulleted } from "react-icons/md";
import { TbBlockquote, TbH1, TbH2, TbH3 } from "react-icons/tb";
import { FaAlignCenter, FaAlignJustify, FaAlignLeft, FaAlignRight, FaBold, FaHighlighter, FaItalic, FaStrikethrough, FaSubscript, FaSuperscript, FaUnderline } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { IoCodeSlash, IoSparkles } from "react-icons/io5";
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { chatSession } from '@/configs/AIModel';
import { toast } from "sonner"
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

function EditorExtensions({editor}) {
  //console.log("editor--------------------",editor);
  
  const {fileId} = useParams();
  const SearchAi = useAction(api.myAction.search)
  const addNotes = useMutation(api.notes.AddNotes);
  

  const {user} = useUser(); //user data

  const onAiClick =async ()=>{
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' ',
    );
    
    toast("Fetching Data By AI....")

    //console.log(selectedText);
    const result = await SearchAi({
      query:selectedText,
      fileId:fileId
    })
    const unformedAns = JSON.parse(result)
    //console.log("unformed ans:-",result);
    let allUnformedAns='';
    unformedAns&&unformedAns.forEach(item => {
      allUnformedAns = allUnformedAns+item.pageContent;
    });
    //console.log("allUnformedAns",allUnformedAns);
    
    const PROMPT="For question :"+selectedText+" on the given content answer within 150 words and pointwise," + " please give appropriate answer in HTML formmat. The answer content is: "+allUnformedAns;
    //console.log("PROMT" , PROMPT);
    
    const AIModelResult = await chatSession.sendMessage(PROMPT);

    //console.log(AIModelResult?.response.text());
    const FinalAIAnswer = AIModelResult?.response.text().replace('```','').replace('html','').replace(" ```",'');
    const AllText = editor.getHTML();
    editor.commands.setContent(AllText+"<p><strong>Answer 👉: </strong>"+FinalAIAnswer+'</p>');
    //console.log("alltext",AllText+"<p><strong>Answer 👉: </strong>"+FinalAIAnswer+'</p>');
   // notesUpdated=AllText+"<p><strong>Answer 👉: </strong>"+FinalAIAnswer+'</p>'
    addNotes({
      notes:AllText,
      fileId:fileId, 
      createdBy:user?.primaryEmailAddress.emailAddress
    })
  }
  const saveNote =async ()=>{
   // console.log(editor.getHTML());
    editor&&addNotes({
      notes:editor.getHTML(),
      fileId:fileId,
      createdBy:user?.primaryEmailAddress?.emailAddress
    });
    toast("⏳Saving Changes...")
    
  }
  return editor&&(
    <div className='p-5'>
         <div className="control-group">
        <div className="button-group flex gap-4 items-center">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'text-red-600' : 'text-slate-500'}
          >
            <FaBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'text-red-600' : 'text-slate-500'}
          >
            <FaItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'text-red-600' : 'text-slate-500'}
          >
           <FaHighlighter />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'text-red-600' : 'text-slate-500'}
          >
            <FaStrikethrough />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'text-red-600' : 'text-slate-500'}
          >
            <MdFormatListBulleted />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'text-red-600' : 'text-slate-500'}
          >
           <TbH1 />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'text-red-600' : 'text-slate-500'}
          >
            <TbH2 />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'text-red-600' : 'text-slate-500'}
          >
           <TbH3 />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'text-red-600' : 'text-slate-500'}
          >
            <TbBlockquote />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={editor.isActive('subscript') ? 'text-red-600' : 'text-slate-500'}
          >
            <FaSubscript />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={editor.isActive('superscript') ? 'text-red-600' : 'text-slate-500'}
          >
            <FaSuperscript />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'text-red-600' : 'text-slate-500'}
          >
            <FaUnderline/>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'text-red-600' : 'text-slate-500'}
          >
            <FaAlignLeft />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'text-red-600' : 'text-slate-500'}
          >
            <FaAlignCenter />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'text-red-600' : 'text-slate-500'}
          >
            <FaAlignRight />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'text-red-600' : 'text-slate-500'}
          >
            <FaAlignJustify />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'text-red-600' : 'text-slate-500'}
          >
            <IoCodeSlash className='font-bold'/>
          </button>
          <button
            onClick={() => onAiClick()}
            className={'hover:text-blue-600 text-xl'}
          >
            <IoSparkles />
          </button>
          <Button onClick={()=>saveNote()}>
            <FaSave/>
          </Button>
          </div>
          </div>
    </div>
  )
}

export default EditorExtensions