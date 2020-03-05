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

    // Get user's local IP
    var user_ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress || 
        req.connection.socket.remoteAddress;

    // Get domain IP
    dns.lookup(domain, function onLookup(err, domain_ip, family) {
        // Address(es) is the IP address of the domain
        let geolocate_user_url = `http://api.ipstack.com/${user_ip}?access_key=${apiKey}`
        // Address(es) is the IP address of the domain
        let geolocate_domain_url = `http://api.ipstack.com/${domain_ip}?access_key=${apiKey}`

        if (err) {
            // If DNS lookup errored
            res.render('geolocated', { domain: null, location: null, error: `Error ${domain} is not a valid domain, please enter a valid domain`});
        } else {
            // Geolocate user IP using ipstack API
            request(geolocate_user_url, function(err, response, body) {
                let user_location = JSON.parse(body);
                if (err) {
                    res.render('geolocated', {
                        domain: domain,
                        user_location: null,
                        domain_location: null,
                        error: 'Error, please try again'
                    });
                } else {
                    // Geolocate domain IP address using ipstack API
                    request(geolocate_domain_url, function(err, response, body) {
                        let domain_location = JSON.parse(body);
                        if (err) {
                            // If ipstack API errored
                            res.render('geolocated', {
                                domain: domain,
                                user_location: null,
                                domain_location: null,
                                error: 'Error, please try again'
                            });
                        } else {
                            res.render('geolocated',{
                                domain: domain,
                                user_location: user_location,
                                domain_location: domain_location,
                                error: null
                            });
                        }
                    });
                }
            });
        }
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port 3000!')
});
