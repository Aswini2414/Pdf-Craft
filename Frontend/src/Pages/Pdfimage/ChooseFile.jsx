import React,{useContext,useState,useEffect} from 'react';
import { context } from '../../hooks/ContextProvider';
import PdfComponent from './PdfComponent';
import { pdfjs } from "react-pdf";
import { RxCross2 } from "react-icons/rx";


const ChooseFile = () => {
    const { file, setFile } = useContext(context);
  useEffect(() => {
    setFile([]);
  }, []);
  
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

    const handleFileUpload = (e) => {
      setFile([...e.target.files]);
    };
    
  return (
    <div>
      {file.length === 0 ? (
        <div className="flex items-center justify-center mt-[10%]">
          <label
            htmlFor="file"
            className="text-3xl font-bold bg-teal-500 px-4 py-2 rounded tracking-wider text-white font-Sans cursor-pointer shadow-md drop-shadow"
          >
            Select File
          </label>
          <input
            type="file"
            id="file"
            className="hidden"
            accept="application/pdf"
            onChange={(e) => handleFileUpload(e)}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-around mt-[3%] mx-auto max-[760px]:overflow-x-hidden">
          <PdfComponent pdfFile={file[0]} />
        </div>
      )}
    </div>
  );
}

export default ChooseFile