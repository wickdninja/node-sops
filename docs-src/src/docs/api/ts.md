---
sidebar_position: 3
title: TypeScript API
---

# TypeScript API Reference

This page documents the complete API for using Node SOPS in a TypeScript project, including all type definitions.

## Installation

```bash
npm install node-sops
```

Node SOPS includes TypeScript type definitions out of the box, so there's no need to install separate `@types` packages.

## Basic Usage

```typescript
import { Sops } from 'node-sops';

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

// Define your secrets structure type
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

// View decrypted content with type safety
const secrets = sops.view<Secrets>('secrets.enc.json');
console.log(secrets.data.api.key); // TypeScript knows this is a string

// Get a specific value
const apiKey = sops.get('secrets.enc.json', 'data.api.key');
console.log(apiKey);
```

## API Reference

### Type Definitions

```typescript
/**
 * Options for constructing a Sops instance
 */
interface SopsOptions {
  /**
   * Path to the encryption key file
   * @default '.sops-key'
   */
  keyPath?: string;
}

/**
 * Options for initializing a new encryption key
 */
interface InitOptions {
  /**
   * Overwrite existing key if present
   * @default false
   */
  force?: boolean;
  
  /**
   * Override the instance's keyPath for this operation
   */
  keyPath?: string;
}

/**
 * Common options for operations
 */
interface OperationOptions {
  /**
   * Override the instance's keyPath for this operation
   */
  keyPath?: string;
}

/**
 * Options for decryption operations
 */
interface DecryptOptions extends OperationOptions {
  /**
   * Force output format
   * @default Inferred from output file extension
   */
  format?: 'yaml' | 'json';
}

/**
 * Structure of encrypted content
 */
interface EncryptedContent {
  /**
   * Base64-encoded initialization vector
   */
  iv: string;
  
  /**
   * Base64-encoded encrypted content
   */
  content: string;
  
  /**
   * Metadata about the encryption
   */
  metadata: {
    /**
     * ISO date string of when the content was encrypted
     */
    encryptedAt: string;
    
    /**
     * Schema version
     */
    version: string;
  };
}
```

### Class: Sops

The main class for interacting with Node SOPS functionality.

#### Constructor

```typescript
class Sops {
  constructor(options?: SopsOptions);
}
```

**Parameters:**

- `options` (SopsOptions, optional): Configuration options
  - `keyPath` (string, optional): Path to the encryption key file. Default: `.sops-key`

**Example:**

```typescript
// Using default key path
const defaultSops = new Sops();

// Using custom key path
const customSops = new Sops({
  keyPath: './config/custom-key'
});
```

#### Method: initialize

Initializes a new encryption key.

```typescript
initialize(options?: InitOptions): string;
```

**Parameters:**

- `options` (InitOptions, optional): Initialization options
  - `force` (boolean, optional): Overwrite existing key if present. Default: `false`
  - `keyPath` (string, optional): Override the instance's keyPath for this operation

**Returns:**

- (string): The generated encryption key

**Throws:**

- Error if key already exists and `force` is not `true`

**Example:**

```typescript
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

```typescript
encrypt(inputPath: string, outputPath: string, options?: OperationOptions): void;
```

**Parameters:**

- `inputPath` (string): Path to the input file (YAML or JSON)
- `outputPath` (string): Path where the encrypted file will be written
- `options` (OperationOptions, optional): Encryption options
  - `keyPath` (string, optional): Override the instance's keyPath for this operation

**Throws:**

- Error if input file cannot be read or output file cannot be written
- Error if encryption fails

**Example:**

```typescript
// Basic usage
sops.encrypt('secrets.yaml', 'secrets.enc.json');

// With custom key path for this operation
sops.encrypt('secrets.yaml', 'secrets.enc.json', {
  keyPath: './special-project-key'
});
```

#### Method: decrypt

Decrypts an encrypted file to its original plaintext form.

```typescript
decrypt(inputPath: string, outputPath: string, options?: DecryptOptions): void;
```

**Parameters:**

- `inputPath` (string): Path to the encrypted file
- `outputPath` (string): Path where the decrypted file will be written
- `options` (DecryptOptions, optional): Decryption options
  - `keyPath` (string, optional): Override the instance's keyPath for this operation
  - `format` ('yaml' | 'json', optional): Force output format. Default: inferred from output file extension

**Throws:**

- Error if input file cannot be read or output file cannot be written
- Error if decryption fails

**Example:**

```typescript
// Basic usage
sops.decrypt('secrets.enc.json', 'secrets.yaml');

// Force YAML format regardless of extension
sops.decrypt('secrets.enc.json', 'secrets.config', {
  format: 'yaml'
});
```

#### Method: view

Reads and decrypts an encrypted file, returning the contents as an object with type safety.

```typescript
view<T = any>(inputPath: string, options?: OperationOptions): T;
```

**Type Parameters:**

- `T` (default: any): The type of the decrypted content

**Parameters:**

- `inputPath` (string): Path to the encrypted file
- `options` (OperationOptions, optional): View options
  - `keyPath` (string, optional): Override the instance's keyPath for this operation

**Returns:**

- (T): The decrypted content as an object of type T

**Throws:**

- Error if input file cannot be read
- Error if decryption fails

**Example:**

```typescript
// Define your secrets structure
interface Secrets {
  data: {
    api: {
      key: string;
      secret: string;
    };
  };
}

// Get typed secrets
const secrets = sops.view<Secrets>('secrets.enc.json');

