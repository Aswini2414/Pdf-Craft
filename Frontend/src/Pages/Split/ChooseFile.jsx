import React, { useContext,useEffect} from "react";
import { context } from "../../hooks/ContextProvider";
import PdfComponent from "./PdfComponent";
import { pdfjs } from "react-pdf";
import { RxCross2 } from "react-icons/rx";

const ChooseFile = () => {
  const { file, setFile, setDownload } = useContext(context);

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
        <div className="flex  items-center justify-center mt-[3%] mx-auto max-[760px]:overflow-x-hidden">
          {file.map((f) => {
            const { name } = f;
            return (
              <div
                key={name}
                className="flex flex-col items-center justify-around"
              >
                <div className="flex w-full items-center justify-between gap-4 bg-yellow-300 rounded md:w-full px-4 py-2">
                  <p className="text-md sm:max-md:hidden max-[640px]:hidden ">
                    {name}
                  </p>
                  <p className="md:hidden">
                    {name.length > 15 ? name.substring(0, 15) + "..." : name}
                  </p>
                  <RxCross2
                    className="bg-red-400 text-xl rounded-full p-1 cursor-pointer text-white font-bold"
                    onClick={() => {
                      const filtered = file.filter((f) => f.name !== name);
                      setFile(filtered);
                    }}
                  />
                </div>
                <PdfComponent pdfFile={f} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ChooseFile;
