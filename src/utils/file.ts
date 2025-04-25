import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

/**
 * Reads and parses a YAML file
 * @param filePath Path to the YAML file
 * @returns Parsed YAML data
 * @throws Error if file cannot be read or parsed
 */
export function readYamlFile(filePath: string): any {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`);
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return yaml.load(content);
  } catch (error) {
    throw new Error(`Failed to read YAML file ${filePath}: ${(error as Error).message}`);
  }
}

/**
 * Writes an object to a YAML file
 * @param filePath Path to write the YAML file
 * @param data Data to serialize as YAML
 * @throws Error if file cannot be written
 */
export function writeYamlFile(filePath: string, data: any): void {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const content = yaml.dump(data, { quotingType: '"' });
    fs.writeFileSync(filePath, content);
  } catch (error) {
    throw new Error(`Failed to write YAML file ${filePath}: ${(error as Error).message}`);
  }
}

/**
 * Reads a JSON file
 * @param filePath Path to the JSON file
 * @returns Parsed JSON data
 * @throws Error if file cannot be read or parsed
 */
export function readJsonFile(filePath: string): any {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`);
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read JSON file ${filePath}: ${(error as Error).message}`);
  }
}

/**
 * Writes an object to a JSON file
 * @param filePath Path to write the JSON file
 * @param data Data to serialize as JSON
 * @throws Error if file cannot be written
 */
export function writeJsonFile(filePath: string, data: any): void {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content);
  } catch (error) {
    throw new Error(`Failed to write JSON file ${filePath}: ${(error as Error).message}`);
  }
}

/**
 * Gets the appropriate extension for a file path
 * @param filePath The file path to extract extension from
 * @returns Lowercase file extension including the dot (e.g., '.json', '.yaml')
 */
export function getFileExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase();
}

/**
 * Determines if a file is a YAML file based on its extension
 * @param filePath The file path to check
 * @returns true if the file has a .yaml or .yml extension
 */
export function isYamlFile(filePath: string): boolean {
  const ext = getFileExtension(filePath);
  return ext === '.yaml' || ext === '.yml';
}

/**
 * Determines if a file is a JSON file based on its extension
 * @param filePath The file path to check
 * @returns true if the file has a .json extension
 */
export function isJsonFile(filePath: string): boolean {
  return getFileExtension(filePath) === '.json';
}

/**
 * Reads a file based on its extension (YAML or JSON)
 * @param filePath Path to the data file (YAML or JSON)
 * @returns Parsed data from the file
 * @throws Error if file type is unsupported or file cannot be read
 */
export function readDataFile(filePath: string): any {
  if (isYamlFile(filePath)) {
    return readYamlFile(filePath);
  } else if (isJsonFile(filePath)) {
    return readJsonFile(filePath);
  } else {
    throw new Error(`Unsupported file type: ${filePath}`);
  }
}

/**
 * Writes data to a file based on its extension (YAML or JSON)
 * @param filePath Path to write the data file (YAML or JSON)
 * @param data Data to serialize
 * @throws Error if file type is unsupported or file cannot be written
 */
export function writeDataFile(filePath: string, data: any): void {
  if (isYamlFile(filePath)) {
    writeYamlFile(filePath, data);
  } else if (isJsonFile(filePath)) {
    writeJsonFile(filePath, data);
  } else {
    throw new Error(`Unsupported file type: ${filePath}`);
  }
}