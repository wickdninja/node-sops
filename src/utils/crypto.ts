import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Encryption algorithm used for secrets
 */
export const ALGORITHM = 'aes-256-gcm';

/**
 * Derives a 32-byte encryption key from the provided raw key
 * @param rawKey The original encryption key
 * @returns A 32-byte Buffer for use with AES-256
 */
export function deriveKey(rawKey: string): Buffer {
  // Use a more secure approach - directly get the digest as Buffer and use it
  // SHA-256 produces exactly 32 bytes which is what we need for AES-256
  return crypto.createHash('sha256').update(rawKey).digest();
}

/**
 * Generates a new random encryption key
 * @returns A base64-encoded random 32-byte key
 */
export function generateKey(): string {
  return crypto.randomBytes(32).toString('base64');
}

/**
 * Encrypts content with the provided key using AES-256-GCM
 * @param content The string content to encrypt
 * @param rawKey The encryption key
 * @returns Object containing base64-encoded IV, encrypted content, and authentication tag
 */
export function encrypt(content: string, rawKey: string): { iv: string; content: string; tag: string } {
  // Create an initialization vector (12 bytes is recommended for GCM)
  const iv = crypto.randomBytes(12);
  
  // Derive the encryption key from the raw key
  const key = deriveKey(rawKey);
  
  // Create a cipher using the key and iv with GCM mode
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  // Encrypt the content
  let encrypted = cipher.update(content, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Get the authentication tag
  const authTag = cipher.getAuthTag();
  
  return {
    iv: iv.toString('base64'),
    content: encrypted,
    tag: authTag.toString('base64')
  };
}

/**
 * Decrypts content with the provided key using AES-256-GCM
 * @param encryptedData Object containing the IV, encrypted content, and auth tag (all base64-encoded)
 * @param rawKey The encryption key
 * @returns The decrypted content as a string
 * @throws Error if decryption fails (e.g., due to wrong key or data tampering)
 */
export function decrypt(encryptedData: { iv: string; content: string; tag: string }, rawKey: string): string {
  try {
    // Extract the iv, content, and authentication tag
    const iv = Buffer.from(encryptedData.iv, 'base64');
    const content = encryptedData.content;
    const authTag = Buffer.from(encryptedData.tag, 'base64');
    
    // Derive the encryption key from the raw key
    const key = deriveKey(rawKey);
    
    // Create a decipher using the key and iv
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    // Set the authentication tag for verification
    decipher.setAuthTag(authTag);
    
    // Decrypt the content
    let decrypted = decipher.update(content, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${(error as Error).message}. This could be due to an incorrect key, corrupted data, or data tampering.`);
  }
}

/**
 * Saves a key to a file with restrictive permissions
 * @param key The encryption key to save
 * @param keyPath The path where the key should be saved
 * @throws Error if the key cannot be saved
 */
export function saveKey(key: string, keyPath: string): void {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(keyPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(keyPath, key);
    // Set restrictive permissions (owner read/write only)
    fs.chmodSync(keyPath, 0o600);
  } catch (error) {
    throw new Error(`Failed to save key to ${keyPath}: ${(error as Error).message}`);
  }
}

/**
 * Checks if a file has secure permissions (0o600 or more restrictive)
 * @param filePath Path to the file to check
 * @returns true if permissions are secure, false otherwise
 */
export function hasSecurePermissions(filePath: string): boolean {
  try {
    const stats = fs.statSync(filePath);
    // Check if file has permissions 0o600 (user read/write only) or more restrictive
    const mode = stats.mode & 0o777; // Get the permission bits
    
    // File should not be readable or writable by group or others
    const restrictiveEnough = (mode & 0o077) === 0;
    
    return restrictiveEnough;
  } catch (error) {
    return false;
  }
}

/**
 * Loads a key from a file
 * @param keyPath The path to the key file
 * @returns The encryption key as a string
 * @throws Error if the key file cannot be read
 */
export function loadKey(keyPath: string): string {
  try {
    if (!fs.existsSync(keyPath)) {
      throw new Error(`Key file does not exist: ${keyPath}`);
    }
    
    // Check file permissions
    if (!hasSecurePermissions(keyPath)) {
      console.warn(`WARNING: Key file ${keyPath} has insecure permissions. Consider running: chmod 600 ${keyPath}`);
    }
    
    return fs.readFileSync(keyPath, 'utf8').trim();
  } catch (error) {
    throw new Error(`Failed to load key from ${keyPath}: ${(error as Error).message}`);
  }
}

/**
 * Finds a key file by looking in the current directory and parent directories
 * @param fileName The name of the key file to search for (default: '.sops-key')
 * @param maxDepth The maximum number of parent directories to search (default: 5)
 * @returns The full path to the key file if found, or null if not found
 */
export function findKeyFile(fileName = '.sops-key', maxDepth = 5): string | null {
  let currentDir = process.cwd();
  let depth = 0;
  
  while (depth < maxDepth) {
    const keyPath = path.join(currentDir, fileName);
    
    if (fs.existsSync(keyPath)) {
      return keyPath;
    }
    
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      // We've reached the root directory
      break;
    }
    
    currentDir = parentDir;
    depth++;
  }
  
  return null;
}