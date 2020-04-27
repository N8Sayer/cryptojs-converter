const FileSystem = require('fs');
const { writeFileSyncRecursive } = require('./writeFileSyncRecursive');
const CryptoJS = require('crypto-js');

class Safe {
  constructor(filePath, password) {
    this.filePath = filePath;
    this.password = password;
  }

  encryptAsync(data) {
    console.log('Encrypting data...');
    return new Promise((resolve, reject) => {
      try {
        let ciphertext = CryptoJS.AES.encrypt(
          JSON.stringify(data),
          this.password
        ).toString();
        writeFileSyncRecursive(this.filePath, ciphertext, 'utf8');
        resolve('Finished encrypting data');
      } catch (exception) {
        reject({ message: exception.message });
      }
    });
  }

  decryptAsync() {
    console.log('\nDecrypting data...');
    return new Promise((resolve, reject) => {
      FileSystem.readFile(this.filePath, (error, data) => {
        if (error) {
          reject(error);
        }
        try {
          const encryptedString = data.toString('utf8');
          const bytes = CryptoJS.AES.decrypt(encryptedString, this.password);
          const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          resolve(decrypted);
        } catch (exception) {
          reject(exception.message);
        }
      });
    });
  }
}

exports.Safe = Safe;
