# node-sops 🔐

A robust, easy-to-use secrets management solution for Node.js projects, inspired by Mozilla SOPS but purpose-built for JavaScript/TypeScript environments.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node: >=14](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)](https://nodejs.org/en/download/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 🌟 Features

- **Military-Grade Encryption**: AES-256-CBC encryption for your sensitive data
- **Multiple Format Support**: Works seamlessly with YAML and JSON files
- **Easy Key Management**: Simple key generation and secure sharing capabilities
- **Developer-Friendly API**: Clean programmatic interface for integration
- **Powerful CLI**: Comprehensive command-line tools for manual operations
- **TypeScript Support**: Built with type safety for modern development
- **Zero External Crypto Dependencies**: Uses Node.js built-in crypto module
- **Minimal Dependencies**: Lightweight with few production dependencies

## 📋 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [CLI Usage](#-cli-usage)
- [Programmatic Usage](#-programmatic-usage)
- [File Formats](#-file-formats)
- [Security Best Practices](#-security-best-practices)
- [Advanced Usage](#-advanced-usage)
- [Migration Guide](#-migration-guide)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Installation

```bash
npm install node-sops
```

Or with Yarn:

```bash
yarn add node-sops
```

## 🏃‍♂️ Quick Start

1. Initialize a new encryption key:
   ```bash
   npx node-sops init
   ```

2. Create a YAML or JSON file with your secrets:
   ```yaml
   # secrets.yaml
   data:
     api:
       key: "your-api-key"
       secret: "your-api-secret"
   ```

3. Encrypt your secrets:
   ```bash
   npx node-sops encrypt -i secrets.yaml -o secrets.enc.json
   ```

4. Add `.sops-key` to your `.gitignore` file and commit only the encrypted file.

## 🖥️ CLI Usage

### Initialize a new encryption key

```bash
npx node-sops init
```

### Encrypt a secrets file

```bash
npx node-sops encrypt -i secrets.yaml -o secrets.enc.json
```

### Decrypt a secrets file

```bash
npx node-sops decrypt -i secrets.enc.json -o secrets.yaml
```

### View decrypted content without writing to a file

```bash
npx node-sops view -i secrets.enc.json
```

### Get a specific value using dot notation

```bash
npx node-sops get -i secrets.enc.json -k data.api.key
```

### Rotate encryption key

```bash
npx node-sops rotate -i secrets.enc.json -o secrets.enc.json
```

## 💻 Programmatic Usage

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

// Get a specific value using dot notation
const apiKey = sops.get('secrets.enc.json', 'data.api.key');
console.log(apiKey);
```

For TypeScript users:

```typescript
import { Sops } from 'node-sops';

// Same API as above, with full type safety
const sops = new Sops();
const config = sops.view('secrets.enc.json');
// config is properly typed!
```

## 📄 File Formats

node-sops supports both YAML and JSON files for plaintext secrets, with the encrypted output always in JSON format.

**Example YAML input:**
```yaml
data:
  # API credentials
  api:
    key: your_api_key
    secret: your_api_secret
  
  # Database credentials
  database:
    username: db_user
    password: db_password
```

**After encryption (JSON format):**
```json
{
  "iv": "base64_encoded_initialization_vector",
  "content": "base64_encoded_encrypted_content",
  "metadata": {
    "encryptedAt": "2023-04-25T12:00:00.000Z",
    "version": "1.0"
  }
}
```

## 🔒 Security Best Practices

1. **Never commit the key file (.sops-key) to git**
2. Add `.sops-key` to your `.gitignore` file
3. Share the key securely with team members who need access
4. Only commit the encrypted files to version control
5. Consider using environment variables for production deployments
6. Rotate keys periodically for enhanced security
7. Use role-based access control for key management in team settings

## 🧩 Advanced Usage

### Environment Variable Integration

```javascript
const { Sops } = require('node-sops');

function loadSecrets() {
  const sops = new Sops();
  const secrets = sops.view('secrets.enc.json');
  
  // Add secrets to process.env
  Object.entries(secrets.data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      process.env[key.toUpperCase()] = value;
    }
  });
}

// Call early in your application bootstrap
loadSecrets();
```

### Custom Key Path

```javascript
const sops = new Sops({ keyPath: '/custom/path/to/.custom-key' });
```

### In-Memory Operations

```javascript
// Encrypt content directly
const plainContent = { api: { key: 'secret_value' } };
const encrypted = sops.encryptContent(plainContent);

// Decrypt content directly
const decrypted = sops.decryptContent(encrypted);
```

## 🔄 Migration Guide

### From v0.x to v1.0

If you're upgrading from an earlier version, please note these changes:

1. Key format has changed for enhanced security
2. API method signatures remain backward compatible
3. New features include content encryption and key rotation

Migration steps:
1. Install the latest version
2. Use the `rotate` command to update your encrypted files
3. Update any scripts that directly access internal properties

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

MIT