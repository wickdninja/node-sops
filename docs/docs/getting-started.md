---
sidebar_position: 2
title: Getting Started
---

# Getting Started with Node SOPS

This guide will walk you through the installation process and basic usage of Node SOPS.

## Installation

Node SOPS is available on npm and can be installed using npm or yarn:

```bash
npm install node-sops
```

Or with Yarn:

```bash
yarn add node-sops
```

## Quick Start

Following is a step-by-step guide to get up and running with Node SOPS.

### Step 1: Initialize a new encryption key

First, you need to generate an encryption key:

```bash
npx node-sops init
```

This command creates a `.sops-key` file in your current directory. This file contains your encryption key and should be kept secure.

> **Important**: Never commit the `.sops-key` file to version control. Add it to your `.gitignore` file immediately.

### Step 2: Create a YAML or JSON file with your secrets

Create a file named `secrets.yaml` with your sensitive data:

```yaml
# secrets.yaml
data:
  api:
    key: "your-api-key"
    secret: "your-api-secret"
  database:
    username: "db_user"
    password: "db_password"
```

Or if you prefer JSON, create a file named `secrets.json`:

```json
{
  "data": {
    "api": {
      "key": "your-api-key",
      "secret": "your-api-secret"
    },
    "database": {
      "username": "db_user",
      "password": "db_password"
    }
  }
}
```

### Step 3: Encrypt your secrets file

Encrypt your secrets file using the CLI:

```bash
npx node-sops encrypt -i secrets.yaml -o secrets.enc.json
```

This will generate an encrypted file named `secrets.enc.json`. This encrypted file is safe to commit to your repository.

### Step 4: Access your secrets in code

Now you can use Node SOPS in your application to access your secrets:

```javascript
const { Sops } = require('node-sops');

// Create a new Sops instance
const sops = new Sops();

// Read and decrypt the secrets
const secrets = sops.view('secrets.enc.json');

// Access specific values
const apiKey = secrets.data.api.key;
const dbPassword = secrets.data.database.password;

console.log(`API Key: ${apiKey}`);
console.log(`Database Password: ${dbPassword}`);
```

With TypeScript:

```typescript
import { Sops } from 'node-sops';

// Create a new Sops instance
const sops = new Sops();

// Read and decrypt the secrets
const secrets = sops.view('secrets.enc.json');

// Access specific values
const apiKey = secrets.data.api.key;
const dbPassword = secrets.data.database.password;

console.log(`API Key: ${apiKey}`);
console.log(`Database Password: ${dbPassword}`);
```

## Next Steps

Now that you have the basics down, check out these guides for more detailed information:

- [CLI Usage](cli-usage.md) - Learn about all available command-line options
- [Programmatic Usage](programmatic-usage.md) - Detailed API documentation
- [Security Best Practices](security-best-practices.md) - Tips for keeping your secrets secure