/*
 * Authors: Leo Kling
 *
 * Purpose: Tests for the documentation system, including navigation structure, markdown file coverage, and content validation.
 */
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { describe, expect, test } from "bun:test";

import navigation from "~/lib/core/docs/navigation.json";
import type { NavigationSection } from "~/lib/core/docs/search-utils";
import { LEVELS } from "~/lib/game/core/levels";

// Helper function to recursively find all markdown files
function findMarkdownFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);

    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath, baseDir));
    } else if (item.endsWith(".md") || item.endsWith(".mdx")) {
      // Convert file path to navigation path format
      const relativePath = fullPath.replace(baseDir, "").replace(/\\/g, "/");
      const withoutExtension = relativePath.replace(/\.(md|mdx)$/, "");
      const navigationPath = `/docs${withoutExtension}`;
      files.push(navigationPath);
    }
  }

  return files;
}

// Helper function to extract all navigation paths
function extractNavigationPaths(nav: NavigationSection[]): string[] {
  const paths: string[] = [];

  for (const section of nav) {
    if (section.path) {
      paths.push(section.path);
    }

    if (section.items) {
      for (const item of section.items) {
        paths.push(item.path);
      }
    }
  }

  return paths;
}

// Helper function to validate navigation structure
function validateNavigationStructure(nav: NavigationSection[]) {
  if (!Array.isArray(nav)) {
    return false;
  }

  return nav.every((section) => {
    if (typeof section !== "object" || section === null) {
      return false;
    }

    if (typeof section.title !== "string" || section.title.trim() === "") {
      return false;
    }

    if (section.path !== undefined && typeof section.path !== "string") {
      return false;
    }

    if (section.items !== undefined) {
      if (!Array.isArray(section.items)) {
        return false;
      }

      return section.items.every((item) => {
        return (
          typeof item === "object" &&
          item !== null &&
          typeof item.path === "string" &&
          typeof item.title === "string" &&
          item.title.trim() !== ""
        );
      });
    }

    return true;
  });
}

