import React from "react";
import { MdOutlinePictureAsPdf } from "react-icons/md";
import { RiSplitCellsHorizontal } from "react-icons/ri";
import { FaRegImages } from "react-icons/fa6";
import { FaRegFilePdf } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Home = () => {
    return (
      <div className="flex items-center justify-center mt-[10%]">
        <div className="grid grid-cols-2 items-center justify-center  gap-5 max-[640px]:grid-cols-1 max-[640px]:w-[80%] md:gap-10">
          <Link
            to="/merge"
            className="flex flex-col justify-center cursor-pointer bg-teal-600 text-white py-2 px-4 rounded "
          >
            <div className="flex items-center gap-4 mb-2">
              <MdOutlinePictureAsPdf className="text-4xl text-yellow-500 font-bold bg-yellow-200 rounded px-2 py-1" />
              <h1 className="font-bold text-2xl">Merge Pdf</h1>
            </div>
            <h2 className="font-semi-bold text-xl">Merges Pdf files</h2>
          </Link>
          <Link
            to="/split"
            className="flex flex-col justify-center bg-yellow-500 text-white py-2 px-4 rounded "
          >
            <div className="flex items-center gap-4 mb-2">
              <RiSplitCellsHorizontal className="text-4xl text-purple-500 font-bold bg-purple-200 rounded px-2 py-1 " />
              <h1 className="font-bold text-2xl">Split Pdf</h1>
            </div>
            <h2 className="font-semi-bold text-xl">Splits Pdf file</h2>
          </Link>
          <Link
            to="/pdf-image"
            className="flex flex-col justify-center bg-sky-500 text-white py-2 px-4 rounded "
          >
            <div className="flex items-center gap-4 mb-2">
              <FaRegImages className="text-4xl text-pink-500 font-bold bg-pink-200 rounded px-2 py-1" />
              <h1 className="font-bold text-2xl">Pdf - Image</h1>
            </div>
            <h2 className="font-semi-bold text-xl">Converts Pdf into Images</h2>
          </Link>
          <Link
            to="/image-pdf"
            className="flex flex-col justify-center bg-lime-500 text-white py-2 px-4 rounded "
          >
            <div className="flex items-center gap-4 mb-2">
              <FaRegFilePdf className="text-4xl text-orange-500 font-bold bg-orange-200 rounded px-2 py-1" />
              <h1 className="font-bold text-2xl">Images - Pdf</h1>
            </div>
            <h2 className="font-semi-bold text-xl">Converts Images into Pdf</h2>
          </Link>
        </div>
      </div>
    );
};

export default Home;
