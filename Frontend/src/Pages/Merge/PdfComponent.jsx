import { useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";


function PdfComponent({ pdfFile}) {
  const [numPages, setNumPages] = useState();
    const [download, setDownload] = useState("");
    
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div className="rounded">
      <Document
        file={pdfFile}
        className="text-black"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page
          pageNumber={1}
          className="rounded "
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}
export default PdfComponent;
