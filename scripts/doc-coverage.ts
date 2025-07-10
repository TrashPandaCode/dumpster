#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Configuration - you can modify these values
const CONFIG = {
  sourceDir: "src",
  extensions: ["ts", "tsx", "js", "jsx"],
  ignorePatterns: ["**/*.test.*", "**/*.spec.*", "**/*.d.ts", "**/*.stories.*"],
  threshold: 70,
  outputFormats: ["console", "json", "html", "markdown"],
  verbose: false,
};

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

function parseArguments() {
  const args = process.argv.slice(2);
  const config = { ...CONFIG };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--src":
      case "-s":
        config.sourceDir = args[++i];
        break;
      case "--threshold":
      case "-t":
        config.threshold = parseInt(args[++i]);
        break;
      case "--verbose":
      case "-v":
        config.verbose = true;
        break;
      case "--format":
      case "-f":
        config.outputFormats = args[++i].split(",");
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
        break;
    }
  }

  return config;
}

function printHelp() {
  console.log(`
${colors.bright}Documentation Coverage Tool${colors.reset}

Usage: node doc-coverage.js [options]

Options:
  -s, --src <dir>         Source directory (default: src)
  -t, --threshold <num>   Coverage threshold percentage (default: 70)
  -f, --format <formats>  Output formats: console,json,html,markdown (default: all)
  -v, --verbose          Verbose output
  -h, --help             Show this help

Examples:
  node doc-coverage.js
  node doc-coverage.js --src src --threshold 80
  node doc-coverage.js --format console,json
  `);
}

