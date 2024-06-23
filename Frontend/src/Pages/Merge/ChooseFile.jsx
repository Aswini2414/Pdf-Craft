import React,{useContext,useEffect,useState} from 'react';
import { context } from '../../hooks/ContextProvider';
import { IoIosAddCircle } from "react-icons/io";
import PdfComponent from "./PdfComponent";
import { pdfjs } from "react-pdf";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { URL1 } from '../../helper/helper';

const ChooseFile = () => {
  const [loading, setLoading] = useState(false);
  const { file, setFile, setDownload } = useContext(context);

  const navigate = useNavigate();
  useEffect(() => {
    setFile([]);
  }, []);

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

    const handleFileUpload = (e) => {
        setFile([...e.target.files]);
    }
  
  const handleMerge = async (e) => {
    e.preventDefault();
    try {
      if (file.length > 1) {
        setLoading(true);
        const formData = new FormData();
        for (let i = 0; i < file.length; i++){
          formData.append("files", file[i]);
        }
        const res = await axios.post(`${URL1}/merge-files`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });
        if (res.status === 200) {
          setLoading(false);
          toast.success("Pdf's Merged");
          setDownload(`${URL1}/mergedPdf/newPdf.pdf`);
          navigate("/download");
          setFile([]);
        } else {
          setLoading(false);
          res.error(res.error.message);
        }

      } else {
        toast.error("Atleast 2 files are required to merge..☹");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }
    return (
      <>
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
          <div className="flex max-sm:flex-col max-[600px]:flex-col items-center justify-center mt-[2%]">
            <div className=" md:absolute md:left-4 flex flex-col items-center justify-around  max-sm:ml-auto max-sm:mr-[5%] max-[600px]:ml-auto">
              <label htmlFor="choose-file">
                <IoIosAddCircle
                  htmlFor="choose-file"
                  className=" text-5xl text-yellow-600 cursor-pointer"
                />
              </label>
              <input
                type="file"
                id="choose-file"
                className="hidden"
                accept="application/pdf"
                onChange={(e) => {
                  setFile([...file, ...e.target.files]);
                }}
              />
            </div>
            <div className="flex flex-col items-center justify-around gap-4">
              <div className="max-w-[70%] max-[600px]:max-w-[100%] bg-slate-100 dark:bg-[#36454F] px-6 py-6 grid sm:max-md:grid-cols-2 md:max-2xl:grid-cols-3 2xl:grid-cols-4 items-center justify-center gap-5 rounded">
                {file.map((f) => {
                  const { name } = f;
                  return (
                    <div key={f.name} className="bg-pink-300 px-4 py-2">
                      <div className="flex items-center justify-between mb-2 ">
                        <p className="text-md">
                          {name.length > 10
                            ? name.substring(0, 10) + "..."
                            : name}
                        </p>
                        <RxCross2
                          className="bg-red-400 text-xl rounded-full p-1 cursor-pointer text-white font-bold"
                          onClick={() => {
                            const filtered = file.filter(
                              (f) => f.name !== name
                            );
                            setFile(filtered);
                          }}
                        />
                      </div>
                      <PdfComponent pdfFile={f} />
                    </div>
                  );
                })}
              </div>
              <button
                className=" bg-teal-500 text-white px-4 py-2 text-2xl rounded font-bold tracking-wide mb-4 shadow-md drop-shadow"
                onClick={(e) => handleMerge(e)}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Merge PDF"
                )}
              </button>
            </div>
          </div>
        )}
      </>
    );
}

export default ChooseFile;