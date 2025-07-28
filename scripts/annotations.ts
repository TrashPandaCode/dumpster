#!/usr/bin/env bun

import { readdirSync, readFileSync, statSync } from "fs";
import { join, extname, relative } from "path";

interface FileInfo {
  file: string;
  authors: string[];
  purpose: string;
}

// File extensions to process
const SUPPORTED_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte',
  '.py', '.java', '.c', '.cpp', '.h', '.hpp',
  '.cs', '.go', '.rs', '.php', '.rb', '.swift',
  '.kt', '.scala', '.dart', '.m', '.mm', '.mdx', '.md'
];

// Different comment patterns for different file types
const COMMENT_PATTERNS = {
  // C-style comments (JS, TS, Java, C++, etc.)
  cStyle: {
    multiLine: /\/\*[\s\S]*?\*\//g,
    singleLine: /\/\/.*$/gm
  },
  // Python-style comments
  python: {
    multiLine: /"""[\s\S]*?"""|'''[\s\S]*?'''/g,
    singleLine: /#.*$/gm
  },
  // HTML-style comments
  html: {
    multiLine: /<!--[\s\S]*?-->/g,
    singleLine: undefined
  },
  // MDX/JSX comments
  mdx: {
    multiLine: /\{\s*\/\*[\s\S]*?\*\/\s*\}/g,
    singleLine: /\/\/.*$/gm
  }
};

function getCommentPattern(filePath: string) {
  const ext = extname(filePath).toLowerCase();
  
  if (['.py'].includes(ext)) {
    return COMMENT_PATTERNS.python;
  } else if (['.html', '.xml'].includes(ext)) {
    return COMMENT_PATTERNS.html;
  } else if (['.mdx', '.md'].includes(ext)) {
    return COMMENT_PATTERNS.mdx;
  } else {
    return COMMENT_PATTERNS.cStyle;
  }
}

function extractComments(content: string, filePath: string): string[] {
  const pattern = getCommentPattern(filePath);
  const comments: string[] = [];
  
  // Extract multi-line comments
  if (pattern.multiLine) {
    const matches = content.match(pattern.multiLine);
    if (matches) {
      comments.push(...matches);
    }
  }
  
  // Extract single-line comments (group consecutive ones)
  if (pattern.singleLine) {
    const lines = content.split('\n');
    let currentBlock = '';
    
    for (const line of lines) {
      const match = line.match(pattern.singleLine);
      if (match) {
        currentBlock += line + '\n';
      } else if (currentBlock) {
        comments.push(currentBlock.trim());
        currentBlock = '';
      }
    }
    
    if (currentBlock) {
      comments.push(currentBlock.trim());
    }
  }
  
  return comments;
}

function parseAuthorsPurpose(comment: string): { authors: string[], purpose: string } {
  let authors: string[] = [];
  let purpose = '';
  
  // Clean up comment syntax - handle different comment types
  let cleanComment = comment
    .replace(/\/\*\*?|\*\/|\/\/|#|<!--|-->|\{\s*\/\*|\*\/\s*\}/g, '')
    .replace(/^\s*\*\s?/gm, '')
    .trim();
  
  // Additional cleanup for any remaining braces from MDX comments
  cleanComment = cleanComment.replace(/^\s*\{|\}\s*$/g, '').trim();
  
  // Extract authors
  const authorMatches = cleanComment.match(/Authors?\s*:\s*([^\n\r]+)/i);
  if (authorMatches) {
    authors = authorMatches[1]
      .split(/[,&]/)
      .map(author => author.trim())
      .filter(author => author.length > 0);
  }
  
  // Extract purpose
  const purposeMatch = cleanComment.match(/Purpose\s*:\s*([\s\S]*?)(?=\n\s*$|\n\s*\w+\s*:|$)/i);
  if (purposeMatch) {
    purpose = purposeMatch[1]
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  return { authors, purpose };
}

function findFilesRecursively(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip common directories that shouldn't be processed
        if (!['node_modules', '.git', 'dist', 'build', '.next', 'coverage'].includes(item)) {
          files.push(...findFilesRecursively(fullPath, baseDir));
        }
      } else if (stat.isFile()) {
        const ext = extname(fullPath).toLowerCase();
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          files.push(relative(baseDir, fullPath));
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return files;
}

function processFile(filePath: string): FileInfo | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const comments = extractComments(content, filePath);
    
    const allAuthors: string[] = [];
    const allPurposes: string[] = [];
    
    for (const comment of comments) {
      const { authors, purpose } = parseAuthorsPurpose(comment);
      
      if (authors.length > 0) {
        allAuthors.push(...authors);
      }
      
      if (purpose) {
        allPurposes.push(purpose);
      }
    }
    
    // Remove duplicates and filter
    const uniqueAuthors = [...new Set(allAuthors)];
    const combinedPurpose = allPurposes.join(' ');
    
    if (uniqueAuthors.length > 0 || combinedPurpose) {
      return {
        file: filePath,
        authors: uniqueAuthors,
        purpose: combinedPurpose
      };
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
  
  return null;
}

function generateTable(fileInfos: FileInfo[]): string {
  if (fileInfos.length === 0) {
    return `#table(
  columns: 3,
  [File], [Authors], [Purpose],
  [], [], []
)`;
  }
  
  let tableContent = `#table(
  columns: 3,
  [File], [Authors], [Purpose],`;
  
  for (const info of fileInfos) {
    const authors = info.authors.join(', ');
    const purpose = info.purpose || '';
    
    tableContent += `\n  [${info.file}], [${authors}], [${purpose}],`;
  }
  
  // Remove the last comma and close the table
  tableContent = tableContent.slice(0, -1) + '\n)';
  
  return tableContent;
}

function main() {
  const targetDir = process.argv[2] || '.';
  
  console.log(`Scanning directory: ${targetDir}`);
  console.log('Supported extensions:', SUPPORTED_EXTENSIONS.join(', '));
  console.log('---');
  
  const files = findFilesRecursively(targetDir);
  console.log(`Found ${files.length} files to process`);
  
  const fileInfos: FileInfo[] = [];
  
  for (const file of files) {
    const fullPath = join(targetDir, file);
    const info = processFile(fullPath);
    
    if (info) {
      fileInfos.push(info);
      console.log(`✓ Processed: ${file}`);
    }
  }
  
  console.log(`\nFound author/purpose information in ${fileInfos.length} files`);
  console.log('\n--- TABLE OUTPUT ---\n');
  
  const table = generateTable(fileInfos);
  console.log(table);
}

// Run the script
main();