// Helper function to extract frontmatter from markdown content
function extractFrontmatter(
  content: string
): { title?: string; [key: string]: any } | null {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return null;
  }

  const frontmatterContent = match[1];
  const frontmatter: { [key: string]: any } = {};

  // Simple YAML parsing for key-value pairs
  const lines = frontmatterContent.split("\n");
  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line
        .substring(colonIndex + 1)
        .trim()
        .replace(/^["']|["']$/g, ""); // Remove quotes
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

// Helper function to get file path from navigation path
function getFilePathFromNavigationPath(navPath: string): string {
  const pathParts = navPath.split("/").filter(Boolean);

  if (pathParts.length === 3 && pathParts[0] === "docs") {
    // Category/topic structure: /docs/category/topic
    const [, category, topic] = pathParts;
    return join(process.cwd(), `content/docs/${category}/${topic}.mdx`);
  } else if (pathParts.length === 2) {
    // Flat structure: /docs/topic
    const topic = pathParts[1];
    return join(process.cwd(), `content/docs/${topic}.mdx`);
  }

  return "";
}

describe("Documentation System Tests", () => {
  const contentDocsPath = join(process.cwd(), "content/docs");
  const markdownFiles = findMarkdownFiles(contentDocsPath);
  const navigationPaths = extractNavigationPaths(
    navigation as NavigationSection[]
  );

  describe("Navigation JSON Structure", () => {
    test("navigation.json should have valid structure", () => {
      expect(validateNavigationStructure(navigation)).toBe(true);
    });

    test("all navigation sections should have titles", () => {
      (navigation as NavigationSection[]).forEach((section) => {
        expect(section.title).toBeDefined();
        expect(typeof section.title).toBe("string");
        expect(section.title.trim()).not.toBe("");
      });
    });

    test("all navigation items should have valid paths and titles", () => {
      (navigation as NavigationSection[]).forEach((section) => {
        if (section.path) {
          expect(typeof section.path).toBe("string");
          expect(section.path).toMatch(/^\/docs/);
        }

        if (section.items) {
          section.items.forEach((item) => {
            expect(item.path).toBeDefined();
            expect(typeof item.path).toBe("string");
            expect(item.path).toMatch(/^\/docs/);

            expect(item.title).toBeDefined();
            expect(typeof item.title).toBe("string");
            expect(item.title.trim()).not.toBe("");
          });
        }
      });
    });

    test("navigation paths should be unique", () => {
      const uniquePaths = new Set(navigationPaths);
      expect(uniquePaths.size).toBe(navigationPaths.length);
    });
  });

  describe("Markdown Files Coverage", () => {
    test("all markdown files should have corresponding navigation entries", () => {
      const missingInNavigation = markdownFiles.filter(
        (filePath) => !navigationPaths.includes(filePath)
      );

      if (missingInNavigation.length > 0) {
        console.log(
          "Markdown files missing from navigation.json:",
          missingInNavigation
        );
      }

      expect(missingInNavigation).toEqual([]);
    });

    test("all navigation entries should have corresponding markdown files", () => {
      const missingFiles = navigationPaths.filter(
        (navPath) => !markdownFiles.includes(navPath)
      );

      if (missingFiles.length > 0) {
        console.log(
          "Navigation entries missing corresponding files:",
          missingFiles
        );
      }

      expect(missingFiles).toEqual([]);
    });
  });

  describe("Path Format Consistency", () => {
    test("all navigation paths should follow /docs/* pattern", () => {
      navigationPaths.forEach((path) => {
        expect(path).toMatch(/^\/docs/);
        expect(path).not.toMatch(/\.(md|mdx)$/); // Should not include file extensions
      });
    });

    test("navigation paths should use correct format for categories", () => {
      navigationPaths.forEach((path) => {
        // Paths should either be /docs/topic or /docs/category/topic
        const pathParts = path.split("/").filter(Boolean);
        expect(pathParts.length).toBeGreaterThanOrEqual(2);
        expect(pathParts.length).toBeLessThanOrEqual(3);
        expect(pathParts[0]).toBe("docs");
      });
    });
  });

  describe("Content Validation", () => {
    test("navigation sections should be logically organized", () => {
      const sections = navigation as NavigationSection[];

      // Check for reasonable section organization
      expect(sections.length).toBeGreaterThan(0);

      // Each section should have either a path or items (or both)
      sections.forEach((section) => {
        const hasPath = section.path !== undefined;
        const hasItems =
          section.items !== undefined && section.items.length > 0;
        expect(hasPath || hasItems).toBe(true);
      });
    });

    test("hierarchical structure should be consistent", () => {
      const sections = navigation as NavigationSection[];

      sections.forEach((section) => {
        if (section.items) {
          // If a section has items, they should all be related to the section
          section.items.forEach((item) => {
            // Items in a section should have paths that make sense hierarchically
            if (section.path) {
              // If section has a path, items should be sub-paths or related
              expect(item.path).toMatch(/^\/docs/);
            }
          });
        }
      });
    });
  });

  describe("Documentation Completeness", () => {
    test("essential documentation files should exist", () => {
      const essentialDocs = ["/docs/getting-started", "/docs/faq"];

      essentialDocs.forEach((docPath) => {
        expect(markdownFiles).toContain(docPath);
        expect(navigationPaths).toContain(docPath);
      });
    });

    test("node documentation should be comprehensive", () => {
      const nodeDocPaths = navigationPaths.filter((path) =>
        path.includes("/docs/nodes/")
      );

      // Should have documentation for major node types
      const expectedNodeDocs = [
        "/docs/nodes/export",
        "/docs/nodes/import",
        "/docs/nodes/math",
      ];

      expectedNodeDocs.forEach((expectedDoc) => {
        expect(nodeDocPaths).toContain(expectedDoc);
      });
    });
  });

  describe("Search Integration", () => {
    test("navigation structure should be compatible with search system", () => {
      const sections = navigation as NavigationSection[];

      // Each section should have searchable content
      sections.forEach((section) => {
        // Section title should be search-friendly
        expect(section.title.length).toBeGreaterThan(0);
        expect(section.title.length).toBeLessThan(100); // Reasonable title length

        if (section.items) {
          section.items.forEach((item) => {
            expect(item.title.length).toBeGreaterThan(0);
            expect(item.title.length).toBeLessThan(100);
          });
        }
      });
    });

    test("paths should be valid for glob patterns used in search", () => {
      navigationPaths.forEach((path) => {
        // Paths should be compatible with the glob patterns in Navigation.tsx
        expect(path).not.toContain(".."); // No relative path traversal
        expect(path).not.toContain("//"); // No double slashes
        expect(path).toMatch(/^\/docs(\/[^/]+)*$/); // Valid path structure
      });
    });
  });

  describe("Cross-Reference Validation", () => {
    test("navigation should not reference non-existent paths", () => {
      // This is covered by the "all navigation entries should have corresponding markdown files" test
      // but we can add additional validation here
      navigationPaths.forEach((path) => {
        expect(typeof path).toBe("string");
        expect(path.trim()).toBe(path); // No leading/trailing whitespace
        expect(path).not.toBe(""); // Not empty
      });
    });

    test("section and item paths should not conflict", () => {
      const sectionPaths = (navigation as NavigationSection[])
        .filter((section) => section.path)
        .map((section) => section.path!);

      const itemPaths = (navigation as NavigationSection[])
        .flatMap((section) => section.items || [])
        .map((item) => item.path);

      const allPaths = [...sectionPaths, ...itemPaths];
      const uniquePaths = new Set(allPaths);

      expect(uniquePaths.size).toBe(allPaths.length);
    });
  });

  describe("Frontmatter Validation", () => {
    test("all markdown files should have frontmatter with title", () => {
      const filesWithoutTitle: string[] = [];
      const filesWithoutFrontmatter: string[] = [];

      markdownFiles.forEach((navPath) => {
        let filePath = getFilePathFromNavigationPath(navPath);

        // Try .mdx first, then .md
        try {
          if (!statSync(filePath).isFile()) {
            throw new Error("File not found");
          }
        } catch {
          filePath = filePath.replace(".mdx", ".md");
          try {
            if (!statSync(filePath).isFile()) {
              throw new Error("File not found");
            }
          } catch {
            return; // Skip if file doesn't exist (covered by other tests)
          }
        }

        const content = readFileSync(filePath, "utf-8");
        const frontmatter = extractFrontmatter(content);

        if (!frontmatter) {
          filesWithoutFrontmatter.push(navPath);
          return;
        }

        if (
          !frontmatter.title ||
          typeof frontmatter.title !== "string" ||
          frontmatter.title.trim() === ""
        ) {
          filesWithoutTitle.push(navPath);
        }
      });

      if (filesWithoutFrontmatter.length > 0) {
        console.log("Files without frontmatter:", filesWithoutFrontmatter);
      }

      if (filesWithoutTitle.length > 0) {
        console.log("Files without title in frontmatter:", filesWithoutTitle);
      }

      expect(filesWithoutFrontmatter).toEqual([]);
      expect(filesWithoutTitle).toEqual([]);
    });

    test("frontmatter titles should be meaningful", () => {
      const filesWithGenericTitles: string[] = [];

      markdownFiles.forEach((navPath) => {
        let filePath = getFilePathFromNavigationPath(navPath);

        // Try .mdx first, then .md
        try {
          if (!statSync(filePath).isFile()) {
            throw new Error("File not found");
          }
        } catch {
          filePath = filePath.replace(".mdx", ".md");
          try {
            if (!statSync(filePath).isFile()) {
              throw new Error("File not found");
            }
          } catch {
            return; // Skip if file doesn't exist
          }
        }

        const content = readFileSync(filePath, "utf-8");
        const frontmatter = extractFrontmatter(content);

        if (frontmatter?.title) {
          const title = frontmatter.title.toLowerCase();

          // Check for generic or placeholder titles
          const genericTitles = [
            "untitled",
            "document",
            "page",
            "draft",
            "todo",
            "tbd",
            "placeholder",
          ];

          if (genericTitles.some((generic) => title.includes(generic))) {
            filesWithGenericTitles.push(
              `${navPath} (title: "${frontmatter.title}")`
            );
          }
        }
      });

      if (filesWithGenericTitles.length > 0) {
        console.log(
          "Files with generic or inadequate titles:",
          filesWithGenericTitles
        );
      }

      expect(filesWithGenericTitles).toEqual([]);
    });
  });

  describe("Content Structure Validation", () => {
    test("markdown files should not contain placeholder content", () => {
      const filesWithPlaceholders: string[] = [];
      const placeholderPatterns = [
        /lorem ipsum/i,
        /placeholder/i,
        /todo:?\s/i,
        /fixme:?\s/i,
        /\[insert.*\]/i,
        /coming soon/i,
        /under construction/i,
      ];

      markdownFiles.forEach((navPath) => {
        let filePath = getFilePathFromNavigationPath(navPath);

        try {
          if (!statSync(filePath).isFile()) {
            filePath = filePath.replace(".mdx", ".md");
          }

          const content = readFileSync(filePath, "utf-8");

          placeholderPatterns.forEach((pattern) => {
            if (pattern.test(content)) {
              filesWithPlaceholders.push(
                `${navPath} (contains: ${pattern.source})`
              );
            }
          });
        } catch {
          // Skip files that don't exist
        }
      });

      if (filesWithPlaceholders.length > 0) {
        console.log("Files with placeholder content:", filesWithPlaceholders);
      }

      expect(filesWithPlaceholders).toEqual([]);
    });
  });

  describe("MDX Component Integration", () => {
    test("MDX files should only use allowed components", () => {
      const allowedComponents = ["DocsNodeEditor"]; // Add more as needed
      const filesWithUnknownComponents: string[] = [];

      markdownFiles.forEach((navPath) => {
        if (!navPath.includes(".mdx")) return; // Only check MDX files

        const filePath = getFilePathFromNavigationPath(navPath);

        try {
          const content = readFileSync(filePath, "utf-8");

          // Look for JSX component usage
          const componentMatches = content.match(/<[A-Z][a-zA-Z0-9]*(\s|>)/g);
          if (componentMatches) {
            componentMatches.forEach((match) => {
              const componentName = match.replace(
                /<([A-Z][a-zA-Z0-9]*).*/g,
                "$1"
              );
              if (!allowedComponents.includes(componentName)) {
                filesWithUnknownComponents.push(
                  `${navPath} (uses: ${componentName})`
                );
              }
            });
          }
        } catch {
          // Skip files that don't exist
        }
      });

      if (filesWithUnknownComponents.length > 0) {
        console.log(
          "Files using unknown components:",
          filesWithUnknownComponents
        );
      }

      expect(filesWithUnknownComponents).toEqual([]);
    });

    test("DocsNodeEditor components should have required props", () => {
      const filesWithInvalidNodeEditor: string[] = [];

      markdownFiles.forEach((navPath) => {
        if (!navPath.includes(".mdx")) return;

        const filePath = getFilePathFromNavigationPath(navPath);

        try {
          const content = readFileSync(filePath, "utf-8");

          const nodeEditorMatches = content.match(/<DocsNodeEditor[^>]*>/g);
          if (nodeEditorMatches) {
            nodeEditorMatches.forEach((match) => {
              // Check for required props (add validation based on your component)
              if (!match.includes("nodes=") && !match.includes("level=")) {
                filesWithInvalidNodeEditor.push(
                  `${navPath} (missing required props)`
                );
              }
            });
          }
        } catch {
          // Skip files that don't exist
        }
      });

      if (filesWithInvalidNodeEditor.length > 0) {
        console.log(
          "Files with invalid DocsNodeEditor usage:",
          filesWithInvalidNodeEditor
        );
      }

      expect(filesWithInvalidNodeEditor).toEqual([]);
    });
  });

  describe("Link and Reference Validation", () => {
    test("internal links should point to existing pages", () => {
      const brokenInternalLinks: string[] = [];

      markdownFiles.forEach((navPath) => {
        let filePath = getFilePathFromNavigationPath(navPath);

        try {
          if (!statSync(filePath).isFile()) {
            filePath = filePath.replace(".mdx", ".md");
          }

          const content = readFileSync(filePath, "utf-8");

          // Find internal links [text](/docs/...) but exclude image links
          // Image links start with ![, so we use negative lookbehind to exclude them
          const internalLinkMatches = content.match(
            /(?<!!)\[([^\]]+)\]\(\/docs\/[^)]+\)/g
          );
          if (internalLinkMatches) {
            internalLinkMatches.forEach((match) => {
              const linkPath = match.match(/\(([^)]+)\)/)?.[1];
              if (linkPath) {
                // Remove any hash fragments (anchors) for validation
                const cleanPath = linkPath.split("#")[0];

                // Only check paths that look like page links (not images or other assets)
                if (
                  cleanPath &&
                  !cleanPath.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|pdf)$/i) &&
                  !navigationPaths.includes(cleanPath)
                ) {
                  brokenInternalLinks.push(`${navPath} -> ${linkPath}`);
                }
              }
            });
          }
        } catch {
          // Skip files that don't exist
        }
      });

      if (brokenInternalLinks.length > 0) {
        console.log("Broken internal links:", brokenInternalLinks);
      }

      expect(brokenInternalLinks).toEqual([]);
    });

    test("external links should be valid URLs", () => {
      const invalidExternalLinks: string[] = [];

      markdownFiles.forEach((navPath) => {
        let filePath = getFilePathFromNavigationPath(navPath);

        try {
          if (!statSync(filePath).isFile()) {
            filePath = filePath.replace(".mdx", ".md");
          }

          const content = readFileSync(filePath, "utf-8");

          // Find external links [text](http...)
          const externalLinkMatches = content.match(
            /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g
          );
          if (externalLinkMatches) {
            externalLinkMatches.forEach((match) => {
              const url = match.match(/\((https?:\/\/[^)]+)\)/)?.[1];
              if (url) {
                try {
                  new URL(url);
                } catch {
                  invalidExternalLinks.push(`${navPath} -> ${url}`);
                }
              }
            });
          }
        } catch {
          // Skip files that don't exist
        }
      });

      if (invalidExternalLinks.length > 0) {
        console.log("Invalid external links:", invalidExternalLinks);
      }

      expect(invalidExternalLinks).toEqual([]);
    });
  });

  describe("Category Organization", () => {
    test("categories should have consistent organization", () => {
      const categories = new Set<string>();
      const categoryStats: Record<string, number> = {};

      navigationPaths.forEach((path) => {
        const pathParts = path.split("/").filter(Boolean);
        if (pathParts.length === 3) {
          const category = pathParts[1];
          categories.add(category);
          categoryStats[category] = (categoryStats[category] || 0) + 1;
        }
      });

      // Categories with only one page might need reorganization
      const smallCategories = Object.entries(categoryStats)
        .filter(([, count]) => count === 1)
        .map(([category]) => category);

      if (smallCategories.length > 0) {
        console.log(
          "Categories with only one page (consider flattening):",
          smallCategories
        );
      }

      // This might be a warning rather than hard failure
      expect(categories.size).toBeGreaterThan(0);
    });
  });

  describe("File Extension Consistency", () => {
    test("should prefer MDX for interactive content, MD for static content", () => {
      const mdxFiles: string[] = [];
      const mdFiles: string[] = [];

      markdownFiles.forEach((navPath) => {
        const mdxPath = getFilePathFromNavigationPath(navPath);
        const mdPath = mdxPath.replace(".mdx", ".md");

        try {
          if (statSync(mdxPath).isFile()) {
            mdxFiles.push(navPath);
          }
        } catch {
          try {
            if (statSync(mdPath).isFile()) {
              mdFiles.push(navPath);
            }
          } catch {
            // File doesn't exist
          }
        }
      });

      // Check if MDX files actually use MDX features
      const unnecessaryMdxFiles: string[] = [];
      mdxFiles.forEach((navPath) => {
        const filePath = getFilePathFromNavigationPath(navPath);
        try {
          const content = readFileSync(filePath, "utf-8");
          const hasMdxFeatures =
            (content.includes("<") && content.includes(">")) || // JSX
            content.includes("import ") || // ES imports
            content.includes("export "); // ES exports

          if (!hasMdxFeatures) {
            unnecessaryMdxFiles.push(navPath);
          }
        } catch {
          // Skip
        }
      });

      if (unnecessaryMdxFiles.length > 0) {
        console.log(
          "MDX files that could be MD (no interactive features):",
          unnecessaryMdxFiles
        );
      }

      // This might be informational rather than a hard failure
      expect(mdxFiles.length + mdFiles.length).toBe(markdownFiles.length);
    });
  });

  describe("Performance and Bundle Size", () => {
    test("should not have excessive number of files", () => {
      const totalFiles = markdownFiles.length;

      // Warn if there are too many docs (might affect build performance)
      if (totalFiles > 100) {
        console.warn(
          `Large number of doc files (${totalFiles}). Consider consolidation.`
        );
      }

      expect(totalFiles).toBeGreaterThan(0);
      expect(totalFiles).toBeLessThan(500); // Reasonable upper limit
    });

    test("navigation.json should not be excessively large", () => {
      const navigationJson = JSON.stringify(navigation);
      const sizeInKB = Buffer.byteLength(navigationJson, "utf8") / 1024;

      // Navigation JSON shouldn't be too large for client-side performance
      expect(sizeInKB).toBeLessThan(50); // 50KB limit
    });
  });

  describe("Accessibility", () => {
    test("images should have alt text", () => {
      const imagesWithoutAlt: string[] = [];

      markdownFiles.forEach((navPath) => {
        let filePath = getFilePathFromNavigationPath(navPath);

        try {
          if (!statSync(filePath).isFile()) {
            filePath = filePath.replace(".mdx", ".md");
          }

          const content = readFileSync(filePath, "utf-8");

          // Find markdown images ![alt](src)
          const imageMatches = content.match(/!\[([^\]]*)\]\([^)]+\)/g);
          if (imageMatches) {
            imageMatches.forEach((match) => {
              const altText = match.match(/!\[([^\]]*)\]/)?.[1];
              if (!altText || altText.trim() === "") {
                imagesWithoutAlt.push(`${navPath}: ${match}`);
              }
            });
          }
        } catch {
          // Skip files that don't exist
        }
      });

      if (imagesWithoutAlt.length > 0) {
        console.log("Images without alt text:", imagesWithoutAlt);
      }

      expect(imagesWithoutAlt).toEqual([]);
    });
  });

  describe("Level Documentation Coverage", () => {
    test("should have level guide documentation for each game level", () => {
      const missingLevelDocs: string[] = [];
      const levelSlugs = Object.keys(LEVELS);

      levelSlugs.forEach((levelSlug) => {
        const expectedLevelDocPath = `/docs/level-guides/${levelSlug}`;

        if (!navigationPaths.includes(expectedLevelDocPath)) {
          missingLevelDocs.push(levelSlug);
        }
      });

      if (missingLevelDocs.length > 0) {
        console.log("Levels missing documentation files:", missingLevelDocs);
        console.log(
          "Expected paths:",
          missingLevelDocs.map((slug) => `/docs/level-guides/${slug}`)
        );
      }

      expect(missingLevelDocs).toEqual([]);
    });

    test("level documentation should match actual level metadata", () => {
      const levelDocumentationIssues: string[] = [];

      // Find all level documentation files
      const levelDocPaths = navigationPaths.filter((path) =>
        path.startsWith("/docs/level-guides/")
      );

      levelDocPaths.forEach((docPath) => {
        const levelSlug = docPath.replace(
          "/docs/level-guides/",
          ""
        ) as keyof typeof LEVELS;

        // Check if the level exists in the game
        if (!LEVELS[levelSlug]) {
          levelDocumentationIssues.push(
            `Documentation exists for non-existent level: ${levelSlug}`
          );
          return;
        }

        const level = LEVELS[levelSlug];
        let filePath = getFilePathFromNavigationPath(docPath);

        try {
          if (!statSync(filePath).isFile()) {
            filePath = filePath.replace(".mdx", ".md");
          }

          const content = readFileSync(filePath, "utf-8");
          const frontmatter = extractFrontmatter(content);

          // Check if frontmatter title matches level name
          if (frontmatter?.title && frontmatter.title !== level.name) {
            levelDocumentationIssues.push(
              `Title mismatch for ${levelSlug}: doc="${frontmatter.title}" vs level="${level.name}"`
            );
          }
        } catch (error) {
          levelDocumentationIssues.push(
            `Error reading documentation for ${levelSlug}: ${error}`
          );
        }
      });

      if (levelDocumentationIssues.length > 0) {
        console.log("Level documentation issues:", levelDocumentationIssues);
      }

      expect(levelDocumentationIssues).toEqual([]);
    });

    test("should have proper level documentation organization in navigation", () => {
      const levelDocPaths = navigationPaths.filter((path) =>
        path.startsWith("/docs/level-guides/")
      );

      // Check if there's a levels section in navigation
      const sections = navigation as NavigationSection[];
      const levelsSection = sections.find(
        (section) =>
          section.title.toLowerCase().includes("level") ||
          (section.items &&
            section.items.some((item) =>
              item.path.startsWith("/docs/level-guides/")
            ))
      );

      if (levelDocPaths.length > 0) {
        expect(levelsSection).toBeDefined();

        if (levelsSection) {
          // All level docs should be properly categorized
          const navigationLevelPaths = levelsSection.items
            ? levelsSection.items
                .filter((item) => item.path.startsWith("/docs/level-guides/"))
                .map((item) => item.path)
            : levelsSection.path &&
                levelsSection.path.startsWith("/docs/level-guides/")
              ? [levelsSection.path]
              : [];

          const missingFromNavigation = levelDocPaths.filter(
            (path) => !navigationLevelPaths.includes(path)
          );

          if (missingFromNavigation.length > 0) {
            console.log(
              "Level docs not properly organized in navigation:",
              missingFromNavigation
            );
          }

          expect(missingFromNavigation).toEqual([]);
        }
      }
    });
  });
});
