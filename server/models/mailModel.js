const nodemailer = require('nodemailer');
const chalk = require('chalk');

const mail = {
    sendMail: (email, subject, body) => {
        // Step 1
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
    
        // Step 2
        let mailOptions = {
            from: 'contact@matcha.com', // email sender
            to: email, // email receiver
            subject: subject,
            html: body
        };
    
        // Step 3
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                return false;
            }
            return true;
        });
    }
}

module.exports = mail;
