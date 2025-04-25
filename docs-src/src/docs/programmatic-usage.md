---
sidebar_position: 4
title: Programmatic Usage
---

# Programmatic API

Node SOPS provides a clean and intuitive API for integrating secret management directly into your Node.js applications. This guide covers the complete programmatic interface for both JavaScript and TypeScript users.

## Basic Usage

### JavaScript

```javascript
const { Sops } = require('node-sops');

// Create a new Sops instance
const sops = new Sops();

// Encrypt a file
sops.encrypt('secrets.yaml', 'secrets.enc.json');

// Decrypt a file
sops.decrypt('secrets.enc.json', 'secrets.yaml');

// View decrypted content
const secrets = sops.view('secrets.enc.json');
console.log(secrets);

// Get a specific value
const apiKey = sops.get('secrets.enc.json', 'data.api.key');
console.log(apiKey);
```

### TypeScript

```typescript
import { Sops } from 'node-sops';

// Create a new Sops instance
const sops = new Sops();

// Encrypt a file
sops.encrypt('secrets.yaml', 'secrets.enc.json');

// Decrypt a file
sops.decrypt('secrets.enc.json', 'secrets.yaml');

// View decrypted content with type safety
interface Secrets {
  data: {
    api: {
      key: string;
      secret: string;
    };
    database: {
      username: string;
      password: string;
    };
  };
}

const secrets = sops.view<Secrets>('secrets.enc.json');
console.log(secrets.data.api.key); // TypeScript knows this is a string

// Get a specific value
const apiKey = sops.get('secrets.enc.json', 'data.api.key');
console.log(apiKey);
```

## API Reference

### Constructor

```typescript
new Sops(options?: SopsOptions)
```

**Options:**

| Option | Type | Description |
| ------ | ---- | ----------- |
| `keyPath` | `string` | Path to the encryption key file (default: `.sops-key`) |

**Example:**

```javascript
const sops = new Sops({
  keyPath: './config/.custom-key'
});
```

### Methods

#### initialize

Initializes a new encryption key.

```typescript
initialize(options?: InitOptions): string
```

**Options:**

| Option | Type | Description |
| ------ | ---- | ----------- |
| `force` | `boolean` | Overwrite existing key file if it exists (default: `false`) |
| `keyPath` | `string` | Override the instance keyPath for this operation |

**Returns:** The generated encryption key as a string.

**Example:**

```javascript
try {
  const key = sops.initialize();
  console.log('Created new key:', key);
} catch (error) {
  console.log('Key already exists');
}

// Force overwrite existing key
const newKey = sops.initialize({ force: true });
```

#### encrypt

Encrypts a plaintext file containing secrets.

```typescript
encrypt(inputPath: string, outputPath: string, options?: OperationOptions): void
```

**Options:**

| Option | Type | Description |
| ------ | ---- | ----------- |
| `keyPath` | `string` | Override the instance keyPath for this operation |

**Example:**

```javascript
// Encrypt a YAML file
sops.encrypt('secrets.yaml', 'secrets.enc.json');

// Use a custom key file for this operation
sops.encrypt('secrets.yaml', 'secrets.enc.json', {
  keyPath: './special-key'
});
```

#### decrypt

Decrypts an encrypted file.

```typescript
decrypt(inputPath: string, outputPath: string, options?: DecryptOptions): void
```

**Options:**

| Option | Type | Description |
| ------ | ---- | ----------- |
| `keyPath` | `string` | Override the instance keyPath for this operation |
| `format` | `'yaml'` \| `'json'` | Force output format (default: inferred from output file extension) |

**Example:**

```javascript
// Decrypt to a YAML file
sops.decrypt('secrets.enc.json', 'secrets.yaml');

// Explicitly specify the output format
sops.decrypt('secrets.enc.json', 'secrets.txt', {
  format: 'yaml'
});
```

#### view

Reads and decrypts an encrypted file, returning the contents as an object.

```typescript
view<T = any>(inputPath: string, options?: OperationOptions): T
```

**Options:**

| Option | Type | Description |
| ------ | ---- | ----------- |
| `keyPath` | `string` | Override the instance keyPath for this operation |