function analyzeFile(filePath, config) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const relativePath = path.relative(process.cwd(), filePath);

    // Remove comments and strings to avoid false matches
    const cleanContent = removeCommentsAndStrings(content);

    // Enhanced regex patterns for better detection
    const patterns = {
      functions: [
        // Named function declarations (not in imports)
        /(?:^|\n)\s*(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
        // Arrow functions assigned to const/let/var (exclude simple assignments)
        /(?:^|\n)\s*(?:export\s+)?(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[:=]\s*(?:async\s+)?\([^)]*\)\s*(?::\s*[^=]*)?=>/g,
        // Function expressions assigned to const/let/var
        /(?:^|\n)\s*(?:export\s+)?(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[:=]\s*(?:async\s+)?function/g,
      ],
      classes: [
        /(?:^|\n)\s*(?:export\s+)?(?:abstract\s+)?class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      ],
      interfaces: [
        /(?:^|\n)\s*(?:export\s+)?interface\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      ],
      types: [
        /(?:^|\n)\s*(?:export\s+)?type\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g,
      ],
      methods: [
        // Class methods (not imports or destructuring)
        /^\s*(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:async\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*[:{]/gm,
      ],
      reactComponents: [
        // React functional components - be more specific
        /(?:^|\n)\s*(?:export\s+(?:default\s+)?)?(?:const|let)\s+([A-Z][a-zA-Z0-9_$]*)\s*=\s*(?:memo\s*\(|React\.memo\s*\()?.*?(?:\([^)]*\)\s*=>\s*\{|\([^)]*\)\s*=>\s*\()/g,
        // Function components
        /(?:^|\n)\s*(?:export\s+(?:default\s+)?)?function\s+([A-Z][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*[:{]/g,
      ],
    };

    // Items that should NOT be documented (filters)
    const shouldExclude = (name, match, type) => {
      // Skip if it's an import statement
      if (/^\s*import\s/.test(match)) return true;

      // Skip destructuring assignments from imports
      if (/from\s+['"`]/.test(match)) return true;

      // Skip if it's a type-only import
      if (/import\s+type/.test(match)) return true;

      // Skip if it's a re-export
      if (/export\s*\{.*\}\s*from/.test(match)) return true;

      // Skip variable declarations that are just imports/requires
      if (/require\s*\(/.test(match)) return true;

      // Skip simple variable assignments (not functions)
      if (
        type === "functions" &&
        !/(?:function|\([^)]*\)\s*=>|\(\s*\)\s*=>)/.test(match)
      )
        return true;

      // Skip one-letter variables or common non-documentable patterns
      if (name.length <= 1) return true;

      // Skip common utility/config variable names that typically don't need docs
      const skipNames = [
        "i",
        "j",
        "k",
        "x",
        "y",
        "z",
        "el",
        "e",
        "err",
        "res",
        "req",
        "ctx",
        "config",
        "props",
        "state",
      ];
      if (skipNames.includes(name.toLowerCase())) return true;

      // Skip if inside an import block (multi-line imports)
      const lines = content.split("\n");
      const matchLine = getLineNumber(content, match);
      const contextLines = lines
        .slice(Math.max(0, matchLine - 3), matchLine + 2)
        .join("\n");
      if (
        /import\s*\{[^}]*$/m.test(contextLines) ||
        /^\s*[^}]*\}\s*from/.test(contextLines)
      )
        return true;

      // Skip destructured imports like { Position, useReactFlow }
      if (/^\s*[\w\s,{}]+\s*from\s*['"`]/.test(match)) return true;

      // Skip imports that span multiple lines
      if (/import\s*\{[\s\S]*?\}\s*from/.test(match)) return true;

      // Check if this item already has JSDoc documentation immediately before it
      const itemLine = getLineNumber(content, match);
      const precedingLines = lines.slice(Math.max(0, itemLine - 10), itemLine);
      const precedingText = precedingLines.join("\n");

      // Look for JSDoc block ending just before this item
      const jsdocPattern = /\/\*\*[\s\S]*?\*\/\s*$/;
      if (jsdocPattern.test(precedingText)) return true;

      // Skip if it's just a const assignment without function-like behavior
      if (
        type === "functions" &&
        /^\s*(?:export\s+)?const\s+\w+\s*=\s*[^(]/.test(match) &&
        !/=>\s*\{|=>\s*\(|=\s*function|=\s*async/.test(match)
      )
        return true;

      return false;
    };

    // Count documentable items
    let documentable = [];

    Object.entries(patterns).forEach(([type, regexes]) => {
      regexes.forEach((regex) => {
        let match;
        regex.lastIndex = 0; // Reset regex state

        while ((match = regex.exec(cleanContent)) !== null) {
          const fullMatch = match[0];
          const name = match[1] || match[2]; // Handle different capture groups

          if (name && !shouldExclude(name, fullMatch, type)) {
            // Get the original match from the content with comments
            const originalMatch = getOriginalMatch(
              content,
              fullMatch,
              match.index
            );

            documentable.push({
              type,
              name,
              line: getLineNumber(content, originalMatch),
              match: originalMatch.trim(),
            });
          }
        }
      });
    });

    // Remove duplicates based on name and type
    documentable = documentable.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => t.name === item.name && t.type === item.type)
    );

    // Count documentation
    const jsdocPattern = /\/\*\*[\s\S]*?\*\//g;
    const jsdocComments = content.match(jsdocPattern) || [];

    // Count inline documentation comments
    const inlineDocPattern =
      /\/\/\s*@\w+|\/\/\s*TODO:|\/\/\s*FIXME:|\/\/\s*NOTE:/g;
    const inlineComments = content.match(inlineDocPattern) || [];

    // Analyze JSDoc quality
    const jsdocQuality = analyzeJSDocQuality(jsdocComments);

    const result = {
      file: relativePath,
      lines: content.split("\n").length,
      documentable: documentable.length,
      documented: jsdocComments.length,
      inlineComments: inlineComments.length,
      coverage:
        documentable.length > 0
          ? (jsdocComments.length / documentable.length) * 100
          : 100,
      breakdown: {
        functions: documentable.filter((d) => d.type === "functions").length,
        classes: documentable.filter((d) => d.type === "classes").length,
        interfaces: documentable.filter((d) => d.type === "interfaces").length,
        types: documentable.filter((d) => d.type === "types").length,
        methods: documentable.filter((d) => d.type === "methods").length,
        reactComponents: documentable.filter(
          (d) => d.type === "reactComponents"
        ).length,
      },
      jsdocQuality,
      items: config.verbose ? documentable : [],
    };

    return result;
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return null;
  }
}

function removeCommentsAndStrings(content) {
  // Remove single-line comments but keep structure
  let cleaned = content.replace(/\/\/.*$/gm, "");

  // Remove multi-line comments but keep structure
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove string literals but keep structure
  cleaned = cleaned.replace(/"(?:[^"\\]|\\.)*"/g, '""');
  cleaned = cleaned.replace(/'(?:[^'\\]|\\.)*'/g, "''");
  cleaned = cleaned.replace(/`(?:[^`\\]|\\.)*`/g, "``");

  return cleaned;
}

function getOriginalMatch(content, cleanMatch, index) {
  // Find the corresponding position in the original content
  // This is a simplified approach - in complex cases you might need more sophisticated mapping
  const lines = content.split("\n");
  const cleanLines = removeCommentsAndStrings(content).split("\n");

  // Find the line that contains our match
  for (let i = 0; i < cleanLines.length; i++) {
    if (cleanLines[i].includes(cleanMatch.split("\n")[0])) {
      return lines[i] || cleanMatch;
    }
  }

  return cleanMatch;
}

function getLineNumber(content, searchString) {
  const index = content.indexOf(searchString);
  if (index === -1) return 0;
  return content.substring(0, index).split("\n").length;
}

function analyzeJSDocQuality(jsdocComments) {
  const quality = {
    total: jsdocComments.length,
    withDescription: 0,
    withParams: 0,
    withReturns: 0,
    withExamples: 0,
    score: 0,
  };

  jsdocComments.forEach((comment) => {
    if (/@description|[^@]\w+/.test(comment)) quality.withDescription++;
    if (/@param/.test(comment)) quality.withParams++;
    if (/@returns?/.test(comment)) quality.withReturns++;
    if (/@example/.test(comment)) quality.withExamples++;
  });

  if (quality.total > 0) {
    quality.score = Math.round(
      ((quality.withDescription +
        quality.withParams +
        quality.withReturns +
        quality.withExamples) /
        (quality.total * 4)) *
        100
    );
  }

  return quality;
}

function generateReport(config) {
  const pattern = `${config.sourceDir}/**/*.{${config.extensions.join(",")}}`;
  const files = glob.sync(pattern, { ignore: config.ignorePatterns });

  if (files.length === 0) {
    console.error(
      `${colors.red}No files found matching pattern: ${pattern}${colors.reset}`
    );
    process.exit(1);
  }

  const results = [];
  let totalDocumentable = 0;
  let totalDocumented = 0;

  console.log(
    `${colors.blue}Analyzing ${files.length} files...${colors.reset}`
  );

  files.forEach((file) => {
    const result = analyzeFile(file, config);
    if (result) {
      results.push(result);
      totalDocumentable += result.documentable;
      totalDocumented += result.documented;
    }
  });

  const overallCoverage =
    totalDocumentable > 0 ? (totalDocumented / totalDocumentable) * 100 : 100;

  const report = {
    timestamp: new Date().toISOString(),
    config: {
      sourceDir: config.sourceDir,
      threshold: config.threshold,
      filesAnalyzed: results.length,
    },
    summary: {
      overallCoverage: Math.round(overallCoverage * 100) / 100,
      totalFiles: results.length,
      totalDocumentable,
      totalDocumented,
      passesThreshold: overallCoverage >= config.threshold,
    },
    breakdown: {
      functions: results.reduce((sum, r) => sum + r.breakdown.functions, 0),
      classes: results.reduce((sum, r) => sum + r.breakdown.classes, 0),
      interfaces: results.reduce((sum, r) => sum + r.breakdown.interfaces, 0),
      types: results.reduce((sum, r) => sum + r.breakdown.types, 0),
      methods: results.reduce((sum, r) => sum + r.breakdown.methods, 0),
      reactComponents: results.reduce(
        (sum, r) => sum + r.breakdown.reactComponents,
        0
      ),
    },
    files: results.sort((a, b) => a.coverage - b.coverage),
  };

  return report;
}

function outputConsole(report) {
  const { summary, files } = report;
  const coverageColor =
    summary.overallCoverage >= 90
      ? colors.green
      : summary.overallCoverage >= 70
        ? colors.yellow
        : colors.red;

  console.log(
    `\n${colors.bright}📚 Documentation Coverage Report${colors.reset}`
  );
  console.log(`${"=".repeat(50)}`);
  console.log(
    `${colors.bright}Overall Coverage:${colors.reset} ${coverageColor}${summary.overallCoverage.toFixed(1)}%${colors.reset}`
  );
  console.log(
    `${colors.bright}Files Analyzed:${colors.reset} ${summary.totalFiles}`
  );
  console.log(
    `${colors.bright}Total Documentable:${colors.reset} ${summary.totalDocumentable}`
  );
  console.log(
    `${colors.bright}Total Documented:${colors.reset} ${summary.totalDocumented}`
  );
  console.log(
    `${colors.bright}Threshold:${colors.reset} ${report.config.threshold}%`
  );
  console.log(
    `${colors.bright}Status:${colors.reset} ${summary.passesThreshold ? `${colors.green}✅ PASS` : `${colors.red}❌ FAIL`}${colors.reset}`
  );

  // Breakdown by type
  console.log(`\n${colors.bright}Breakdown by Type:${colors.reset}`);
  Object.entries(report.breakdown).forEach(([type, count]) => {
    if (count > 0) {
      console.log(`  ${type}: ${count}`);
    }
  });

  // Top 10 files with lowest coverage
  console.log(`\n${colors.bright}Files with Lowest Coverage:${colors.reset}`);
  const worstFiles = files.filter((f) => f.documentable > 0).slice(0, 10);

  if (worstFiles.length > 0) {
    console.log(
      `${"File".padEnd(40)} ${"Coverage".padEnd(10)} ${"Items".padEnd(8)} ${"Docs".padEnd(6)}`
    );
    console.log(`${"-".repeat(70)}`);

    worstFiles.forEach((file) => {
      const coverageStr = `${file.coverage.toFixed(1)}%`;
      const fileColor =
        file.coverage >= 90
          ? colors.green
          : file.coverage >= 70
            ? colors.yellow
            : colors.red;

      console.log(
        `${file.file.padEnd(40)} ${fileColor}${coverageStr.padEnd(10)}${colors.reset} ` +
          `${file.documentable.toString().padEnd(8)} ${file.documented.toString().padEnd(6)}`
      );
    });
  }

  console.log(`\n${colors.bright}Legend:${colors.reset}`);
  console.log(`${colors.green}  Green: >= 90%${colors.reset}`);
  console.log(`${colors.yellow}  Yellow: >= 70%${colors.reset}`);
  console.log(`${colors.red}  Red: < 70%${colors.reset}`);

  return summary.passesThreshold;
}

function outputJSON(report) {
  const filename = "doc-coverage-report.json";
  fs.writeFileSync(filename, JSON.stringify(report, null, 2));
  console.log(
    `\n${colors.green}JSON report saved to: ${filename}${colors.reset}`
  );
}

function outputMarkdown(report) {
  const { summary, files, breakdown } = report;

  let markdown = `# Documentation Coverage Report\n\n`;
  markdown += `Generated on: ${new Date(report.timestamp).toLocaleString()}\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- **Overall Coverage:** ${summary.overallCoverage.toFixed(1)}%\n`;
  markdown += `- **Files Analyzed:** ${summary.totalFiles}\n`;
  markdown += `- **Total Documentable Items:** ${summary.totalDocumentable}\n`;
  markdown += `- **Total Documented Items:** ${summary.totalDocumented}\n`;
  markdown += `- **Threshold:** ${report.config.threshold}%\n`;
  markdown += `- **Status:** ${summary.passesThreshold ? "✅ PASS" : "❌ FAIL"}\n\n`;

  if (summary.overallCoverage < 70) {
    markdown += `⚠️ **Warning:** Documentation coverage is below 70%\n\n`;
  } else if (summary.overallCoverage >= 90) {
    markdown += `🎉 **Excellent:** Documentation coverage is above 90%\n\n`;
  }

  markdown += `## Breakdown by Type\n\n`;
  markdown += `| Type | Count |\n`;
  markdown += `|------|-------|\n`;
  Object.entries(breakdown).forEach(([type, count]) => {
    if (count > 0) {
      markdown += `| ${type} | ${count} |\n`;
    }
  });

  markdown += `\n## Files with Lowest Coverage\n\n`;
  markdown += `| File | Coverage | Documentable | Documented |\n`;
  markdown += `|------|----------|--------------|------------|\n`;

  files
    .filter((f) => f.documentable > 0)
    .slice(0, 15)
    .forEach((file) => {
      const status =
        file.coverage >= 90 ? "🟢" : file.coverage >= 70 ? "🟡" : "🔴";
      markdown += `| ${status} ${file.file} | ${file.coverage.toFixed(1)}% | ${file.documentable} | ${file.documented} |\n`;
    });

  const filename = "doc-coverage-report.md";
  fs.writeFileSync(filename, markdown);
  console.log(
    `${colors.green}Markdown report saved to: ${filename}${colors.reset}`
  );
}

function outputHTML(report) {
  const { summary, files, breakdown } = report;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation Coverage Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; color: #007acc; }
        .metric-label { font-size: 0.9em; color: #666; margin-top: 5px; }
        .status-pass { color: #28a745; }
        .status-fail { color: #dc3545; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: 600; }
        .coverage-high { color: #28a745; font-weight: bold; }
        .coverage-medium { color: #ffc107; font-weight: bold; }
        .coverage-low { color: #dc3545; font-weight: bold; }
        .progress-bar { width: 100%; height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; transition: width 0.3s ease; }
        .progress-high { background: #28a745; }
        .progress-medium { background: #ffc107; }
        .progress-low { background: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 Documentation Coverage Report</h1>
        <p><strong>Generated:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value ${summary.overallCoverage >= 70 ? "status-pass" : "status-fail"}">${summary.overallCoverage.toFixed(1)}%</div>
                <div class="metric-label">Overall Coverage</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.totalFiles}</div>
                <div class="metric-label">Files Analyzed</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.totalDocumentable}</div>
                <div class="metric-label">Documentable Items</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.totalDocumented}</div>
                <div class="metric-label">Documented Items</div>
            </div>
        </div>
        
        <h2>Breakdown by Type</h2>
        <table>
            <thead>
                <tr><th>Type</th><th>Count</th></tr>
            </thead>
            <tbody>
                ${Object.entries(breakdown)
                  .map(([type, count]) =>
                    count > 0
                      ? `<tr><td>${type}</td><td>${count}</td></tr>`
                      : ""
                  )
                  .join("")}
            </tbody>
        </table>
        
        <h2>File Coverage Details</h2>
        <table>
            <thead>
                <tr><th>File</th><th>Coverage</th><th>Progress</th><th>Documentable</th><th>Documented</th></tr>
            </thead>
            <tbody>
                ${files
                  .filter((f) => f.documentable > 0)
                  .map((file) => {
                    const coverageClass =
                      file.coverage >= 90
                        ? "coverage-high"
                        : file.coverage >= 70
                          ? "coverage-medium"
                          : "coverage-low";
                    const progressClass =
                      file.coverage >= 90
                        ? "progress-high"
                        : file.coverage >= 70
                          ? "progress-medium"
                          : "progress-low";
                    return `
                        <tr>
                            <td>${file.file}</td>
                            <td class="${coverageClass}">${file.coverage.toFixed(1)}%</td>
                            <td>
                                <div class="progress-bar">
                                    <div class="progress-fill ${progressClass}" style="width: ${file.coverage}%"></div>
                                </div>
                            </td>
                            <td>${file.documentable}</td>
                            <td>${file.documented}</td>
                        </tr>
                    `;
                  })
                  .join("")}
            </tbody>
        </table>
    </div>
</body>
</html>`;

  const filename = "doc-coverage-report.html";
  fs.writeFileSync(filename, html);
  console.log(
    `${colors.green}HTML report saved to: ${filename}${colors.reset}`
  );
}

function main() {
  const config = parseArguments();

  console.log(`${colors.bright}Documentation Coverage Analysis${colors.reset}`);
  console.log(`Source: ${config.sourceDir}`);
  console.log(`Threshold: ${config.threshold}%`);
  console.log(`Extensions: ${config.extensions.join(", ")}`);

  const report = generateReport(config);
  let success = true;

  // Output in requested formats
  if (config.outputFormats.includes("console")) {
    success = outputConsole(report) && success;
  }

  if (config.outputFormats.includes("json")) {
    outputJSON(report);
  }

  if (config.outputFormats.includes("markdown")) {
    outputMarkdown(report);
  }

  if (config.outputFormats.includes("html")) {
    outputHTML(report);
  }

  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Check if running directly (not imported)
if (require.main === module) {
  main();
}

module.exports = { analyzeFile, generateReport };
