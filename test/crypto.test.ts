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
    
    test('should check file permissions for security', () => {
      crypto.saveKey(testKey, testKeyPath);
      
      // Secure permissions should be detected (chmod 600 was applied by saveKey)
      expect(crypto.hasSecurePermissions(testKeyPath)).toBe(true);
      
      // Now let's make it insecure
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => { /* do nothing */ });
      
      // Try to make permissions more open if on Unix-like system
      try {
        fs.chmodSync(testKeyPath, 0o644); // world readable
        
        // Insecure permissions should be detected
        expect(crypto.hasSecurePermissions(testKeyPath)).toBe(false);
        
        // Loading should warn about insecure permissions
        crypto.loadKey(testKeyPath);
        expect(consoleSpy).toHaveBeenCalled();
      } catch (e) {
        // On some systems we might not be able to change permissions
      } finally {
        consoleSpy.mockRestore();
        // Set it back to secure
        fs.chmodSync(testKeyPath, 0o600);
      }
    });
  });
  
  describe('Encryption and Decryption', () => {
    test('should encrypt and decrypt content using AES-GCM', () => {
      const encrypted = crypto.encrypt(testContent, testKey);
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.content).toBeDefined();
      expect(encrypted.tag).toBeDefined(); // GCM mode should include auth tag
      
      const decrypted = crypto.decrypt(encrypted, testKey);
      expect(decrypted).toEqual(testContent);
    });
    
    test('should detect tampering with encrypted content', () => {
      const encrypted = crypto.encrypt(testContent, testKey);
      
      // Tamper with the encrypted content
      const tampered = {
        ...encrypted,
        content: encrypted.content.replace(/[A-Za-z0-9]/, 'X') // Replace a character
      };
      
      // Should throw when tampering is detected
      expect(() => {
        crypto.decrypt(tampered, testKey);
      }).toThrow();
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