import { useState,useContext,useEffect } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import axios from "axios";
import toast from "react-hot-toast";
import { context } from "../../hooks/ContextProvider";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { PDFDocument } from "pdf-lib";
import { URL1 } from "../../helper/helper";


function PdfComponent({ pdfFile }) {
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [pages, setPages] = useState([]);
  const [numPages, setNumPages] = useState();
  const { setDownload, setFile,setPdf,pdf} = useContext(context);
  
useEffect(() => {
  lastPage();
}, []);

  const navigate = useNavigate();
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  
  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const getPageCount = async (file) => {
    const arrayBuffer = await readFile(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    return pdf.getPageCount();
  };

  const lastPage = async () => {
    const lastPageCount = await getPageCount(pdfFile);
    setNumPages(lastPageCount);
  };
  const handleConvertPdftoImage = async (e) => {
    e.preventDefault();
    if (pdfFile) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", pdfFile);
      const res = await axios.post(
        `${URL1}/pdf-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        setLoading(false);
        toast.success("Converted to images successfully");
        setDownload(
          `${URL1}/zippedimages/${res.data.zipFile}`
        );
        navigate("/download");
      } else {
        setLoading(false);
        toast.error(res.error.message);
      }
    }
  };

  const handleSpecific = async (e) => {
    e.preventDefault();
    try {
      if (pdfFile && pages) {
        for (let i = 0; i < pages.length; i++) {
          let regex = /^[a-zA-Z]+$/;
          if (regex.test(pages[i])) {
            return toast.error("Enter only numeric");
          }
          if (!(pages[i] > 1 && pages[i] <= numPages)) {
            return toast.error("Invalid Pages");
          }
        }
      setLoading1(true);
      const formData = new FormData();
        formData.append("file", pdfFile);
        formData.append("pages", pages);
        formData.append("totalPages", numPages);
      const res = await axios.post(
        `${URL1}/pdf-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        setLoading1(false);
        toast.success("Converted to images successfully");
        setDownload(
          `${URL1}/zippedimages/${res.data.zipFile}`
        );
        navigate("/download");
      } else {
        setLoading(false);
        toast.error(res.error.message);
      }
      } else {
        setLoading1(false);
        toast.error("Required fields are missing...☹")
      }
    } catch (error) {
      setLoading1(false);
      toast.error(error.message);
    }
  }

  return (
    <>
      <div className="bg-slate-100 dark:bg-[#36454F] px-6 py-4 mx-auto rounded">
        <div className="flex items-center w-full justify-between gap-4 bg-yellow-300 rounded mb-3  px-4 py-2 ">
          <p className="">
            {pdfFile?.name?.length > 15
              ? pdfFile?.name.substring(0, 15) + "..."
              : pdfFile?.name}
          </p>
          <RxCross2
            className="bg-red-400 text-xl rounded-full p-1 cursor-pointer text-white font-bold"
            onClick={() => {
              setFile([]);
            }}
          />
        </div>
        <Document
          file={pdfFile}
          className="flex items-center justify-between gap-10 max-w-[90%] mx-auto"
        >
          <Page
            pageNumber={1}
            width={200}
            className="bg-pink-400 px-5 py-1"
            renderTextLayer={false}
            renderAnnotation={false}
            options={{ disableAnnotationRendering: true }}
          />
        </Document>
      </div>
      <button
        className="bg-teal-500 text-white rounded tracking-wide font-bold mt-4 px-4 py-2 mx-auto text-xl mb-2 shadow-md drop-shadow "
        onClick={(e) => handleConvertPdftoImage(e)}
      >
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Convert Entire PDF to Images"
        )}
      </button>
      <div className="flex items-center justify-center border-2 rounded shadow-md drop-shadow">
        <input
          type="text"
          onChange={(e) => {
            let arr = e.target.value.split(",");
            setPages(arr);
          }}
          placeholder="Enter Page numbers seperated by comma"
          className="outline-none border-none py-2 px-2 w-[330px] text-yellow-600 font-bold dark:bg-black dark:text-white"
        />
        <button
          onClick={(e) => handleSpecific(e)}
          className="px-2 py-2 font-bold bg-pink-400 rounded text-white h-full shadow-md drop-shadow"
        >
          {loading1 ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Convert "
          )}
        </button>
      </div>
    </>
  );
}
export default PdfComponent;
