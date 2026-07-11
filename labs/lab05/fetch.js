
const https = require("https")
// const fetch = require("node-fetch") // vesion before 3.0 install with npm install node-fetch@2
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)) // dont want to set "type": "module"
// import fetch from 'node-fetch'; // set "type": "module", but error on require
const request = https.request({
    hostname: "web-nang-cao.herokuapp.com",
    path: "/lab5/users",
    port: 443,
    method: "GET"
}, res => {
    let body = ''
    res.on('data', (d) => { body += d.toString() })
    res.on('end', () => { console.log(JSON.parse(body)) })
    res.on('error', (err) => { console.log(e) })
    res.statusCode != 200
}
)

request.on('error', err => { console.log(err) })
request.end();

