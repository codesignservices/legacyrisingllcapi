require('dotenv').config();

//-------------------------------------------

var cluster = require('cluster');
var os = require('os');
var cpus = os.cpus().length;

//-------------------------------------------

var express = require('express');
var app = express();
var router = require('./routes/mail.js');

//-------------------------------------------

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

//-------------------------------------------

var SANITIZATION = require('./utils/sanitize_data.js');

//-------------------------------------------

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//--------------------------------------------


app.use(cors(
{
   credentials: true,
   origin: true,
}))

const serverHeaders = function (req, res, next) 
{
    var agents = 
    [
      "Microsoft IIS",
      "nginx",
      "Apache (Arch)",
      "Apache Tomcat",
      "Cloudflare",
      "Fastly",
      "CloudFront"
    ];

    const agent = agents[  
      Math.floor(Math.random() * agents.length)
    ]
    
    res.setHeader('Server',agent);
    next()
}

const xPoweredByHeaders = function (req, res, next) 
{
    var agents = 
    [
      "PHP 8.1.0",
      "Express",
      "Next.js",
      "ASP.NET",
      "Ruby on Rails",
      "Perl 5.0",
      "Java EE"
    ];

    const agent = agents[  
      Math.floor(Math.random() * agents.length)
    ]
    
    res.setHeader('X-Powered-By',agent);
    next()
}

app.use(serverHeaders);
app.use(xPoweredByHeaders);

app.use(SANITIZATION())

app.use('/', router);

app.use(function(req, res, next) 
{
  res.status(404).json({'message':'Resource not found!'});
});

app.use(function(err, req, res, next) 
{
  console.log(err);
  return res.status(500).json({'message': 'An error occured please try again!'});
});

//--------------------------------------------

if(process.env.NODE_ENV == 'production')
{
    if(cluster.isMaster)
    {  
        for(let x = 0; x < cpus; x++)
        {
            cluster.fork();
        }

        cluster.on('exit',(worker, code, signal) =>
        {
            cluster.fork();
        });
    }

    else
    {
        app.listen(process.env.PORT, async() => 
        {
            console.log('\nProduction Environment\n')
            console.log(`App running on http://localhost:${process.env.PORT}`)
        })
    }
}

else
{
    app.listen(process.env.PORT, async() => 
    {   
        console.log('\nDevelopment Environment\n')
        console.log(`App running on http://localhost:${process.env.PORT}`)
    })
}

//-------------------------------------------

module.exports = app;
