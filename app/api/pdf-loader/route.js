// Reference Url : https://js.langchain.com/docs/integrations/document_loaders/web_loaders/pdf/
import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


export async function GET(req) {

    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const pdfUrl = searchParams.get('pdfUrl');
    console.log(pdfUrl);
    
    // 1. load content like text the PDF File
    const response = await fetch(pdfUrl);
    const data = await response.blob();
    const loader = new WebPDFLoader(data);

    const docs = await loader.load();

    let pdfTextContent = "";
    docs.forEach(doc=>{
        pdfTextContent = pdfTextContent + doc.pageContent;
    });

    // 2. Splite the test into small chunks
    // Reference(V0.1)(used here): https://js.langchain.com/v0.1/docs/modules/data_connection/document_transformers/
    // Reference(latest): https://js.langchain.com/docs/concepts/text_splitters/
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
      });
      const output = await splitter.createDocuments([pdfTextContent]);

      let spliterList=[];
      output.forEach(doc=>{
        spliterList.push(doc.pageContent)
      })
    return NextResponse.json({result: spliterList})
}