var limiter = require('express-rate-limit');

var limit = (minutes,number) => limiter(
    {
        windowMs: minutes * 60 * 1000,
        
        max: number, 
        
        handler: function (req, res, next) 
        {
                let MINUTE = (minutes > 1) ? 'minutes' : 'minute';
                return res.status(403).json(
                {
                    'message': `Your IP is blocked after ${number} tries, try again after ${minutes} ${MINUTE}`
                })
        }
    })

module.exports = limit;
