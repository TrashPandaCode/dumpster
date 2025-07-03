/*
 * Authors: Leo Kling
 *
 * Purpose: Utility functions for managing navigation items and sections, as well as full-text search in the documentation.
 */
import { Index } from "flexsearch";

/**
 * Represents a single navigation item with a path and title.
 */
export interface NavigationItem {
  path: string;
  title: string;
}

/**
 * Represents a navigation section with a title, optional path, and items.
 * The items can be either NavigationItem or SearchableItem.
 */
export interface NavigationSection {
  title: string;
  path?: string;
  items?: NavigationItem[];
}

/**
 * Represents a searchable item in the navigation.
 * It extends NavigationItem with additional properties for search functionality.
 */
export interface SearchableItem extends NavigationItem {
  sectionTitle: string;
  type: "section" | "item";
  content?: string;
  description?: string;
}

/**
 * Cleans markdown content by removing frontmatter and markdown syntax.
 * It also normalizes whitespace and trims the content.
 * @param content - The markdown content to clean.
 * @returns The cleaned content as a string.
 */
export const cleanMarkdownContent = (content: string): string => {
  return (
    content
      // Remove frontmatter
      .replace(/^---[\s\S]*?---/, "")
      // Remove markdown syntax
      .replace(/#{1,6}\s/g, "") // Headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
      .replace(/\*(.*?)\*/g, "$1") // Italic
      .replace(/`(.*?)`/g, "$1") // Inline code
      .replace(/```[\s\S]*?```/g, "") // Code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1") // Images
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
};

/**
 * Extracts a short description from the content.
 * It takes the first paragraph or sentence and truncates it to 150 characters if necessary.
 * @param content - The content from which to extract the description.
 * @returns A short description string.
 */
export const extractDescription = (content: string): string => {
  if (!content) return "";
  const firstParagraph = content.split("\n\n")[0] || content.split(".")[0];
  return firstParagraph.length > 150
    ? firstParagraph.substring(0, 150) + "..."
    : firstParagraph;
};

/**
 * Creates a new FlexSearch index for searching documentation content.
 * The index is configured to tokenize text forward, cache results, and has a resolution of 9.
 * @returns A new instance of FlexSearch Index.
 */
export const createSearchIndex = () => {
  return new Index({
    tokenize: "forward",
    cache: true,
    resolution: 9,
  });
};
