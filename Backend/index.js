const express = require("express");
const cors = require("cors");
const router = require("./Routes/route");
const app = express();
const path = require("path");

const dirname1 = path.resolve();
app.use(cors());
app.use(express.json());
app.use("/mergedPdf", express.static(path.join(dirname1, "pdfs/mergedPdf")));
app.use("/splitedPdf", express.static(path.join(dirname1, "pdfs/splitedPdf")));
app.use("/zippedimages", express.static(path.join(dirname1, "zips")));
app.use("/image-pdffile", express.static(path.join(dirname1, "pdfs/image-pdf")));
app.use(router);

app.use(express.static(path.join(dirname1, "Frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(dirname1, "Frontend", "dist", "index.html"));
})

const Port = 5000;

app.listen(Port, (req, res) => {
    console.log(`Server is running on port ${Port}`);
});

