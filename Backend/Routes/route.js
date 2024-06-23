const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs").promises;
const fs1 = require("fs");
const { PDFDocument } = require("pdf-lib");
const { Poppler } = require("node-poppler");
// const pdfConverter = require("pdf-poppler");
const archiver = require("archiver");
const sharp = require("sharp"); //"@img/sharp-win32-x64": "^0.33.4",

const dirname1 = path.resolve();
const outputDir = path.join(dirname1,"Backend", "uploads");

if (!fs1.existsSync(outputDir)) {
  fs1.mkdirSync(outputDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, outputDir);
  },
  filename: (req, file, cb) => {
    const date = Date.now();
    cb(null, date + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/merge-files", upload.array("files"), async (req, res) => {
  try {
    console.log(req.files);
    let filenames = [];
    for (let i = 0; i < req.files.length; i++) {
      filenames.push(req.files[i].filename);
    }
    console.log(filenames);
    let pdf1Bytes = await fs.readFile(path.join(outputDir, filenames[0]));
    let pdf1Doc = await PDFDocument.load(pdf1Bytes);
    for (let i = 1; i < filenames.length; i++) {
      let pdf2Bytes = await fs.readFile(path.join(outputDir, filenames[i]));
      let pdf2Doc = await PDFDocument.load(pdf2Bytes);
      const pdf2pages = pdf2Doc.getPages();
      console.log(pdf2pages);
      for (let i = 0; i < pdf2pages.length; i++) {
        const [pdf2] = await pdf1Doc.copyPages(pdf2Doc, [i]);
        pdf1Doc.addPage(pdf2);
      }
    }

    const pdfBytes = await pdf1Doc.save();
    if (!fs1.existsSync(path.join(dirname1, "Backend", "pdfs/mergedPdf"))) {
      fs1.mkdirSync(path.join(dirname1, "Backend", "pdfs/mergedPdf"));
    }
    await fs.writeFile(
      path.join(dirname1, "Backend", "pdfs/mergedPdf/newPdf.pdf"),
      pdfBytes
    );
    for (let i = 0; i < filenames.length; i++) {
      fs1.unlink(path.join(outputDir, filenames[i]), (err) => {
        if (err) {
          throw err;
        }
        console.log("Uploads directory is cleared");
      });
    }
    res.status(200).json({ message: "Pdfs's merged successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/split-files", upload.single("file"), async (req, res) => {
  try {
    const { fromPage, toPage } = req.body;
    console.log(req.file);
    let pdf1Bytes = await fs.readFile(path.join(outputDir, req.file.filename));
    let startIndex = fromPage;
    let lastIndex = toPage;
    let pdf1Doc = await PDFDocument.load(pdf1Bytes);
    const pdfDoc = await PDFDocument.create();
    for (let i = startIndex - 1; i <= lastIndex - startIndex; i++) {
      const [customPdf] = await pdfDoc.copyPages(pdf1Doc, [i]);
      pdfDoc.addPage(customPdf);
    }

    const pdfBytes = await pdfDoc.save();
    if (!fs1.existsSync(path.join(dirname1, "Backend", "pdfs/splitedPdf"))) {
      fs1.mkdirSync(path.join(dirname1, "Backend", "pdfs/splitedPdf"));
    }
    await fs.writeFile(
      path.join(dirname1, "Backend", "pdfs/splitedPdf/newPdf.pdf"),
      pdfBytes
    );

    fs1.unlink(path.join(outputDir, req.file.filename), (err) => {
      if (err) {
        throw err;
      }
      console.log("upload directory is cleared");
    });

    res.status(200).json({ message: "Pdf splited successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/pdf-image", upload.single("file"), async (req, res) => {
  try {
    const { pages, totalPages } = req?.body;
    const pagesArr = pages?.split(",");
    let pdfPath = path.join(
      dirname1,
      "Backend",
      `uploads/${req.file.filename}`
    );
    let outputDir = path.join(
      path.resolve(),
      "Backend",
      "images",
      path.basename(pdfPath, path.extname(pdfPath))
    );

    // Ensure the output directory exists
    try {
      await fs.access(outputDir);
      console.log("Output directory already exists:", outputDir);
    } catch (err) {
      await fs.mkdir(outputDir, { recursive: true });
      console.log("Created output directory:", outputDir);
    }

    const poppler = new Poppler();
    if (pagesArr) {
      for (let i = 0; i < pagesArr.length; i++) {
        const outputFilePath = path.join(
          outputDir, `${i}.png`)
        

        const options = {
          firstPageToConvert: i,
          lastPageToConvert: i,
          pngFile: true,
        };

        const convertResult = await poppler.pdfToCairo(
          pdfPath,
          outputFilePath,
          options
        );
      }
    } else {
      const outputFilePath = path.join(
        outputDir, "page")

      const options = {
        pngFile: true,
      };

      const convertResult = await poppler.pdfToCairo(
        pdfPath,
        outputFilePath,
        options
      );
    }

    // Log the contents of the output directory
    const filesInOutputDir = await fs.readdir(outputDir);
    // Ensure convertResult gives a valid array of filenames
    if (filesInOutputDir.length === 0) {
      throw new Error("PDF conversion did not produce any image files.");
    }

    // Create ZIP file
    const zipFilename = path.basename(pdfPath, path.extname(pdfPath)) + ".zip";
    const zipDir = path.join(path.resolve(), "Backend", "zips");
    const zipPath = path.join(zipDir, zipFilename);

    await fs.mkdir(zipDir, { recursive: true });

    // Ensure that zipPath is a file, not a directory

    const output = fs1.createWriteStream(zipPath);
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    output.on("close", function () {
      console.log(archive.pointer() + " total bytes");
      console.log(
        "archiver has been finalized and the output file descriptor has closed."
      );
    });

    archive.on("error", function (err) {
      throw err;
    });

    archive.pipe(output);

    filesInOutputDir.forEach((image) => {
      let imagePath = path.join(outputDir, image);
      archive.file(imagePath, { name: path.basename(imagePath) });
    });

    // Finalize the archive creation
    await archive.finalize();

    fs1.rm(path.join(outputDir), { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
      console.log("Files deleted successfully");
    });

    fs1.unlink(
      path.join(dirname1, "Backend", "uploads", req.file.filename),
      (err) => {
        if (err) {
          throw err;
        }
        console.log("upload directory is cleared");
      }
    );

    const zipFold = await fs.readdir(
      path.join(path.resolve(), "Backend", "zips")
    );

    for (let i = 0; i < zipFold.length; i++) {
      let foldPath = path.join(path.resolve(), "Backend", "zips", zipFold[i]);

      if (zipFold[i] !== zipFilename) {
        fs1.rm(path.join(foldPath), { recursive: true }, (err) => {
          if (err) {
            throw err;
          }
          console.log("Files deleted successfully");
        });
      }
    }
    res.status(200).json({
      message: "Images successfully converted and zipped",
      zipFile: `${zipFilename}`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/image-pdf", upload.array("file"), async (req, res) => {
  try {
    console.log(req.files);
    let imageBytes = [];

    for (let i = 0; i < req.files.length; i++) {
      const imageBytes1 = await fs.readFile(
        path.join(outputDir, req.files[i].filename)
      );
      imageBytes.push(imageBytes1);
    }
    const pdfDoc = await PDFDocument.create();

    for (const imageByte of imageBytes) {
      const highResImageBuffer = await sharp(imageByte) // Adjust width and height as needed
        .jpeg({ quality: 90 }) // Adjust quality as needed
        .toBuffer();

      const image = await pdfDoc.embedJpg(highResImageBuffer);
      const { width, height } = image.scale(1);
      const page = pdfDoc.addPage([2000, 2000]);
      // const { width, height } = page.getSize();
      if (height > width) {
        page.drawImage(image, {
          x: page.getWidth() / 2 - 1000 / 2,
          y: page.getHeight() / 2 - 1900 / 2,
          width: 1000,
          height: 1900,
        });
      } else {
        page.drawImage(image, {
          x: page.getWidth() / 2 - 1900 / 2,
          y: page.getHeight() / 2 - 1000 / 2 + 250,
          width: 1900,
          height: 1000,
        });
      }
    }

    const pdfBytes = await pdfDoc.save();

    if (!fs1.existsSync(path.join(dirname1, "Backend", "pdfs/image-pdf"))) {
      fs1.mkdirSync(path.join(dirname1, "Backend", "pdfs/image-pdf"));
    }

    await fs.writeFile(
      path.join(dirname1, "Backend", "pdfs/image-pdf/newPdf.pdf"),
      pdfBytes
    );

    for (let i = 0; i < req.files.length; i++) {
      fs1.unlink(path.join(outputDir, req.files[i].filename), (err) => {
        if (err) {
          throw err;
        }
        console.log("Uploads directory is cleared");
      });
    }

    res.status(200).json({ message: "Images converted to pdf successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
