import React,{useContext} from 'react';
import { context } from '../hooks/ContextProvider';
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const Download = () => {
  const { download,setFile } = useContext(context);
  const navigate = useNavigate();

    const handleDownload = () => {
      saveAs(download);
      navigate("/");
      setFile([]);
  }
  if (!download) {
    navigate("/");
  }
  return (
    <>
      <div
        className="flex flex-col items-center justify-center gap-4 mt-[5%] "
        onClick={() => handleDownload()}
      >
        <h1 className="text-2xl dark:text-white">
          Your file is ready for downloading
        </h1>
        <button className="bg-teal-500 text-white px-4 py-2 tracking-wide rounded text-2xl font-bold shadow-md drop-shadow">
          Download
        </button>
      </div>
    </>
  );
}

export default Download