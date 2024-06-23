import { useState, useEffect, useContext } from "react";
import { Document, Page } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { context } from "../../hooks/ContextProvider";
import { PDFDocument } from "pdf-lib";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { URL1 } from "../../helper/helper";

const PdfComponent = ({ pdfFile }) => {
  const [pdf, setPdf] = useState(pdfFile);
  const [fromPage, setFromPage] = useState(1);
  const { numPages, setNumPages,setDownload } = useContext(context);
  const [toPage, setToPage] = useState(numPages);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    lastPage();
  }, []);

  useEffect(() => {
    if (numPages) {
      setToPage(numPages);
    }
  }, [numPages]);

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
  const handleFromPage = (e) => {
    if (e.target.value < toPage) {
      setFromPage(Number(e.target.value));
    }
  };

  const handleToPage = (e) => {
    if (e.target.value > fromPage) {
      setToPage(Number(e.target.value));
    }
  };

  const handleSplit = async (e) => {
    e.preventDefault();
    if (fromPage && toPage) {
      setLoading(true);
      const formData = new FormData();
      formData.append("fromPage", fromPage);
      formData.append("toPage", toPage);
      formData.append("file", pdfFile)
      const res = await axios.post(
        `${URL1}/split-files`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      if (res.status === 200) {
        setLoading(false);
        toast.success("Splitted pdf successfully");
        navigate("/download");
        setDownload(`${URL1}/splitedPdf/newPdf.pdf`);
      } else {
        setLoading(false);
        toast.error(res.error.message);
      }
    }
    else {
      setLoading(false);
      toast.error("Required fields are missing...!");
    }
  };

  return (
    <div>
      {pdf ? (
        <>
          <div className="flex flex-col items-center justify-between bg-slate-100 dark:bg-[#36454F] px-6 py-4 mx-auto rounded ">
            <div className="flex items-center justify-between gap-20 mb-4">
              <div className="flex items-center justify-around gap-4">
                <h1 className="text-2xl text-yellow-500 font-bold">From</h1>
                <input
                  type="number"
                  value={fromPage}
                  min="1"
                  onChange={handleFromPage}
                  max={numPages}
                  className="text-2xl text-center rounded border-2 border-purple-400 hover:border-pink-400 active:border-pink-400 focus:border-pink-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-around gap-4">
                <h1 className="text-2xl text-teal-500 font-bold">to</h1>
                <input
                  type="number"
                  value={toPage}
                  min="1"
                  onChange={handleToPage}
                  max={numPages}
                  className="text-2xl text-center rounded border-2 border-purple-400 hover:border-pink-400 active:border-pink-400 focus:border-pink-400 focus:outline-none"
                />
              </div>
            </div>
            <Document
              file={pdf}
              className="flex items-center justify-between gap-10 max-w-[90%] md:max-xl:max-w-[60%] sm:max-md:flex-col max-[640px]:flex-col"
            >
              <Page
                pageNumber={fromPage}
                width={200}
                className="bg-pink-400 px-5 py-1"
                renderTextLayer={false}
                renderAnnotation={false}
                options={{ disableAnnotationRendering: true }}
              />
              <Page
                pageNumber={toPage}
                width={200}
                className="bg-pink-400 px-8 py-4"
                renderTextLayer={false}
                renderAnnotation={false}
                options={{ disableAnnotationRendering: true }}
              />
            </Document>
          </div>
          <button
            onClick={(e) => handleSplit(e)}
            className="flex items-center justify-center mx-auto mt-4 mb-4 text-2xl bg-teal-500 px-4 py-2 tracking-wide text-white rounded font-bold shadow-md drop-shadow"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Split PDF"
            )}
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default PdfComponent;
