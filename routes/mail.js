require('dotenv').config();

let express = require('express');
let router = express.Router();

let rateLimiter = require('../middlewares/rateLimiter');
let mail        = require('../utils/mail');

router.post('/api/contact-us', rateLimiter(1,3), async function(req, res, next) 
{
  try
  {
      let { firstName, lastName, phoneNumber, emailAddress, message } = req.body;
      
      if(!req.body) 
      {
        res.status(403).json({ "message": "Fields can not be empty!" });
      }

      else
      {
        let mailOptions = 
        {
          from: 'admin@xyz.com',
          to: process.env.DESTINATION_EMAIL,
          subject: 'Contact information',
          html: `Dear<b> Admin </b><br><br> Please find the contact information below:<br><br>
          <b>First Name:</b> ${firstName}<br>
          <b>Last Name:</b> ${lastName}<br>
          <b>Phone:</b> ${phoneNumber}<br>
          <b>Email:</b> ${emailAddress}<br>
          <b>Message:</b> ${message}`
        }

        await mail(mailOptions)
        
        res.status(200).json({ "message": "Thanks for contacting us, we will get back to you shortly!"  })
      }
  }

  catch(error)
  {
      next(error)
  }
});

module.exports = router;