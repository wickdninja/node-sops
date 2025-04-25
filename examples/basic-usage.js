// Example usage of node-sops in a Node.js application

const { Sops } = require('node-sops');
const path = require('path');

// Path to your secrets files
const plainTextPath = path.join(__dirname, 'secrets.yml');
const encryptedPath = path.join(__dirname, 'secrets.enc.json');

async function main() {
  try {
    // Create a new Sops instance
    const sops = new Sops();

    // Step 1: Initialize a key if needed (usually done once)
    try {
      const key = sops.initialize();
      console.log('Created new key:', key);
    } catch (error) {
      console.log('Using existing key');
    }

    // Step 2: Encrypt your secrets file
    console.log(`Encrypting ${plainTextPath} to ${encryptedPath}`);
    sops.encrypt(plainTextPath, encryptedPath);
    console.log('Encryption complete');

    // Step 3: Later, when you need to access your secrets
    console.log('Reading encrypted secrets:');
    const secrets = sops.view(encryptedPath);
    console.log(JSON.stringify(secrets, null, 2));

    // Step 4: Get a specific value
    const apiKey = sops.get(encryptedPath, 'data.api.key');
    console.log('API Key:', apiKey);

    // Step 5: Maybe decrypt for local development
    // sops.decrypt(encryptedPath, plainTextPath);
    // console.log(`Decrypted to ${plainTextPath}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();