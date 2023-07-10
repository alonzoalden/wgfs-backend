const router = require('express').Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const async = require('async');
const sharp = require('sharp');
const cors = require('cors')

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
	dest: path.join(__dirname, `../../../html/static/temp`),
	limits: {
		files: 8,
		fileSize: 10000000
	}
	// you might also want to set some limits: https://github.com/expressjs/multer#limits
});

router.get('/photo', cors(), (req, res) => {

	const jsonFilePath = path.join(__dirname, '../../../assets/WGFS-link.json');

	try {

		const exists = fs.existsSync(jsonFilePath);

		if (exists) {

			res.sendFile(jsonFilePath);


		} else {

			res.send({});

		}

	} catch (error) {

		res.status(500).send({
			success: false,
			message: 'Something went wrong. Try again later'
		});

	}



});

router.post('/photo', upload.array('file'), (req, res) => {
	try {

		const textPath = path.join(__dirname, `../../../html/static/WGFS-link.json`);

		async.each(req.files, (file, callback) => {

			const accepted = ['.png', '.jpg', '.jpeg'];
			if (accepted.includes(path.extname(file.originalname).toLowerCase())) {
				const imagePath = `../../../html/static/WGFS-${file.originalname}`;
				const targetPath = path.join(__dirname, imagePath);
				const nameNoExt = file.originalname.split('.')[0];
				const finalImagePath = `../../../html/static/WGFS-${nameNoExt+'.webp'}`;
				const finalTargetPath = path.join(__dirname, finalImagePath);

				fs.rename(file.path, targetPath, callback);

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

			let jsonData = [];
			if (typeof req.body.link === 'string') {

				// Type: req.body.link: string
				// Form data sends only string if 1 value. But turns into array once appended value
				jsonData = [{
					link: req.body.link,
					flyerUrl: `https://alonzoalden.com/assets/WGFS-flyer1.webp`
				}]

			} else {

				// Type: req.body.link: string[]
				jsonData = req.body.link.map((link, index) => ({
					link,
					flyerUrl: `https://alonzoalden.com/assets/WGFS-flyer${index + 1}.webp`
				}))

			}

			fs.writeFile(textPath, JSON.stringify(jsonData), (err) => {
				if (err) {
					console.error('Error');
					res.status(500).send({
						success: false,
						message: 'Something went wrong.Check fs.writeFile'
					});
				}

				res
					.status(200)
					.contentType("text/plain")
					.end("File uploaded!");
			});

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