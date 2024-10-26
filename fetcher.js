const needle = require("needle"); // using needle for HTTP requests
const fs = require("fs").promises; // Use the Promise-based fs module

// validate user input for missing arguments
if (!process.argv[2] || !process.argv[3]) {
  console.error(
    "Error: Missing arguments.\nUsage: > node fetcher.js <URL> <local file path>"
  );
  process.exit(1);
}

// Store user input arguments
const inputs = {
  URL: process.argv[2].trim(),
  Path: process.argv[3].trim(),
};

// Define an async function to use await
async function fetchAndSave() {
  try {
    const response = await needle("get", inputs.URL); // Fetch the data from the URL

    // Error handling for HTTP responses
    if (response.statusCode !== 200) {
      throw new Error(
        `Failed to download the resource: HTTP Status ${response.statusCode}`
      );
    }

    const body = response.body;
    
    await fs.writeFile(inputs.Path, body); // Write the data to the file
    
    console.log(`Downloaded and saved ${body.length} bytes to ${inputs.Path}`); // Success message
  } catch (error) {
    console.error(`Error: ${error.message}`); // Handle any errors that occurred during the fetch or write
    process.exit(1); 
  }
}

fetchAndSave(); // Call the async function