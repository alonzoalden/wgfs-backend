const router = require('express').Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const async = require('async');
const sharp = require('sharp');

// const host = `https://wilshiregfs.com`;
const host = `https://alonzoalden.com`;
const assetsPath = `../../../assets`;

const upload = multer({
	dest: path.join(__dirname, `${assetsPath}/temp`),
	limits: {
		files: 8,
		fileSize: 10000000
	}
	// multer limits: https://github.com/expressjs/multer#limits
});

const handleError = (err, res) => {
	res
		.status(500)
		.contentType("text/plain")
		.end("Oops! Something went wrong!");
};

const parseName = (name) => {

	if (name.includes('.png')) {

		return name.split('.png')[0];

	} else if (name.includes('.webp')) {

		return name.split('.webp')[0];

	} else if (name.includes('.jpeg')) {

		return name.split('.jpeg')[0];

	}

	return name;

};

const removeUnusedFiles = (jsonData) => {

	// Remove any extra images when user removes images

	fs.readdir(path.join(__dirname, '../../../assets'), (err, files) => {

		if (err) console.log('err reading assets dir', err)

		const imageFiles = files.filter((file) => file.includes('.webp') && file.includes('WGFS-Flyer'));

		if (jsonData.length && imageFiles.length) {

			imageFiles.forEach((fileName) => {

				const found = jsonData.find((data) => {

					console.log(parseName(fileName), data.flyerName)
					return parseName(fileName) === data.flyerName;

				})

				if (!found) {

					// delete...
					fs.unlink(path.join(__dirname, `../../../assets/${fileName}`), (err) => err ? console.log('err deleting file', err) : '');

				}

			})

		}

	});

}

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
				const nameNoExt = file.originalname.split('.png')[0];
				const finalImagePath = `${assetsPath}/${nameNoExt + '.webp'}`;
				const finalTargetPath = path.join(__dirname, finalImagePath);

				fs.rename(file.path, targetPath, () => {

					// Remove temp path
					const exists = fs.existsSync(tempPath);
					// This used to not remove temp path automatically, so now we're checking if file exists first
					if (exists) {

						fs.unlink(tempPath, (err) => err ? console.log(err) : '');

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

			if (req.body && req.body.link && req.body.flyerName) {

				if (Array.isArray(req.body.link)) {

					jsonData = req.body.link.map((link, i) => {

						const flyerName = parseName(req.body.flyerName[i]);

						return {
							link,
							flyerName,
							flyerUrl: `${host}/assets/${flyerName}.webp`
						}

					});

				} else {

					const flyerName = parseName(req.body.flyerName);
					// Form data sends only string if 1 value. But turns into array once appended value
					jsonData = [{
						link: req.body.link,
						flyerName,
						flyerUrl: `${host}/assets/${flyerName}.webp`
					}];

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

				removeUnusedFiles(jsonData);

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