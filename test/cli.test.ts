import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

describe('CLI Commands', () => {
  const testDir = path.join(__dirname, 'temp-cli');
  const testKeyPath = path.join(testDir, '.test-sops-key');
  const testNewKeyPath = path.join(testDir, '.test-sops-new-key');
  const testPlainPath = path.join(testDir, 'test-cli-secrets.yaml');
  const testEncPath = path.join(testDir, 'test-cli-secrets.enc.json');
  const testRotatedPath = path.join(testDir, 'test-cli-secrets-rotated.enc.json');
  
  const cliPath = path.join(__dirname, '..', 'src', 'cli.ts');
  
  beforeAll(() => {
    // Create test directory if it doesn't exist
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    // Create test secrets file
    fs.writeFileSync(testPlainPath, `
data:
  api:
    key: test-cli-api-key-12345
    secret: test-cli-api-secret-67890
  database:
    username: test-cli-db-user
    password: test-cli-db-password
`);
  });
  
  afterAll(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });
  
  beforeEach(() => {
    // Remove previous test files
    if (fs.existsSync(testKeyPath)) {
      fs.unlinkSync(testKeyPath);
    }
    if (fs.existsSync(testNewKeyPath)) {
      fs.unlinkSync(testNewKeyPath);
    }
    if (fs.existsSync(testEncPath)) {
      fs.unlinkSync(testEncPath);
    }
    if (fs.existsSync(testRotatedPath)) {
      fs.unlinkSync(testRotatedPath);
    }
  });
  
  const runCliCommand = (args: string) => {
    // Run the CLI command using ts-node
    return execSync(`npx ts-node ${cliPath} ${args}`, { 
      encoding: 'utf8',
      env: { ...process.env }
    });
  };
  
  describe('Initialization and Encryption', () => {
    test('should initialize a key and encrypt a file', () => {
      // Initialize a new key
      const initOutput = runCliCommand(`init --key-file ${testKeyPath}`);
      expect(initOutput).toContain('Generated new encryption key');
      expect(fs.existsSync(testKeyPath)).toBe(true);
      
      // Encrypt a file
      const encryptOutput = runCliCommand(`encrypt -i ${testPlainPath} -o ${testEncPath} --key-file ${testKeyPath}`);
      expect(encryptOutput).toContain('File encrypted successfully');
      expect(fs.existsSync(testEncPath)).toBe(true);
      
      // Verify the encrypted file is valid JSON
      const encryptedContent = JSON.parse(fs.readFileSync(testEncPath, 'utf8'));
      expect(encryptedContent.iv).toBeDefined();
      expect(encryptedContent.content).toBeDefined();
      expect(encryptedContent.metadata).toBeDefined();
    });
  });
  
  describe('Key Rotation', () => {
    test('should rotate a key and re-encrypt a file', () => {
      // First initialize and encrypt
      runCliCommand(`init --key-file ${testKeyPath}`);
      runCliCommand(`encrypt -i ${testPlainPath} -o ${testEncPath} --key-file ${testKeyPath}`);
      
      // First initialize the new key
      runCliCommand(`init --key-file ${testNewKeyPath}`);
      
      // Now rotate the key
      const rotateOutput = runCliCommand(
        `rotate -i ${testEncPath} -o ${testRotatedPath} --old-key-file ${testKeyPath} --new-key-file ${testNewKeyPath}`
      );
      
      expect(rotateOutput).toContain('Key rotated successfully');
      expect(fs.existsSync(testRotatedPath)).toBe(true);
      
      // Verify the rotated file can be decrypted with the new key
      const viewOutput = runCliCommand(`view -i ${testRotatedPath} --key-file ${testNewKeyPath}`);
      expect(viewOutput).toContain('test-cli-api-key-12345');
      expect(viewOutput).toContain('test-cli-db-password');
      
      // Verify the original file can be decrypted with the old key
      const originalViewOutput = runCliCommand(`view -i ${testEncPath} --key-file ${testKeyPath}`);
      expect(originalViewOutput).toContain('test-cli-api-key-12345');
      expect(originalViewOutput).toContain('test-cli-db-password');
    });
  });
});