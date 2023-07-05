const router = require('express').Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const async = require('async');

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
	dest: "/Users/alonzoalden/Code/wilshiregroupfinancial/wfgs-backend/routes/assets",
	limits: {
		files: 8,
		fileSize: 10000000
	}
	// you might also want to set some limits: https://github.com/expressjs/multer#limits
  });
router.get('/links', (req, res) => {
	try {

		// look in database and get url1 url2
		fs.readFile

	} catch (error) {
		res.status(500).send({
			success: false,
			message: 'Something went wrong. Try again later 1'
		});
	}
});

router.post('/photo', upload.array('file'), (req, res) => {
	try {

		const textPath = path.join(__dirname, `../../../assets/WGFS-link.json`);
		const imagesPath = path.join(__dirname, `../../../assets/WGFS-images.json`);
		const imagePaths = [];

		fs.writeFile(textPath, JSON.stringify({ links: req.body.link }), (err) => {
			if (err) {
				console.error('Error');
			}
		});
		async.eachOf(req.files, (file, index, callback) => {

			const tempPath = file.path;
			const imagePath = `../../../assets/WGFS-${file.originalname}`;
			imagePaths.push(`WGFS-${file.originalname}`);
			const targetPath = path.join(__dirname, imagePath);
			if (path.extname(file.originalname).toLowerCase() === ".png") {

				fs.rename(tempPath, targetPath, callback);


			} else {

				fs.unlink(tempPath, err => {
					if (err) return handleError(err, res);

					res
						.status(403)
						.contentType("text/plain")
						.end("Only .png files are allowed!");
				});

			}

		}, () => {

			fs.writeFile(imagesPath, JSON.stringify({ images: imagePaths }), (err) => {
				if (err) {
					console.error('Error');
				}
			});

			res
				.status(200)
				.contentType("text/plain")
				.end("File uploaded!");

		})


		// accept file
		// format file to 600px width
		// format file to webp



		// make /content folder on localdisk accessible from page


	} catch (error) {
		res.status(500).send({
			success: false,
			message: 'Something went wrong. Try again later 1'
		});
	}
});

module.exports = router;