import * as fs from 'fs';
import * as path from 'path';
import * as file from '../src/utils/file';

describe('File Utilities', () => {
  const testDir = path.join(__dirname, 'temp');
  const testJsonPath = path.join(testDir, 'test.json');
  const testYamlPath = path.join(testDir, 'test.yaml');
  const testYmlPath = path.join(testDir, 'test.yml');
  const testData = {
    name: 'Test',
    values: {
      key1: 'value1',
      key2: 'value2'
    },
    enabled: true
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

  afterEach(() => {
    // Clean up test files
    [testJsonPath, testYamlPath, testYmlPath].forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

  describe('JSON File Operations', () => {
    test('should write and read JSON files', () => {
      file.writeJsonFile(testJsonPath, testData);
      expect(fs.existsSync(testJsonPath)).toBe(true);
      
      const readData = file.readJsonFile(testJsonPath);
      expect(readData).toEqual(testData);
    });

    test('should throw error when reading non-existent JSON file', () => {
      expect(() => {
        file.readJsonFile('/non/existent/file.json');
      }).toThrow();
    });

    test('should throw error when writing to invalid JSON path', () => {
      expect(() => {
        file.writeJsonFile('/invalid/path/file.json', testData);
      }).toThrow();
    });

    test('should detect JSON files correctly', () => {
      expect(file.isJsonFile('test.json')).toBe(true);
      expect(file.isJsonFile('test.yaml')).toBe(false);
      expect(file.isJsonFile('test')).toBe(false);
    });
  });

  describe('YAML File Operations', () => {
    test('should write and read YAML files (.yaml extension)', () => {
      file.writeYamlFile(testYamlPath, testData);
      expect(fs.existsSync(testYamlPath)).toBe(true);
      
      const readData = file.readYamlFile(testYamlPath);
      expect(readData).toEqual(testData);
    });

    test('should write and read YAML files (.yml extension)', () => {
      file.writeYamlFile(testYmlPath, testData);
      expect(fs.existsSync(testYmlPath)).toBe(true);
      
      const readData = file.readYamlFile(testYmlPath);
      expect(readData).toEqual(testData);
    });

    test('should throw error when reading non-existent YAML file', () => {
      expect(() => {
        file.readYamlFile('/non/existent/file.yaml');
      }).toThrow();
    });

    test('should throw error when writing to invalid YAML path', () => {
      expect(() => {
        file.writeYamlFile('/invalid/path/file.yaml', testData);
      }).toThrow();
    });

    test('should detect YAML files correctly', () => {
      expect(file.isYamlFile('test.yaml')).toBe(true);
      expect(file.isYamlFile('test.yml')).toBe(true);
      expect(file.isYamlFile('test.json')).toBe(false);
      expect(file.isYamlFile('test')).toBe(false);
    });
  });

  describe('Generic File Operations', () => {
    test('should get file extension correctly', () => {
      expect(file.getFileExtension('test.json')).toBe('.json');
      expect(file.getFileExtension('test.yaml')).toBe('.yaml');
      expect(file.getFileExtension('test.yml')).toBe('.yml');
      expect(file.getFileExtension('test')).toBe('');
    });

    test('should read data files based on extension', () => {
      // Create test files
      file.writeJsonFile(testJsonPath, testData);
      file.writeYamlFile(testYamlPath, testData);
      file.writeYamlFile(testYmlPath, testData);

      // Test reading each format
      expect(file.readDataFile(testJsonPath)).toEqual(testData);
      expect(file.readDataFile(testYamlPath)).toEqual(testData);
      expect(file.readDataFile(testYmlPath)).toEqual(testData);
    });

    test('should write data files based on extension', () => {
      // Write to each format
      file.writeDataFile(testJsonPath, testData);
      file.writeDataFile(testYamlPath, testData);
      file.writeDataFile(testYmlPath, testData);

      // Verify files exist
      expect(fs.existsSync(testJsonPath)).toBe(true);
      expect(fs.existsSync(testYamlPath)).toBe(true);
      expect(fs.existsSync(testYmlPath)).toBe(true);

      // Verify content was written correctly
      expect(file.readJsonFile(testJsonPath)).toEqual(testData);
      expect(file.readYamlFile(testYamlPath)).toEqual(testData);
      expect(file.readYamlFile(testYmlPath)).toEqual(testData);
    });

    test('should throw error for unsupported file types', () => {
      const testTxtPath = path.join(testDir, 'test.txt');
      
      expect(() => {
        file.readDataFile(testTxtPath);
      }).toThrow('Unsupported file type');

      expect(() => {
        file.writeDataFile(testTxtPath, testData);
      }).toThrow('Unsupported file type');
    });
  });
});