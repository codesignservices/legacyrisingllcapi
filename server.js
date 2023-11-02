require('dotenv').config();

var cluster = require('cluster');
var os = require('os');
var cpus = os.cpus().length;

const app = require('./app');

//-------------------------------------------

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