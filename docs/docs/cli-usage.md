---
sidebar_position: 3
title: CLI Usage
---

# Command Line Interface

Node SOPS provides a comprehensive command-line interface for managing your encrypted secrets. This guide covers all the available commands and options.

## Global Options

These options apply to all commands:

| Option | Description |
| ------ | ----------- |
| `--help`, `-h` | Display help information |
| `--version`, `-v` | Display version information |

## Commands

### init

Initializes a new encryption key.

```bash
npx node-sops init [options]
```

**Options:**

| Option | Description |
| ------ | ----------- |
| `--force`, `-f` | Overwrite existing key file if it exists |
| `--key-path`, `-k` | Specify a custom path for the key file (default: `.sops-key`) |

**Examples:**

```bash
# Initialize a new key in the default location
npx node-sops init

# Initialize a new key in a custom location
npx node-sops init --key-path ./config/.custom-key

# Force overwrite an existing key
npx node-sops init --force
```

### encrypt

Encrypts a plaintext file containing secrets.

```bash
npx node-sops encrypt [options]
```

**Options:**

| Option | Description |
| ------ | ----------- |
| `--in`, `-i` | Input file path (required) |
| `--out`, `-o` | Output file path (required) |
| `--key-path`, `-k` | Custom path to the key file (default: `.sops-key`) |

**Examples:**

```bash
# Encrypt a YAML file
npx node-sops encrypt -i secrets.yaml -o secrets.enc.json

# Encrypt a JSON file
npx node-sops encrypt -i secrets.json -o secrets.enc.json

# Use a custom key file
npx node-sops encrypt -i secrets.yaml -o secrets.enc.json -k ./config/.custom-key
```

### decrypt

Decrypts an encrypted file.

```bash
npx node-sops decrypt [options]
```

**Options:**

| Option | Description |
| ------ | ----------- |
| `--in`, `-i` | Input file path (required) |
| `--out`, `-o` | Output file path (required) |
| `--key-path`, `-k` | Custom path to the key file (default: `.sops-key`) |
| `--format`, `-f` | Output format: `yaml` or `json` (default: inferred from output file extension) |

**Examples:**

```bash
# Decrypt to a YAML file
npx node-sops decrypt -i secrets.enc.json -o secrets.yaml

# Decrypt to a JSON file
npx node-sops decrypt -i secrets.enc.json -o secrets.json

# Explicitly specify the output format
npx node-sops decrypt -i secrets.enc.json -o secrets.txt -f yaml
```

### view

Displays the decrypted content of an encrypted file without writing to a file.

```bash
npx node-sops view [options]
```

**Options:**

| Option | Description |
| ------ | ----------- |
| `--in`, `-i` | Input file path (required) |
| `--key-path`, `-k` | Custom path to the key file (default: `.sops-key`) |
| `--format`, `-f` | Output format: `yaml`, `json`, or `pretty` (default: `pretty`) |

**Examples:**

```bash
# View the decrypted content with pretty formatting
npx node-sops view -i secrets.enc.json

# View the content in YAML format
npx node-sops view -i secrets.enc.json -f yaml

# View the content in JSON format
npx node-sops view -i secrets.enc.json -f json
```

### get

Retrieves a specific value from an encrypted file using a dot-notation path.

```bash
npx node-sops get [options]
```

**Options:**

| Option | Description |
| ------ | ----------- |
| `--in`, `-i` | Input file path (required) |
| `--key`, `-k` | Dot-notation path to the value (required) |
| `--key-path`, `-p` | Custom path to the key file (default: `.sops-key`) |

**Examples:**

```bash
# Get a specific value
npx node-sops get -i secrets.enc.json -k data.api.key

# Get a nested value
npx node-sops get -i secrets.enc.json -k data.database.password
```

### rotate

Re-encrypts an encrypted file with a new initialization vector. The content remains the same, but the encrypted file changes.

```bash
npx node-sops rotate [options]
```

**Options:**

| Option | Description |
| ------ | ----------- |
| `--in`, `-i` | Input file path (required) |
| `--out`, `-o` | Output file path (default: same as input) |
| `--key-path`, `-k` | Custom path to the key file (default: `.sops-key`) |

**Examples:**

```bash
# Rotate encryption in place
npx node-sops rotate -i secrets.enc.json

# Rotate to a new file
npx node-sops rotate -i secrets.enc.json -o new-secrets.enc.json
```

## Usage in Package Scripts

You can add Node SOPS commands to your `package.json` scripts section for easier access:

```json
{
  "scripts": {
    "encrypt": "node-sops encrypt -i secrets.yaml -o secrets.enc.json",
    "decrypt": "node-sops decrypt -i secrets.enc.json -o secrets.yaml",
    "view-secrets": "node-sops view -i secrets.enc.json"
  }
}
```

Then you can run these commands using npm or yarn:

```bash
npm run encrypt
npm run decrypt
npm run view-secrets
```