const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const dns = require('dns');
const app = express()

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

// Register at ipstack.com to get a free API key and enter it here
const apiKey = '298877b144bc9c3f4165ea0fe436f486';

// Get the index file
app.get('/', function (req, res) {
    res.render('index');
});

// Load geolocated page from index
app.get('/geolocate?', function (req, res) {
    let domain = req.query.domain;

    // Get domain IP
    dns.lookup(domain, function onLookup(err, addresses, family) {
        // Address(es) is the IP address of the domain
        let url = `http://api.ipstack.com/${addresses}?access_key=${apiKey}`
        if (err) {
            // If DNS lookup errored
            res.render('geolocated', { domain: null, location: null, error: `Error ${domain} is not a valid domain, please enter a valid domain`});
        } else {
            // Geolocate IP address using ipstack API
            request(url, function(err, response, body) {
                let location = JSON.parse(body);
                if (err) {
                    // If ipstack API errored
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
