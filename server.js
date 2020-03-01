const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const dns = require('dns');
const app = express()

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

const apiKey = '298877b144bc9c3f4165ea0fe436f486';

// Get the index file
app.get('/', function (req, res) {
    res.render('index');
});

// Load geolocated page from index
app.get('/geolocate?', function (req, res) {
    let domain = req.query.domain;
    console.log(domain);

    // Get user IP
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket.remoteAddress
    console.log('user:', ip);

    // Get domain IP
    dns.lookup(domain, function onLookup(err, addresses, family) {
        let url = `http://api.ipstack.com/${addresses}?access_key=${apiKey}`
        if (err) {
            res.render('geolocated', { domain: null, location: null, error: 'Error, please enter a valid domain'});
        } else {
            request(url, function(err, response, body) {
                let location = JSON.parse(body);
                if (err) {
                    res.render('geolocated', { domain: domain, location: null, error: 'Error, please try again' });
                } else {
                    res.render('geolocated', { domain: domain, location: location, error: null });
                }
            });
        }
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port 3000!')
});
