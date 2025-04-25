import * as fs from 'fs';
import * as path from 'path';
import * as crypto from './utils/crypto';
import * as file from './utils/file';

/**
 * Options for the SOPS operations
 * @property keyPath - Path to the encryption key file
 * @property inputPath - Default input file path for operations
 * @property outputPath - Default output file path for operations
 */
export interface SopsOptions {
  /** Path to the encryption key file. If not provided, will search for a default key file */
  keyPath?: string;
  /** Default input file path for operations */
  inputPath?: string;
  /** Default output file path for operations */
  outputPath?: string;
}

/**
 * Encrypted data format
 * @property iv - Base64-encoded initialization vector used for encryption
 * @property content - Base64-encoded encrypted content
 * @property tag - Base64-encoded authentication tag (for AES-GCM)
 * @property metadata - Additional metadata about the encrypted content
 */
export interface EncryptedData {
  /** Base64-encoded initialization vector used for encryption */
  iv: string;
  /** Base64-encoded encrypted content */
  content: string;
  /** Base64-encoded authentication tag (for AES-GCM) */
  tag: string;
  /** Additional metadata about the encrypted content */
  metadata?: {
    /** Timestamp when the data was encrypted */
    encryptedAt: string;
    /** Version of the encryption format */
    version: string;
  };
}

/**
 * Main SOPS class for managing secrets
 * Provides methods to encrypt, decrypt, view, and retrieve secrets
 */
export class Sops {
  private keyPath: string;
  private key: string | null = null;
  
  /**
   * Creates a new SOPS instance
   * @param options Configuration options for SOPS
   * @param options.keyPath Optional custom path to the encryption key file
   * @param options.inputPath Optional default input file path
   * @param options.outputPath Optional default output file path
   */
  constructor(options: SopsOptions = {}) {
    // Find or use provided key path (in order of precedence):
    // 1. Explicitly provided path
    // 2. Existing key file in current or parent directories
    // 3. Default path in current directory
    this.keyPath = options.keyPath || crypto.findKeyFile() || path.join(process.cwd(), '.sops-key');
  }
  
  /**
   * Initializes a new key if one doesn't exist
   * @returns The newly generated key
   * @throws Error if a key file already exists at the configured path
   */
  initialize(): string {
    if (fs.existsSync(this.keyPath)) {
      throw new Error(`Key file already exists at ${this.keyPath}`);
    }
    
    const key = crypto.generateKey();
    crypto.saveKey(key, this.keyPath);
    this.key = key; // Cache the key
    return key;
  }
  
  /**
   * Gets the encryption key
   * @returns The encryption key string
   * @throws Error if key file is not found
   */
  getKey(): string {
    if (this.key) {
      return this.key;
    }
    
    if (!fs.existsSync(this.keyPath)) {
      throw new Error(`Key file not found at ${this.keyPath}. Run initialize() first.`);
    }
    
    this.key = crypto.loadKey(this.keyPath);
    return this.key;
  }
  
  /**
   * Encrypts a secrets file
   * @param inputPath Path to the input file (YAML or JSON)
   * @param outputPath Path where the encrypted file will be written (JSON)
   * @throws Error if the input file cannot be read or output cannot be written
   */
  encrypt(inputPath: string, outputPath: string): void {
    try {
      // Read the input file
      const data = file.readDataFile(inputPath);
      
      // Convert to string
      const content = JSON.stringify(data);
      
      // Encrypt the content
      const encryptedData: EncryptedData = {
        ...crypto.encrypt(content, this.getKey()),
        metadata: {
          encryptedAt: new Date().toISOString(),
          version: '1.0'
        }
      };
      
      // Write the encrypted data
      file.writeJsonFile(outputPath, encryptedData);
    } catch (error) {
      throw new Error(`Failed to encrypt file: ${(error as Error).message}`);
    }
  }
  
  /**
   * Decrypts a secrets file
   * @param inputPath Path to the encrypted file (JSON)
   * @param outputPath Path where the decrypted file will be written (YAML or JSON)
   * @throws Error if the input file cannot be read, decryption fails, or output cannot be written
   */
  decrypt(inputPath: string, outputPath: string): void {
    try {
      // Read the encrypted file
      const encryptedData = file.readJsonFile(inputPath) as EncryptedData;
      
      // Decrypt the content
      const decrypted = crypto.decrypt(encryptedData, this.getKey());
      
      // Parse the decrypted content
      const data = JSON.parse(decrypted);
      
      // Determine the output format based on the file extension and write
      file.writeDataFile(outputPath, data);
    } catch (error) {
      throw new Error(`Failed to decrypt file: ${(error as Error).message}`);
    }
  }
  
  /**
   * Decrypts and returns the content without writing to a file
   * @param inputPath Path to the encrypted file (JSON)
   * @returns The decrypted data as a JavaScript object
   * @throws Error if the input file cannot be read or decryption fails
   */
  view(inputPath: string): any {
    try {
      // Read the encrypted file
      const encryptedData = file.readJsonFile(inputPath) as EncryptedData;
      
      // Decrypt the content
      const decrypted = crypto.decrypt(encryptedData, this.getKey());
      
      // Parse and return the decrypted content
      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error(`Failed to view encrypted content: ${(error as Error).message}`);
    }
  }
  
  /**
   * Gets a specific value from the decrypted content using dot notation
   * @param inputPath Path to the encrypted file (JSON)
   * @param key Dot-notation path to the value (e.g., "data.api.key")
   * @returns The value at the specified path, or undefined if not found
   * @throws Error if the input file cannot be read or decryption fails
   */
  get(inputPath: string, key: string): any {
    try {
      const data = this.view(inputPath);
      
      // Split the key path and access nested properties
      const keyParts = key.split('.');
      let value = data;
      
      for (const part of keyParts) {
        if (value === undefined || value === null) {
          return undefined;
        }
        value = value[part];
      }
      
      return value;
    } catch (error) {
      throw new Error(`Failed to get value at ${key}: ${(error as Error).message}`);
    }
  }
}

// Export utility functions
export const utils = {
  crypto,
  file
};