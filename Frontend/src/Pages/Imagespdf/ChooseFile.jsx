import React, { useContext, useState,useEffect } from "react";
import { context } from "../../hooks/ContextProvider";
import { IoIosAddCircle } from "react-icons/io";
import { pdfjs } from "react-pdf";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { URL1 } from "../../helper/helper";

const ChooseFile = () => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgFile, setImgFile] = useState([]);
  const { setDownload } = useContext(context);

  useEffect(() => {
    setImgFile([]);
  }, []);

  const navigate = useNavigate();

    const handleFileUpload = (e) => {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      }));
        setImage((prevFiles) => [...prevFiles, ...newFiles]);
        setImgFile([...e.target.files]);
    };


    const handleFileRemove = (name) => {
        setImgFile((prevFiles) => prevFiles.filter((f) => f.name !== name));
        setImage((prevFiles) => prevFiles.filter((f) => f.file.name !== name));
    };
  
    const handleImagetoPdf = async(e) => {
      e.preventDefault();
      try {
        if (imgFile) {
        setLoading(true);
            const formData = new FormData();
            for (let i = 0; i < imgFile.length; i++){
                formData.append("file", imgFile[i]);
            }
            const res = await axios.post(
              `${URL1}/image-pdf`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
          );
        if (res.status === 200) {
          setLoading(false);
          setDownload(`${URL1}/image-pdffile/newPdf.pdf`);
                toast.success("Images converted to Pdf successfully");
                navigate("/download");
            } else {
              setLoading(false);
              toast.error(res.error.message);
            }
        }
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
      }
      
    }
  return (
    <>
      {imgFile.length === 0 ? (
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
            accept="image/*"
            onChange={(e) => handleFileUpload(e)}
          />
        </div>
      ) : (
        <div className="flex max-sm:flex-col max-[600px]:flex-col items-center justify-center mt-[2%]">
          <div className=" md:absolute md:left-4 flex flex-col items-center justify-around  max-sm:ml-auto max-sm:mr-[5%] max-[600px]:ml-auto">
            <label htmlFor="choose-file">
              <IoIosAddCircle
                htmlFor="choose-file"
                className=" text-5xl text-yellow-500 cursor-pointer "
              />
            </label>
            <input
              type="file"
              id="choose-file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const newFiles = Array.from(e.target.files).map((file) => ({
                  file,
                  preview: file.type.startsWith("image/")
                    ? URL.createObjectURL(file)
                    : null,
                }));
                setImage((prevFiles) => [...prevFiles, ...newFiles]);
                setImgFile([...imgFile, ...e.target.files]);
              }}
            />
          </div>
          <div className="flex flex-col items-center justify-around gap-4">
            <div className="max-w-[70%] max-[600px]:max-w-[100%] bg-slate-100 dark:bg-[#36454F] px-6 py-6 grid sm:max-md:grid-cols-2 md:max-2xl:grid-cols-3 2xl:grid-cols-4 items-center justify-center gap-5 rounded">
              {image.map((f, index) => (
                <div key={index} className="bg-pink-300 px-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-md">
                      {f.file.name.length > 15
                        ? f.file.name.substring(0, 15) + "..."
                        : f.file.name}
                    </p>
                    <RxCross2
                      className="bg-red-400 text-xl rounded-full p-1 cursor-pointer text-white font-bold"
                      onClick={() => handleFileRemove(f.file.name)}
                    />
                  </div>
                  {f.preview && (
                    <img
                      src={f.preview}
                      alt={`Preview ${f.file.name}`}
                      className="w-30 h-40 object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              className=" bg-teal-500 text-white px-4 py-2 text-2xl rounded font-bold tracking-wide shadow-md drop-shadow"
              onClick={(e) => handleImagetoPdf(e)}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Convert Images to PDF"
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChooseFile;
