const needle = require('needle');
const fs = require('node:fs');

const inputs = {
  URL: process.argv[2].trim(),
  Path: process.argv[3].trim()
};

const content = 'Some content!';

needle.get(inputs.URL, (error, response, body) => {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//  console.log('body:', body); // Print the HTML for the Google homepage.

fs.writeFile(inputs.Path, content, { flag: 'a+' }, err => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
    console.log(`Downloaded and saved 1235 bytes to ${inputs.Path}`);
  }
});

});



// /* const conn = net.createConnection({ 
//   host: argvUrl,
//   port: 80
// });
//  */

// needle.setEncoding('UTF8');

// needle.on('connect', () => {
//   console.log(`Connected to server!`);

//   needle.write(`GET / HTTP/1.1\r\n`);
//   needle.write(`Host: example.edu\r\n`);
//   needle.write(`\r\n`);
// });

// /** 
//  * HTTP Response
//  * After request is made, the HTTP server should send us HTTP data via our TCP connection
//  * Print the data to the screen, and end the connection
//  */
// needle.on('data', (data) => {
//   console.log(data);
//   needle.end();
// });