**Returns:** The decrypted content as an object.

**Example:**

```javascript
// View the decrypted content
const secrets = sops.view('secrets.enc.json');
console.log(secrets.data.api.key);

// With TypeScript type safety
interface Config {
  data: {
    api: { key: string }
  }
}
const config = sops.view<Config>('secrets.enc.json');
```

#### get

Retrieves a specific value from an encrypted file using a dot-notation path.

```typescript
get(inputPath: string, dotPath: string, options?: OperationOptions): any
```

**Options:**

| Option | Type | Description |
| ------ | ---- | ----------- |
| `keyPath` | `string` | Override the instance keyPath for this operation |

**Returns:** The specific value at the requested path.

**Example:**

```javascript
// Get a specific value
const apiKey = sops.get('secrets.enc.json', 'data.api.key');
console.log(apiKey);

// Get a nested value
const dbPassword = sops.get('secrets.enc.json', 'data.database.password');
```

#### rotate

Re-encrypts an encrypted file with a new initialization vector.

```typescript
rotate(inputPath: string, outputPath?: string, options?: OperationOptions): void
```

**Options:**

| Option | Type | Description |
| ------ | ---- | ----------- |
| `keyPath` | `string` | Override the instance keyPath for this operation |

**Example:**

```javascript
// Rotate encryption in place
sops.rotate('secrets.enc.json');

// Rotate to a new file
sops.rotate('secrets.enc.json', 'new-secrets.enc.json');
```

#### encryptContent

Encrypts a JavaScript object directly without reading from or writing to files.

```typescript
encryptContent(content: any, options?: OperationOptions): EncryptedContent
```

**Options:**

| Option | Type | Description |
| ------ | ---- | ----------- |
| `keyPath` | `string` | Override the instance keyPath for this operation |

**Returns:** An object containing the encrypted content and metadata.

**Example:**

```javascript
const plainContent = {
  api: {
    key: 'secret_value'
  }
};
const encrypted = sops.encryptContent(plainContent);
console.log(encrypted);
// { iv: '...', content: '...', metadata: { ... } }
```

#### decryptContent

Decrypts an encrypted content object directly without reading from or writing to files.

```typescript
decryptContent<T = any>(content: EncryptedContent, options?: OperationOptions): T
```

**Options:**

| Option | Type | Description |
| ------ | ---- | ----------- |
| `keyPath` | `string` | Override the instance keyPath for this operation |

**Returns:** The decrypted content as an object.

**Example:**

```javascript
const encrypted = sops.encryptContent(plainContent);
const decrypted = sops.decryptContent(encrypted);
console.log(decrypted);
// { api: { key: 'secret_value' } }
```

## Environment Variable Integration

A common pattern is to load secrets from an encrypted file and inject them into environment variables:

```javascript
const { Sops } = require('node-sops');

function loadSecrets() {
  const sops = new Sops();
  const secrets = sops.view('secrets.enc.json');
  
  // Add secrets to process.env
  Object.entries(secrets.data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      process.env[key.toUpperCase()] = value;
    } else {
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (typeof subValue === 'string') {
          process.env[`${key.toUpperCase()}_${subKey.toUpperCase()}`] = subValue;
        }
      });
    }
  });
}

// Call early in your application bootstrap
loadSecrets();
```

## Error Handling

Node SOPS throws descriptive error objects when operations fail. It's a good practice to use try/catch blocks when calling API methods:

```javascript
try {
  const secrets = sops.view('secrets.enc.json');
  // Use secrets...
} catch (error) {
  console.error('Failed to decrypt secrets:', error.message);
  // Handle the error appropriately
}
```

## TypeScript Type Definitions

Node SOPS includes comprehensive TypeScript definitions. The main interfaces are:

```typescript
interface SopsOptions {
  keyPath?: string;
}

interface InitOptions {
  force?: boolean;
  keyPath?: string;
}

interface OperationOptions {
  keyPath?: string;
}

interface DecryptOptions extends OperationOptions {
  format?: 'yaml' | 'json';
}

interface EncryptedContent {
  iv: string;
  content: string;
  metadata: {
    encryptedAt: string;
    version: string;
  };
}
```