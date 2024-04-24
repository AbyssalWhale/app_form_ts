import * as path from 'path';
import * as fs from 'fs';

export function getRootDirectory(): string {
  return path.resolve(__dirname, '../');
}

export function getDownloadDir(){
  let result = path.join(getRootDirectory(), 'downloads')
  makeDirectoryIfNotExists(result)
  return result
}

export function makeDirectoryIfNotExists(directoryPath: string): void {
  if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
      console.log(`Directory '${directoryPath}' created successfully.`);
  } else {
      console.log(`Directory '${directoryPath}' already exists.`);
  }
}