const router = require('express').Router();
const transporter = require('../../config');
const dotenv = require('dotenv');
dotenv.config();

router.post('/review', (req, res) => {
	try {
		const mailOptions = {
			from: req.body.email, // sender address
			to: process.env.email, // list of receivers
			subject: req.body.subject, // Subject line
			html: `
		<p>You have a new contact request.</p>
		<h3>Contact Details</h3>
		<ul>
		  <li>Name: ${req.body.name}</li>
		  <li>Email: ${req.body.email}</li>
		  <li>Subject: ${req.body.subject}</li>
		  <li>Message: ${req.body.message}</li>
		</ul>
		`
		};

		transporter.sendMail(mailOptions, function (err, info) {
			if (err) {
				res.status(500).send({
					success: false,
					message: 'Something went wrong. Try again later'
				});
			} else {
				res.send({
					success: true,
					message: 'Thanks for contacting us.'
				});
			}
		});
	} catch (error) {
		res.status(500).send({
			success: false,
			message: 'Something went wrong. Try again later'
		});
	}
});

module.exports = router;