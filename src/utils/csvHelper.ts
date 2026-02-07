/**
 * CSV Helper Utilities
 * 
 * This module provides utility functions for reading and writing CSV files.
 * It serves as the interface between the model layer and the file system.
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Ensure the data directory exists
 */
async function ensureDataDirectory(filePath: string): Promise<void> {
  const directory = path.dirname(filePath);
  try {
    await fs.access(directory);
  } catch {
    await fs.mkdir(directory, { recursive: true });
  }
}

/**
 * Parse CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Escape CSV value (wrap in quotes if contains comma or quote)
 */
function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Read CSV file and return rows (excluding header)
 */
export async function readCSV(filePath: string): Promise<string[][]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    if (lines.length <= 1) {
      return []; // No data rows (only header or empty)
    }

    // Skip header (first line) and parse remaining rows
    return lines.slice(1).map(line => parseCSVLine(line));
  } catch (error) {
    // File doesn't exist or can't be read
    return [];
  }
}

/**
 * Write CSV file with headers and rows
 */
export async function writeCSV(
  filePath: string,
  headers: string[],
  rows: string[][]
): Promise<void> {
  await ensureDataDirectory(filePath);

  const headerLine = headers.map(escapeCSVValue).join(',');
  const dataLines = rows.map(row => row.map(escapeCSVValue).join(','));
  const content = [headerLine, ...dataLines].join('\n');

  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Append a row to existing CSV file
 */
export async function appendCSV(
  filePath: string,
  row: string[]
): Promise<void> {
  await ensureDataDirectory(filePath);

  const line = row.map(escapeCSVValue).join(',');
  await fs.appendFile(filePath, '\n' + line, 'utf-8');
}

/**
 * Check if CSV file exists
 */
export async function csvExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
