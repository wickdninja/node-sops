---
sidebar_position: 2
title: JavaScript API
---

# JavaScript API Reference

This page documents the complete API for using Node SOPS programmatically in a JavaScript project.

## Installation

```bash
npm install node-sops
```

## Basic Usage

```javascript
const { Sops } = require('node-sops');

// Create a new instance
const sops = new Sops();

// Initialize a new key (if not already created)
try {
  sops.initialize();
} catch (error) {
  // Key already exists
}

// Encrypt a file
sops.encrypt('secrets.yaml', 'secrets.enc.json');

// Decrypt a file
sops.decrypt('secrets.enc.json', 'secrets.yaml');

// View decrypted content
const data = sops.view('secrets.enc.json');
console.log(data);

// Get a specific value
const apiKey = sops.get('secrets.enc.json', 'data.api.key');
console.log(apiKey);
```

## API Reference

### Class: Sops

The main class for interacting with Node SOPS functionality.

#### Constructor

```javascript
const sops = new Sops(options);
```

**Parameters:**

- `options` (Object, optional): Configuration options
  - `keyPath` (string, optional): Path to the encryption key file. Default: `.sops-key`

**Example:**

```javascript
// Using default key path
const defaultSops = new Sops();

// Using custom key path
const customSops = new Sops({
  keyPath: './config/custom-key'
});
```

#### Method: initialize

Initializes a new encryption key.

```javascript
sops.initialize(options);
```

**Parameters:**

- `options` (Object, optional): Initialization options
  - `force` (boolean, optional): Overwrite existing key if present. Default: `false`
  - `keyPath` (string, optional): Override the instance's keyPath for this operation

**Returns:**

- (string): The generated encryption key

**Throws:**

- Error if key already exists and `force` is not `true`

**Example:**

```javascript
try {
  const key = sops.initialize();
  console.log('New key created:', key);
} catch (error) {
  console.error('Key already exists');
}

// Force create a new key
const newKey = sops.initialize({ force: true });
```

#### Method: encrypt

Encrypts a plaintext file containing secrets.

```javascript
sops.encrypt(inputPath, outputPath, options);
```

**Parameters:**

- `inputPath` (string): Path to the input file (YAML or JSON)
- `outputPath` (string): Path where the encrypted file will be written
- `options` (Object, optional): Encryption options
  - `keyPath` (string, optional): Override the instance's keyPath for this operation

**Throws:**

- Error if input file cannot be read or output file cannot be written
- Error if encryption fails

**Example:**

```javascript
// Basic usage
sops.encrypt('secrets.yaml', 'secrets.enc.json');

// With custom key path for this operation
sops.encrypt('secrets.yaml', 'secrets.enc.json', {
  keyPath: './special-project-key'
});
```

#### Method: decrypt

Decrypts an encrypted file to its original plaintext form.

```javascript
sops.decrypt(inputPath, outputPath, options);
```

**Parameters:**

- `inputPath` (string): Path to the encrypted file
- `outputPath` (string): Path where the decrypted file will be written
- `options` (Object, optional): Decryption options
  - `keyPath` (string, optional): Override the instance's keyPath for this operation
  - `format` (string, optional): Force output format to 'yaml' or 'json'. Default: inferred from output file extension

**Throws:**

- Error if input file cannot be read or output file cannot be written
- Error if decryption fails

**Example:**

```javascript
// Basic usage
sops.decrypt('secrets.enc.json', 'secrets.yaml');

// Force YAML format regardless of extension
sops.decrypt('secrets.enc.json', 'secrets.config', {
  format: 'yaml'
});
```

#### Method: view

Reads and decrypts an encrypted file, returning the contents as an object.

```javascript
const data = sops.view(inputPath, options);
```

**Parameters:**

- `inputPath` (string): Path to the encrypted file
- `options` (Object, optional): View options
  - `keyPath` (string, optional): Override the instance's keyPath for this operation

**Returns:**

- (Object): The decrypted content as a JavaScript object

**Throws:**

- Error if input file cannot be read
- Error if decryption fails

**Example:**

```javascript
const secrets = sops.view('secrets.enc.json');
console.log(secrets.data.api.key);
```

#### Method: get

Retrieves a specific value from an encrypted file using a dot-notation path.

```javascript
const value = sops.get(inputPath, dotPath, options);
```

**Parameters:**

