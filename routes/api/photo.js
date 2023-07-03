const router = require('express').Router();
const multer = require("multer");

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
	dest: "/path/to/temporary/directory/to/store/uploaded/files"
	// you might also want to set some limits: https://github.com/expressjs/multer#limits
  });

router.get('/links', (req, res) => {
	try {

		// look in database and get url1 url2

	} catch (error) {
		res.status(500).send({
			success: false,
			message: 'Something went wrong. Try again later 1'
		});
	}
});
router.post('/photo', upload.single("file"), (req, res) => {
	try {

		console.log('req, res', req.file);
		console.log('req, res', req.files);

		const tempPath = req.file.path;
		const targetPath = path.join(__dirname, "./uploads/image.png");

		if (path.extname(req.file.originalname).toLowerCase() === ".png") {
			fs.rename(tempPath, targetPath, err => {
			  if (err) return handleError(err, res);

			  res
				.status(200)
				.contentType("text/plain")
				.end("File uploaded!");
			});
		  } else {
			fs.unlink(tempPath, err => {
			  if (err) return handleError(err, res);

			  res
				.status(403)
				.contentType("text/plain")
				.end("Only .png files are allowed!");
			});
		  }


		// accept file
		// format file to 600px width
		// format file to webp
		// save image to local disk
		// save fields url1 url2



		// to do first:
		// set up database with fields: url1 url2
		// or set as text file ?
		// make /content folder on localdisk accessible from page


	} catch (error) {
		res.status(500).send({
			success: false,
			message: 'Something went wrong. Try again later 1'
		});
	}
});

module.exports = router;