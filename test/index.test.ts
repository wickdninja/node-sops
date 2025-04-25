import * as fs from 'fs';
import * as path from 'path';
import { Sops, EncryptedData } from '../src/index';
import * as crypto from '../src/utils/crypto';

describe('Sops Class', () => {
  const testDir = path.join(__dirname, 'temp');
  const testKeyPath = path.join(testDir, '.test-sops-key');
  const testPlainPath = path.join(testDir, 'test-secrets.yaml');
  const testEncPath = path.join(testDir, 'test-secrets.enc.json');
  const testJsonPath = path.join(testDir, 'test-secrets.json');
  
  const testSecrets = {
    data: {
      api: {
        key: 'test-api-key-12345',
        secret: 'test-api-secret-67890'
      },
      database: {
        username: 'test-db-user',
        password: 'test-db-password'
      }
    }
  };

  beforeAll(() => {
    // Create test directory if it doesn't exist
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });
  
  afterAll(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });
  
  beforeEach(() => {
    // Create test secrets file
    fs.writeFileSync(testPlainPath, `
data:
  api:
    key: test-api-key-12345
    secret: test-api-secret-67890
  database:
    username: test-db-user
    password: test-db-password
`);

    fs.writeFileSync(testJsonPath, JSON.stringify(testSecrets, null, 2));
    
    // Create test key
    const testKey = 'abcdefghijklmnopqrstuvwxyz123456';
    fs.writeFileSync(testKeyPath, testKey);
    fs.chmodSync(testKeyPath, 0o600);
  });
  
  afterEach(() => {
    // Clean up test files
    [testKeyPath, testPlainPath, testEncPath, testJsonPath].forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });
  
  describe('Constructor & Initialization', () => {
    test('should initialize with default key path', () => {
      const sops = new Sops();
      expect(sops).toBeInstanceOf(Sops);
    });
    
    test('should initialize with custom key path', () => {
      const sops = new Sops({ keyPath: testKeyPath });
      expect(sops).toBeInstanceOf(Sops);
    });
    
    test('should generate and store a new key when initializing', () => {
      // Remove existing key if any
      if (fs.existsSync(testKeyPath)) {
        fs.unlinkSync(testKeyPath);
      }
      
      const sops = new Sops({ keyPath: testKeyPath });
      const key = sops.initialize();
      
      expect(key).toBeDefined();
      expect(key.length).toBeGreaterThan(20);
      expect(fs.existsSync(testKeyPath)).toBe(true);
    });
    
    test('should throw error when initializing with existing key', () => {
      const sops = new Sops({ keyPath: testKeyPath });
      expect(() => {
        sops.initialize();
      }).toThrow('Key file already exists');
    });
  });
  
  describe('Key Management', () => {
    test('should get key from file', () => {
      const sops = new Sops({ keyPath: testKeyPath });
      const key = sops.getKey();
      
      expect(key).toBeDefined();
      expect(key.length).toBeGreaterThan(20);
    });
    
    test('should throw error when key file not found', () => {
      // Remove key file
      if (fs.existsSync(testKeyPath)) {
        fs.unlinkSync(testKeyPath);
      }
      
      const sops = new Sops({ keyPath: testKeyPath });
      expect(() => {
        sops.getKey();
      }).toThrow('Key file not found');
    });
    
    test('should cache key after first retrieval', () => {
      const sops = new Sops({ keyPath: testKeyPath });
      const key1 = sops.getKey();
      
      // Delete the key file
      fs.unlinkSync(testKeyPath);
      
      // Should still return the cached key
      const key2 = sops.getKey();
      expect(key2).toEqual(key1);
    });
  });
  
  describe('Encryption & Decryption Operations', () => {
    test('should encrypt YAML file to JSON', () => {
      const sops = new Sops({ keyPath: testKeyPath });
      sops.encrypt(testPlainPath, testEncPath);
      
      expect(fs.existsSync(testEncPath)).toBe(true);
      
      // Verify the encrypted file is valid JSON
      const encryptedData = JSON.parse(fs.readFileSync(testEncPath, 'utf8')) as EncryptedData;
      expect(encryptedData.iv).toBeDefined();
      expect(encryptedData.content).toBeDefined();
      expect(encryptedData.metadata).toBeDefined();
      expect(encryptedData.metadata?.version).toBe('1.0');
    });
    
    test('should encrypt JSON file to JSON', () => {
      const sops = new Sops({ keyPath: testKeyPath });
      sops.encrypt(testJsonPath, testEncPath);
      
      expect(fs.existsSync(testEncPath)).toBe(true);
      
      // Verify the encrypted file is valid JSON
      const encryptedData = JSON.parse(fs.readFileSync(testEncPath, 'utf8')) as EncryptedData;
      expect(encryptedData.iv).toBeDefined();
      expect(encryptedData.content).toBeDefined();
    });
    
    test('should decrypt to YAML file', () => {
      const sops = new Sops({ keyPath: testKeyPath });
      // First encrypt
      sops.encrypt(testPlainPath, testEncPath);
      
      // Then decrypt to a new file
      const decryptedPath = path.join(testDir, 'decrypted.yaml');
      sops.decrypt(testEncPath, decryptedPath);
      
      expect(fs.existsSync(decryptedPath)).toBe(true);
      
      // Clean up
      fs.unlinkSync(decryptedPath);
    });
    
    test('should decrypt to JSON file', () => {
      const sops = new Sops({ keyPath: testKeyPath });
      // First encrypt
      sops.encrypt(testPlainPath, testEncPath);
      
      // Then decrypt to a new file
      const decryptedPath = path.join(testDir, 'decrypted.json');
      sops.decrypt(testEncPath, decryptedPath);
      
      expect(fs.existsSync(decryptedPath)).toBe(true);
      
      // Clean up
      fs.unlinkSync(decryptedPath);
    });
    
    test('should view encrypted content without writing to file', () => {
      const sops = new Sops({ keyPath: testKeyPath });
      // First encrypt
      sops.encrypt(testPlainPath, testEncPath);
      
      // Then view the content
      const decryptedData = sops.view(testEncPath);
      expect(decryptedData).toEqual(testSecrets);
    });
    
    test('should get specific value from encrypted content', () => {
      const sops = new Sops({ keyPath: testKeyPath });
      // First encrypt
      sops.encrypt(testPlainPath, testEncPath);
      
      // Then get specific values
      const apiKey = sops.get(testEncPath, 'data.api.key');
      expect(apiKey).toBe('test-api-key-12345');
      
      const dbPassword = sops.get(testEncPath, 'data.database.password');
      expect(dbPassword).toBe('test-db-password');
    });
    
    test('should return undefined when getting non-existent value', () => {
      const sops = new Sops({ keyPath: testKeyPath });
      // First encrypt
      sops.encrypt(testPlainPath, testEncPath);
      
      // Try to get non-existent value
      const nonExistent = sops.get(testEncPath, 'data.non.existent');
      expect(nonExistent).toBeUndefined();
    });
  });
});