- `inputPath` (string): Path to the encrypted file
- `dotPath` (string): Dot-notation path to the value (e.g., 'data.api.key')
- `options` (Object, optional): Get options
  - `keyPath` (string, optional): Override the instance's keyPath for this operation

**Returns:**

- (any): The value at the specified path

**Throws:**

- Error if input file cannot be read
- Error if decryption fails
- Error if path does not exist in the decrypted content

**Example:**

```javascript
// Get a specific value
const apiKey = sops.get('secrets.enc.json', 'data.api.key');
console.log('API Key:', apiKey);

// Get a nested value
const dbPassword = sops.get('secrets.enc.json', 'data.database.password');
```

#### Method: rotate

Re-encrypts an encrypted file with a new initialization vector.

```javascript
sops.rotate(inputPath, outputPath, options);
```

**Parameters:**

- `inputPath` (string): Path to the encrypted file
- `outputPath` (string, optional): Path where the re-encrypted file will be written. Default: same as inputPath
- `options` (Object, optional): Rotate options
  - `keyPath` (string, optional): Override the instance's keyPath for this operation

**Throws:**

- Error if input file cannot be read or output file cannot be written
- Error if decryption or re-encryption fails

**Example:**

```javascript
// Rotate in place (overwrites the original file)
sops.rotate('secrets.enc.json');

// Rotate to a new file
sops.rotate('secrets.enc.json', 'rotated-secrets.enc.json');
```

#### Method: encryptContent

Encrypts a JavaScript object directly without reading from or writing to files.

```javascript
const encrypted = sops.encryptContent(content, options);
```

**Parameters:**

- `content` (Object): The data to encrypt
- `options` (Object, optional): Encryption options
  - `keyPath` (string, optional): Override the instance's keyPath for this operation

**Returns:**

- (Object): An object containing the encrypted content and metadata
  - `iv` (string): Base64-encoded initialization vector
  - `content` (string): Base64-encoded encrypted content
  - `metadata` (Object): Encryption metadata
    - `encryptedAt` (string): ISO date string when the content was encrypted
    - `version` (string): Schema version

**Throws:**

- Error if encryption fails or key cannot be read

**Example:**

```javascript
const plainContent = {
  api: {
    key: 'secret_value'
  }
};

const encrypted = sops.encryptContent(plainContent);
console.log(encrypted);
```

#### Method: decryptContent

Decrypts an encrypted content object directly without reading from or writing to files.

```javascript
const decrypted = sops.decryptContent(encryptedContent, options);
```

**Parameters:**

- `encryptedContent` (Object): The encrypted content object (as returned by `encryptContent`)
  - `iv` (string): Base64-encoded initialization vector
  - `content` (string): Base64-encoded encrypted content
  - `metadata` (Object): Encryption metadata
- `options` (Object, optional): Decryption options
  - `keyPath` (string, optional): Override the instance's keyPath for this operation

**Returns:**

- (Object): The decrypted content as a JavaScript object

**Throws:**

- Error if decryption fails or key cannot be read

**Example:**

```javascript
// First encrypt some content
const plainContent = { secret: 'value' };
const encrypted = sops.encryptContent(plainContent);

// Later decrypt it
const decrypted = sops.decryptContent(encrypted);
console.log(decrypted); // { secret: 'value' }
```

## Error Handling

All methods can throw errors if operations fail. It's recommended to use try/catch blocks when calling methods:

```javascript
try {
  const secrets = sops.view('secrets.enc.json');
  // Use the secrets...
} catch (error) {
  console.error('Failed to read secrets:', error.message);
  // Handle the error appropriately
}
```

## Environment Variable Integration

A common pattern is to load secrets into environment variables during application startup:

```javascript
const { Sops } = require('node-sops');

function loadSecrets() {
  try {
    const sops = new Sops();
    const secrets = sops.view('secrets.enc.json');
    
    // Add secrets to process.env
    Object.entries(secrets.data).forEach(([key, value]) => {
      if (typeof value === 'string') {
        process.env[key.toUpperCase()] = value;
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (typeof subValue === 'string') {
            process.env[`${key.toUpperCase()}_${subKey.toUpperCase()}`] = subValue;
          }
        });
      }
    });
    
    console.log('Secrets loaded successfully');
  } catch (error) {
    console.error('Failed to load secrets:', error.message);
    process.exit(1); // Exit if secrets cannot be loaded
  }
}

// Call early in your application bootstrap
loadSecrets();
```