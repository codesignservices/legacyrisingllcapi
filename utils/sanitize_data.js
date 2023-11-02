const { body, param, query, header, cookie } = require('express-validator');

function sanitizeInput() 
{
   const sanitize = 
   [
      body('*').trim().escape(),
      param('*').trim().escape(),
      query('*').trim().escape(),
      header('*').trim().escape(),
      cookie('*').trim().escape(),
   ];

   return sanitize
} 

module.exports = sanitizeInput;