const router = require('express').Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const async = require('async');
const sharp = require('sharp');

const host = `https://wilshiregfs.com`;
const assetsPath = `../../../assets`;
const upload = multer({
	dest: path.join(__dirname, `${assetsPath}/temp`),
	limits: {
		files: 8,
		fileSize: 10000000
	}
	// you might also want to set some limits: https://github.com/expressjs/multer#limits
});
const handleError = (err, res) => {
	res
	  .status(500)
	  .contentType("text/plain")
	  .end("Oops! Something went wrong!");
};

router.get('/photo', (req, res) => {

	const jsonFilePath = path.join(__dirname, `${assetsPath}/WGFS-link.json`);

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

		const textPath = path.join(__dirname, `${assetsPath}/WGFS-link.json`);

		async.each(req.files, (file, callback) => {

			const tempPath = file.path;

			const accepted = ['.png', '.jpg', '.jpeg'];
			if (accepted.includes(path.extname(file.originalname).toLowerCase())) {
				const imagePath = `${assetsPath}/${file.originalname}`;
				const targetPath = path.join(__dirname, imagePath);
				const nameNoExt = file.originalname.split('.')[0];
				const finalImagePath = `${assetsPath}/${nameNoExt+'.webp'}`;
				const finalTargetPath = path.join(__dirname, finalImagePath);

				fs.rename(file.path, targetPath, () => {

					// Remove temp path
					const exists = fs.existsSync(tempPath);
					// This used to not remove temp path automatically, so now we're checking if file exists first
					if (exists) {

						fs.unlink(tempPath, (err) => console.log(err));

					}

				});

				sharp(targetPath).resize({
					fit: sharp.fit.contain,
					width: 600
				}).webp().toFile(finalTargetPath).then(() => {

					fs.unlink(targetPath, callback);

				});

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

			if (req.body && req.body.flyerInfo) {

				if (Array.isArray(req.body.flyerInfo)) {

					// Type: req.body.link: string[]
					jsonData = req.body.flyerInfo.map((info) => ({
						link: info.link,
						flyerUrl: `${host}/assets/${info.flyerName}.webp`
					}))

				} else {

					// Type: req.body.flyerInfo: { link: string, flyerName: string }
					// Form data sends only string if 1 value. But turns into array once appended value
					jsonData = [{
						link: req.body.flyerInfo.link,
						flyerUrl: `${host}/assets/${info.flyerName}.webp`
					}]

				}

			}

			fs.writeFile(textPath, JSON.stringify(jsonData), (err) => {
				if (err) {
					console.error('Error');
					res.status(500).send({
						success: false,
						message: 'Something went wrong.Check fs.writeFile'
					});
				}

				res.status(200).contentType("text/plain").end("File uploaded!");


				// Look at what's in the directory
				// for each item in the directory check if it exists in jsonData.flyerUrl
				// if not, remove file


				// Remove any extra images when user removes images
				// fs.readdir(path.join(__dirname, '../../../assets'), (err, files) => {

				// 	if (err) console.log('err 1')

				// 	const imageFiles = files.filter((file) => file.includes('.webp') && file.includes('WGFS-flyer'));

				// 	if (jsonData.length < imageFiles.length) {

				// 		const extraImages = imageFiles.splice(jsonData.length);
				// 		for (let i = 0; i < extraImages.length; i++) {

				// 			fs.unlink(path.join(__dirname, `../../../assets/${extraImages[i]}`), (err) => console.log('err 2'));

				// 		}
				// 	}

				// });

			});

		})

	} catch (error) {

		res.status(500).send({
			success: false,
			message: 'Something went wrong. Try again later 1'
		});

	}
});

module.exports = router;