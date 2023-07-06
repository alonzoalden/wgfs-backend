const router = require('express').Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const async = require('async');
const sharp = require('sharp');

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
	dest: path.join(__dirname, `../../../assets/temp`),
	limits: {
		files: 8,
		fileSize: 10000000
	}
	// you might also want to set some limits: https://github.com/expressjs/multer#limits
  });
router.get('/photo', (req, res) => {

	res.sendFile(path.join(__dirname, '../../../assets/WGFS-link.json'));

});
router.post('/photo', upload.array('file'), (req, res) => {
	try {

		const textPath = path.join(__dirname, `../../../assets/WGFS-link.json`);

		fs.writeFile(textPath, JSON.stringify({ links: req.body.link }), (err) => {
			if (err) {
				console.error('Error');
			}
		});
		async.eachOf(req.files, (file, index, callback) => {

			const accepted = ['.png', '.jpg', '.jpeg'];

			if (accepted.includes(path.extname(file.originalname).toLowerCase())) {

				const imagePath = `../../../assets/WGFS-${file.originalname}`;
				const targetPath = path.join(__dirname, imagePath);
				const tempPath = file.path;
				const nameNoExt = file.originalname.split('.')[0];
				const finalImagePath = `../../../assets/WGFS-${nameNoExt+'.webp'}`;
				const finalTargetPath = path.join(__dirname, finalImagePath);

				fs.rename(tempPath, targetPath, callback);

				sharp(targetPath).resize(600, 849).webp().toFile(finalTargetPath);

			} else {

				fs.unlink(tempPath, err => {
					if (err) return handleError(err, res);

					res
						.status(403)
						.contentType("text/plain")
						.end("Only .png .jpg .jpeg files are allowed!");
				});

			}

		}, () => {

			res
				.status(200)
				.contentType("text/plain")
				.end("File uploaded!");

		})

		// make /content folder on localdisk accessible from page

	} catch (error) {

		res.status(500).send({
			success: false,
			message: 'Something went wrong. Try again later 1'
		});

	}
});

module.exports = router;