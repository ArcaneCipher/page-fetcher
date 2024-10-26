const needle = require("needle");
const fs = require("node:fs");
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

// validate user input for missing arguments
if (!process.argv[2] || !process.argv[3]) {
  console.error('Error: Missing arguments.\nUsage: > node fetcher.js <URL> <local file path>');
  process.exit(1);
}; 

// Store user input arguments
const inputs = {
  URL: process.argv[2].trim(),
  Path: process.argv[3].trim(),
};


needle.get(inputs.URL, (error, response, body) => {
  // Error Handling for HTTP Requests
  if (error) {
    console.error(`Failed to download the resource: ${error.message}`);
    process.exit(1);
  }

  if (response.statusCode !== 200) {
    console.error(`Failed to download the resource: HTTP Status ${response.statusCode}`);
    process.exit(1);
  }

  // console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received

  fs.writeFile(inputs.Path, body, { flag: "w" }, (err) => {
    // File System Error Handling
    if (err) {
      console.error(`Failed to write to file: ${err.message}`);
      process.exit(1); // exit on write errors
    } else {
      // file written successfully
      console.log(
        `Downloaded and saved ${body.length} bytes to ${inputs.Path}`
      );
    }
  });
});
