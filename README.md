# Domain Geolocation App
A small web application demonstrating how to geolocate domains. Users can enter a domain (i.e. github.com) to geolocate the location of the host server using a DNS and ipstack's API. See a live demo [here](https://domain-geolocation-app.herokuapp.com/).

This web application for built for the GEOG 483 W2020 Tutorial assignment.

## Prerequisites
Download and install [node.js](https://nodejs.org/en/)

Sign up and get a free API key from [ipstack](https://ipstack.com/)

## Installation
1. Clone/download this repository on to your computer.
2. In the repository's folder run `npm install` in your terminal/shell
3. In `server.js`, enter your API key where the `**********` is.
4. Run `npm start` to run the app
5. Go to [localhost:3000](http//:localhost:3000)

## Usage
1. Enter a domain such as github.com (NOTE: `domain != URL`. See [here](https://www.copahost.com/blog/domain-vs-url/)).
2. A new page will load if the domain is valid, otherwise it will display an error.
3. On successful geolocation, an interactive [leaflet.js](https://leafletjs.com/) map will display with the user's and domain's approximate location from their IP addresses. The user can explore the map and click open the markers of the locations to see more information.
