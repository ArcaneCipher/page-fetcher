const fs = require('node:fs');

const argvUrl = process.argv[2].trim();
const argvPath = process.argv[3].trim();

const content = 'Some content!';

fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
    console.log(`Downloaded and saved 1235 bytes to ${argvPath}`);
  }
});
