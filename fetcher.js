const needle = require('needle'); // Using needle for HTTP requests
const fs = require('fs').promises; // Use the Promise-based fs module
const fsSync = require('fs'); // For synchronous file checking
const readline = require('readline');
const path = require('path'); // For handling file paths

// Validate user input for missing arguments
if (!process.argv[2] || !process.argv[3]) {
  console.error(
    'Error: Missing arguments.\nUsage: > node fetcher.js <URL> <local file path>'
  );
  process.exit(1);
}

// Function to check if the URL includes a protocol
function hasProtocol(urlString) {
  return urlString.startsWith('http://') || urlString.startsWith('https://');
}

const urlInput = process.argv[2].trim();

// Check if the URL includes the protocol
if (!hasProtocol(urlInput)) {
  console.error(
    'Error: The URL is missing a protocol (http:// or https://). Please include it.'
  );
  process.exit(1);
}

// Store user input arguments
const inputs = {
  URL: urlInput,
  Path: process.argv[3].trim(),
};

// Function to check if file exists and prompt user
function checkFileAndPrompt() {
  return new Promise((resolve, reject) => {
    if (fsSync.existsSync(inputs.Path)) {
      // Create readline interface
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(`The file ${inputs.Path} already exists. Do you want to overwrite it? (Y/N) `, (answer) => {
        rl.close(); // Close the readline interface
        const answerTrimmed = answer.trim().toLowerCase();
        if (answerTrimmed === 'y' || answerTrimmed === 'yes') {
          // User consents to overwrite
          resolve();
        } else {
          console.log('Operation cancelled by the user.');
          process.exit(0);
        }
      });
    } else {
      // File doesn't exist; proceed
      resolve();
    }
  });
}

// Function to prompt the user to create the directory
function promptUserToCreateDirectory(dir) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`The directory ${dir} does not exist. Do you want to create it? (Y/N) `, (answer) => {
      rl.close();
      const answerTrimmed = answer.trim().toLowerCase();
      if (answerTrimmed === 'y' || answerTrimmed === 'yes') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// Define an async function to fetch and save the data
async function fetchAndSave() {
  try {
    // Fetch the data from the URL
    const response = await needle('get', inputs.URL);

    // Error handling for HTTP responses
    if (response.statusCode !== 200) {
      throw new Error(
        `Failed to download the resource: HTTP Status ${response.statusCode}`
      );
    }

    const body = response.body;

    // Extract the directory from the file path
    const directory = path.dirname(inputs.Path);

    // Check if the directory exists
    try {
      await fs.access(directory);
    } catch (err) {
      if (err.code === 'ENOENT') {
        // Directory does not exist
        const createDir = await promptUserToCreateDirectory(directory);
        if (createDir) {
          // Create the directory
          await fs.mkdir(directory, { recursive: true });
        } else {
          console.log('Operation cancelled by the user.');
          process.exit(0);
        }
      } else {
        // Other errors
        console.error(`Error accessing the directory: ${err.message}`);
        process.exit(1);
      }
    }

    // Write the data to the file
    await fs.writeFile(inputs.Path, body);

    // Success message
    console.log(`Downloaded and saved ${body.length} bytes to ${inputs.Path}`);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      console.error(
        'Error: The URL provided could not be reached. Please check the URL and try again.'
      );
    } else if (error.code === 'EACCES') {
      console.error(
        'Error: Permission denied. You do not have permission to write to this location.'
      );
    } else if (error.code === 'ENOENT') {
      console.error(
        `Error: The file path ${inputs.Path} is invalid. Please check the path and try again.`
      );
    } else if (error.code === 'EINVAL' || error.code === 'EBADF') {
      console.error(
        `Error: The file path ${inputs.Path} contains invalid characters.`
      );
    } else {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

// Main execution flow
(async () => {
  try {
    await checkFileAndPrompt();
    await fetchAndSave();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
})();
