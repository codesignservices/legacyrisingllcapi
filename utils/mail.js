require('dotenv').config({ path: './../.env' });

var nodemailer = require("nodemailer");

async function send(mailOptions)
{
    var transport = nodemailer.createTransport(
    {
        host:process.env.SMTP_HOST,
        port: 587, 
        secure: false,
        auth:
        {
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASSWORD
        },
        
    });
    
    await transport.sendMail(mailOptions);
}

module.exports = send;
