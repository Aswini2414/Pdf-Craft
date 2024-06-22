import { useState } from 'react';
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChooseFileMerge from './Pages/Merge/ChooseFile';
import ChooseFileSplit from "./Pages/Split/ChooseFile";
import ChooseFilePdfImage from "./Pages/Pdfimage/ChooseFile";
import ChooseFileImagePdf from "./Pages/Imagespdf/ChooseFile";
import toast, { Toaster } from "react-hot-toast";
import Download from "./Pages/Download";

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/merge" element={<ChooseFileMerge />} />
          <Route path="/download" element={<Download />} />
          <Route path="/split" element={<ChooseFileSplit />} />
          <Route path="/pdf-image" element={<ChooseFilePdfImage />} />
          <Route path="/image-pdf" element={<ChooseFileImagePdf />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App
