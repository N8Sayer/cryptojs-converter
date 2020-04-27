const FileSystem = require('fs');
const { Safe } = require('./safe');
const argv = require('yargs').argv;

const { filepath, output, passphrase } = argv;
if (!passphrase) {
  console.log('Passphrase required. Use --passphrase.');
  return;
}
if (!filepath) {
  console.log('Filepath required. Use --filepath.');
  return;
}
if (!output) {
  console.log('No output filename. Overwriting original file.');
}
const data = FileSystem.readFileSync(filepath, 'utf8');

var safe = new Safe(output || filepath, passphrase);
safe
  .encryptAsync(data)
  .then(() => {
    console.log('Encrypted file created.');
  })
  .catch((err) => {
    console.error(err);
  });