// TypeScript knows this is a string
const apiKey = secrets.data.api.key;
```

#### Method: get

Retrieves a specific value from an encrypted file using a dot-notation path.

```typescript
get(inputPath: string, dotPath: string, options?: OperationOptions): any;
```

**Parameters:**

- `inputPath` (string): Path to the encrypted file
- `dotPath` (string): Dot-notation path to the value (e.g., 'data.api.key')
- `options` (OperationOptions, optional): Get options
  - `keyPath` (string, optional): Override the instance's keyPath for this operation

**Returns:**

- (any): The value at the specified path

**Throws:**

- Error if input file cannot be read
- Error if decryption fails
- Error if path does not exist in the decrypted content

**Example:**

```typescript
// Get a specific value
const apiKey = sops.get('secrets.enc.json', 'data.api.key');
console.log('API Key:', apiKey);

// Get a nested value
const dbPassword = sops.get('secrets.enc.json', 'data.database.password');
```

#### Method: rotate

Re-encrypts an encrypted file with a new initialization vector.

```typescript
rotate(inputPath: string, outputPath?: string, options?: OperationOptions): void;
```

**Parameters:**

- `inputPath` (string): Path to the encrypted file
- `outputPath` (string, optional): Path where the re-encrypted file will be written. Default: same as inputPath
- `options` (OperationOptions, optional): Rotate options
  - `keyPath` (string, optional): Override the instance's keyPath for this operation

**Throws:**

- Error if input file cannot be read or output file cannot be written
- Error if decryption or re-encryption fails

**Example:**

```typescript
// Rotate in place (overwrites the original file)
sops.rotate('secrets.enc.json');

// Rotate to a new file
sops.rotate('secrets.enc.json', 'rotated-secrets.enc.json');
```

#### Method: encryptContent

Encrypts a JavaScript object directly without reading from or writing to files.

```typescript
encryptContent(content: any, options?: OperationOptions): EncryptedContent;
```

**Parameters:**

- `content` (any): The data to encrypt
- `options` (OperationOptions, optional): Encryption options
  - `keyPath` (string, optional): Override the instance's keyPath for this operation

**Returns:**

- (EncryptedContent): An object containing the encrypted content and metadata

**Throws:**

- Error if encryption fails or key cannot be read

**Example:**

```typescript
interface SecretData {
  api: {
    key: string;
  };
}

const plainContent: SecretData = {
  api: {
    key: 'secret_value'
  }
};

const encrypted = sops.encryptContent(plainContent);
console.log(encrypted);
```

#### Method: decryptContent

Decrypts an encrypted content object directly without reading from or writing to files, with type safety.

```typescript
decryptContent<T = any>(encryptedContent: EncryptedContent, options?: OperationOptions): T;
```

**Type Parameters:**

- `T` (default: any): The type of the decrypted content

**Parameters:**

- `encryptedContent` (EncryptedContent): The encrypted content object
- `options` (OperationOptions, optional): Decryption options
  - `keyPath` (string, optional): Override the instance's keyPath for this operation

**Returns:**

- (T): The decrypted content as an object of type T

**Throws:**

- Error if decryption fails or key cannot be read

**Example:**

```typescript
// Define the expected structure
interface SecretData {
  api: {
    key: string;
  };
}

// First encrypt some content
const plainContent: SecretData = { api: { key: 'secret_value' } };
const encrypted = sops.encryptContent(plainContent);

// Later decrypt it with type safety
const decrypted = sops.decryptContent<SecretData>(encrypted);

// TypeScript knows this is a string
const key = decrypted.api.key;
```

## Error Handling with TypeScript

All methods can throw errors if operations fail. In TypeScript, it's recommended to use try/catch blocks with type narrowing for error handling:

```typescript
try {
  const secrets = sops.view('secrets.enc.json');
  // Use the secrets...
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to read secrets:', error.message);
  } else {
    console.error('Unknown error occurred');
  }
  // Handle the error appropriately
}
```

## Advanced Type Examples

### Strong Typing for Nested Secrets

```typescript
interface ApiConfig {
  key: string;
  secret: string;
  endpoint: string;
}

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  api: ApiConfig;
  database: DatabaseConfig;
  features: {
    featureA: boolean;
    featureB: boolean;
  };
}

// Get strongly typed configuration
const config = sops.view<AppConfig>('app-config.enc.json');

// TypeScript provides full autocomplete and type checking
const apiEndpoint = config.api.endpoint;
const isDevelopment = config.environment === 'development';
const isFeatureAEnabled = config.features.featureA;
```

### Creating Type-Safe APIs with Node SOPS

```typescript
import { Sops } from 'node-sops';

// Define your configuration schema
interface Config {
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
  api: {
    key: string;
    timeout: number;
  };
}

// Create a strongly typed configuration service
class ConfigService {
  private readonly config: Config;
  
  constructor(configPath: string) {
    const sops = new Sops();
    this.config = sops.view<Config>(configPath);
  }
  
  getDatabaseConfig(): Config['database'] {
    return this.config.database;
  }
  
  getApiConfig(): Config['api'] {
    return this.config.api;
  }
  
  // Type-safe getter for any config property
  get<K extends keyof Config>(key: K): Config[K] {
    return this.config[key];
  }
}

// Usage
const configService = new ConfigService('config.enc.json');
const dbConfig = configService.getDatabaseConfig();
const apiTimeout = configService.get('api').timeout;
```