---
sidebar_position: 1
title: CLI Reference
---

# CLI Reference

This page provides a complete reference for the Node SOPS command-line interface.

## Command Structure

All Node SOPS commands follow this structure:

```bash
node-sops <command> [options]
```

Or when using npx:

```bash
npx node-sops <command> [options]
```

## Global Options

These options can be used with any command:

| Option | Alias | Description |
|--------|-------|-------------|
| `--help` | `-h` | Show help information |
| `--version` | `-v` | Show version information |

## Commands

### init

Initializes a new encryption key for use with Node SOPS.

```bash
node-sops init [options]
```

**Options:**

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--key-path` | `-k` | Path where the key should be stored | `.sops-key` |
| `--force` | `-f` | Overwrite existing key if present | `false` |

**Examples:**

```bash
# Create a new key in the default location
node-sops init

# Create a new key in a custom location
node-sops init --key-path ./config/encryption.key

# Force overwrite an existing key
node-sops init --force
```

### encrypt

Encrypts a plaintext file containing secrets.

```bash
node-sops encrypt [options]
```

**Options:**

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--in` | `-i` | Path to input file (required) | - |
| `--out` | `-o` | Path to output file (required) | - |
| `--key-path` | `-k` | Path to the encryption key | `.sops-key` |

**Examples:**

```bash
# Encrypt a YAML file
node-sops encrypt -i secrets.yaml -o secrets.enc.json

# Encrypt a JSON file
node-sops encrypt -i secrets.json -o secrets.enc.json

# Use a custom key path
node-sops encrypt -i secrets.yaml -o secrets.enc.json -k ./config/encryption.key
```

### decrypt

Decrypts an encrypted file to its original plaintext form.

```bash
node-sops decrypt [options]
```

**Options:**

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--in` | `-i` | Path to input file (required) | - |
| `--out` | `-o` | Path to output file (required) | - |
| `--key-path` | `-k` | Path to the encryption key | `.sops-key` |
| `--format` | `-f` | Output format (`yaml` or `json`) | Inferred from output file extension |

**Examples:**

```bash
# Decrypt to a YAML file
node-sops decrypt -i secrets.enc.json -o secrets.yaml

# Decrypt to a JSON file
node-sops decrypt -i secrets.enc.json -o secrets.json

# Explicitly specify the output format
node-sops decrypt -i secrets.enc.json -o secrets.txt -f yaml
```

### view

Display the decrypted content of an encrypted file without writing it to disk.

```bash
node-sops view [options]
```

**Options:**

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--in` | `-i` | Path to input file (required) | - |
| `--key-path` | `-k` | Path to the encryption key | `.sops-key` |
| `--format` | `-f` | Output format (`json`, `yaml`, or `pretty`) | `pretty` |

**Examples:**

```bash
# View with pretty formatting
node-sops view -i secrets.enc.json

# View as YAML
node-sops view -i secrets.enc.json -f yaml

# View as JSON
node-sops view -i secrets.enc.json -f json
```

### get

Retrieve a specific value from an encrypted file using dot notation.

```bash
node-sops get [options]
```

**Options:**

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--in` | `-i` | Path to input file (required) | - |
| `--key` | `-k` | Dot-notation path to the value (required) | - |
| `--key-path` | `-p` | Path to the encryption key | `.sops-key` |

**Examples:**

```bash
# Get an API key
node-sops get -i secrets.enc.json -k data.api.key

# Get a nested database password
node-sops get -i secrets.enc.json -k data.database.password
```

### rotate

Re-encrypt a file with a new initialization vector. The content remains the same, but the encrypted file will be different.

```bash
node-sops rotate [options]
```

**Options:**

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--in` | `-i` | Path to input file (required) | - |
| `--out` | `-o` | Path to output file | Same as input |
| `--key-path` | `-k` | Path to the encryption key | `.sops-key` |

**Examples:**

```bash
# Rotate the encryption in place
node-sops rotate -i secrets.enc.json

# Rotate to a new file
node-sops rotate -i secrets.enc.json -o new-secrets.enc.json
```

## Error Codes

The CLI will exit with the following error codes when encountering issues:

| Code | Description |
|------|-------------|
| 1 | General error (invalid arguments, etc.) |
| 2 | File not found |
| 3 | Permission denied |
| 4 | Encryption/decryption error |
| 5 | Invalid key file |