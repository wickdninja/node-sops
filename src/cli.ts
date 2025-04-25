#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs';
import { Sops } from './index';

const program = new Command();

program
  .name('node-sops')
  .description('Simple secrets management for Node.js projects')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize a new encryption key')
  .option('-k, --key-file <path>', 'Path to the key file', '.sops-key')
  .action((options) => {
    try {
      const keyPath = path.resolve(options.keyFile);
      const sops = new Sops({ keyPath });
      const key = sops.initialize();
      
      console.log(chalk.green('✓ Generated new encryption key:'));
      console.log(key);
      console.log();
      console.log(chalk.blue('Key saved to:'), keyPath);
      console.log(chalk.yellow('IMPORTANT: Add this file to .gitignore!'));
    } catch (error) {
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  });

program
  .command('encrypt')
  .description('Encrypt a secrets file')
  .requiredOption('-i, --input <path>', 'Input file path (plaintext)')
  .option('-o, --output <path>', 'Output file path (encrypted)')
  .option('-k, --key-file <path>', 'Path to the key file')
  .action((options) => {
    try {
      const inputPath = path.resolve(options.input);
      // Default output path is input path with .enc extension
      const outputPath = options.output 
        ? path.resolve(options.output)
        : `${inputPath}.enc`;
      
      const sops = new Sops({ keyPath: options.keyFile });
      sops.encrypt(inputPath, outputPath);
      
      console.log(chalk.green('✓ File encrypted successfully'));
      console.log(chalk.blue('Encrypted file saved to:'), outputPath);
    } catch (error) {
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  });

program
  .command('decrypt')
  .description('Decrypt a secrets file')
  .requiredOption('-i, --input <path>', 'Input file path (encrypted)')
  .option('-o, --output <path>', 'Output file path (plaintext)')
  .option('-k, --key-file <path>', 'Path to the key file')
  .action((options) => {
    try {
      const inputPath = path.resolve(options.input);
      // Default output path is input path without .enc extension
      const outputPath = options.output 
        ? path.resolve(options.output)
        : inputPath.replace(/\.enc$/, '');
      
      const sops = new Sops({ keyPath: options.keyFile });
      sops.decrypt(inputPath, outputPath);
      
      console.log(chalk.green('✓ File decrypted successfully'));
      console.log(chalk.blue('Decrypted file saved to:'), outputPath);
      console.log(chalk.yellow('NOTE: This file contains plaintext secrets! Do not commit it to git.'));
    } catch (error) {
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  });

program
  .command('view')
  .description('View decrypted content without writing to a file')
  .requiredOption('-i, --input <path>', 'Input file path (encrypted)')
  .option('-k, --key-file <path>', 'Path to the key file')
  .action((options) => {
    try {
      const inputPath = path.resolve(options.input);
      
      const sops = new Sops({ keyPath: options.keyFile });
      const data = sops.view(inputPath);
      
      console.log(chalk.green('✓ Decrypted content:'));
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  });

program
  .command('get')
  .description('Get a specific value from encrypted content')
  .requiredOption('-i, --input <path>', 'Input file path (encrypted)')
  .requiredOption('-k, --key <keyPath>', 'Dot-notation path to the value (e.g., "data.api.key")')
  .option('--key-file <path>', 'Path to the encryption key file')
  .action((options) => {
    try {
      const inputPath = path.resolve(options.input);
      
      const sops = new Sops({ keyPath: options.keyFile });
      const value = sops.get(inputPath, options.key);
      
      if (value === undefined) {
        console.log(chalk.yellow(`No value found for key: ${options.key}`));
      } else {
        console.log(value);
      }
    } catch (error) {
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  });

program
  .command('rotate')
  .description('Rotate encryption key for a file (re-encrypt with a new key)')
  .requiredOption('-i, --input <path>', 'Input file path (encrypted)')
  .option('-o, --output <path>', 'Output file path (encrypted)')
  .option('--old-key-file <path>', 'Path to the old encryption key file')
  .option('--new-key-file <path>', 'Path to the new encryption key file')
  .action((options) => {
    try {
      const inputPath = path.resolve(options.input);
      // Default output path is the same as input
      const outputPath = options.output 
        ? path.resolve(options.output)
        : inputPath;
      
      // Create a SOPS instance with the old key to decrypt
      const oldSops = new Sops({ keyPath: options.oldKeyFile });
      
      // Decrypt and get the data
      const data = oldSops.view(inputPath);
      
      // Create a SOPS instance with the new key to encrypt
      // If no new key file is specified, it will create and use a new one
      const newSops = options.newKeyFile
        ? new Sops({ keyPath: options.newKeyFile })
        : new Sops();
      
      // Make sure we have a new key
      try {
        if (!options.newKeyFile) {
          newSops.initialize();
        }
      } catch (error) {
        // Key already exists
      }
      
      // Create a temporary directory for rotation
      const tempDir = path.dirname(outputPath);
      const tempFilePath = path.join(tempDir, 'temp_rotation.json');
      
      // Write the decrypted data to a temporary file
      fs.writeFileSync(tempFilePath, JSON.stringify(data));
      
      // Encrypt with the new key
      newSops.encrypt(tempFilePath, outputPath);
      
      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);
      
      console.log(chalk.green('✓ Key rotated successfully'));
      console.log(chalk.blue('Re-encrypted file saved to:'), outputPath);
      
      if (!options.newKeyFile) {
        console.log(chalk.yellow('A new key has been generated. Be sure to update your key management accordingly.'));
      }
    } catch (error) {
      console.error(chalk.red('Error:'), (error as Error).message);
      process.exit(1);
    }
  });

program.parse(process.argv);