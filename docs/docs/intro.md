---
sidebar_position: 1
title: Overview
---

# Node SOPS

A robust, easy-to-use secrets management solution for Node.js projects, inspired by Mozilla SOPS but purpose-built for JavaScript/TypeScript environments.

## What is Node SOPS?

Node SOPS is a secure, convenient way to manage sensitive configuration values in your Node.js applications. It provides both a command-line interface and a programmatic API for encrypting, decrypting, and accessing secrets stored in YAML or JSON files.

### Key Features

- **Military-Grade Encryption**: AES-256-CBC encryption for your sensitive data
- **Multiple Format Support**: Works seamlessly with YAML and JSON files
- **Easy Key Management**: Simple key generation and secure sharing capabilities
- **Developer-Friendly API**: Clean programmatic interface for integration
- **Powerful CLI**: Comprehensive command-line tools for manual operations
- **TypeScript Support**: Built with type safety for modern development
- **Zero External Crypto Dependencies**: Uses Node.js built-in crypto module
- **Minimal Dependencies**: Lightweight with few production dependencies

## Why Use Node SOPS?

Managing secrets securely is a critical concern for any application. Node SOPS provides a simple yet powerful solution that allows you to:

- **Keep sensitive information encrypted** in your repository
- **Share secrets securely** within your team
- **Maintain different configurations** for different environments
- **Integrate seamlessly** with your existing Node.js/TypeScript workflow
- **Avoid hard-coding** sensitive values in your application code

## How It Works

Node SOPS uses symmetric encryption with a shared key. The workflow is straightforward:

1. Generate an encryption key with `node-sops init`
2. Create your YAML or JSON file with sensitive data
3. Encrypt the file with `node-sops encrypt`
4. Commit the encrypted file to your repository (and keep the key secure)
5. In your application, use Node SOPS to decrypt and access the secrets

## Next Steps

Ready to get started? Check out the following guides:

- [Getting Started](getting-started.md) - Installation and basic usage
- [CLI Usage](cli-usage.md) - Detailed command-line interface documentation
- [Programmatic Usage](programmatic-usage.md) - How to use Node SOPS in your code