const router = require('express').Router();
const transporter = require('../../config');
const dotenv = require('dotenv');
dotenv.config();

router.post('/review', (req, res) => {
	try {
		const mailOptions = {
			from: `WGFS Web Services <${process.env.email}>`, // sender address
			to: process.env.emailto, // list of receivers
			subject: 'WGFS Review Submitted', // Subject line
			html: `
				<p>You have a new review.</p>
				<h3>Review Details</h3>
				<ul>
				<li>Name: ${req.body.name}</li>
				<li>Email: ${req.body.email}</li>
				<li>Rating: ${req.body.rating} out of 5</li>
				<li>Message: ${req.body.message}</li>
				</ul>
			`
		};
		transporter.sendMail(mailOptions, function (err, info) {
			if (err) {
				res.status(500).send({
					success: false,
					message: 'Gmail rejected you. Please check.'
				});
				console.log(err)
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
			message: 'Something went wrong. Try again later 1'
		});
	}
});

module.exports = router;