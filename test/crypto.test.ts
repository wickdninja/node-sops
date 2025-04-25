import * as fs from 'fs';
import * as path from 'path';
import * as crypto from '../src/utils/crypto';

describe('Crypto Utilities', () => {
  const testKey = 'abcdefghijklmnopqrstuvwxyz123456';
  const testContent = 'This is a test secret!';
  const testKeyPath = path.join(__dirname, '.test-key');
  
  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(testKeyPath)) {
      fs.unlinkSync(testKeyPath);
    }
  });
  
  describe('Key Management', () => {
    test('should generate a unique key', () => {
      const key1 = crypto.generateKey();
      const key2 = crypto.generateKey();
      expect(key1).not.toEqual(key2);
      expect(key1.length).toBeGreaterThan(20); // Should be a reasonable length
    });
    
    test('should save and load a key', () => {
      crypto.saveKey(testKey, testKeyPath);
      expect(fs.existsSync(testKeyPath)).toBe(true);
      
      const loadedKey = crypto.loadKey(testKeyPath);
      expect(loadedKey).toEqual(testKey);
    });
    
    test('should throw an error when loading a non-existent key', () => {
      expect(() => {
        crypto.loadKey('/non/existent/path');
      }).toThrow();
    });
  });
  
  describe('Encryption and Decryption', () => {
    test('should encrypt and decrypt content', () => {
      const encrypted = crypto.encrypt(testContent, testKey);
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.content).toBeDefined();
      
      const decrypted = crypto.decrypt(encrypted, testKey);
      expect(decrypted).toEqual(testContent);
    });
    
    test('should derive consistent keys from raw keys', () => {
      const derived1 = crypto.deriveKey(testKey);
      const derived2 = crypto.deriveKey(testKey);
      expect(derived1.toString('hex')).toEqual(derived2.toString('hex'));
      expect(derived1.length).toEqual(32); // Should be 32 bytes for AES-256
    });
    
    test('should fail decryption with wrong key', () => {
      const encrypted = crypto.encrypt(testContent, testKey);
      expect(() => {
        crypto.decrypt(encrypted, 'wrong-key');
      }).toThrow();
    });
  });
});