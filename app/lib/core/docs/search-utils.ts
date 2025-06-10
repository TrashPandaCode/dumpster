import { Index } from "flexsearch";

export interface NavigationItem {
  path: string;
  title: string;
}

export interface NavigationSection {
  title: string;
  path?: string;
  items?: NavigationItem[];
}

export interface SearchableItem extends NavigationItem {
  sectionTitle: string;
  type: "section" | "item";
  content?: string;
  description?: string;
}

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

export const extractDescription = (content: string): string => {
  if (!content) return '';
  const firstParagraph = content.split('\n\n')[0] || content.split('.')[0];
  return firstParagraph.length > 150 
    ? firstParagraph.substring(0, 150) + '...' 
    : firstParagraph;
};

export const createSearchIndex = () => {
  return new Index({
    tokenize: "forward",
    cache: true,
    resolution: 9,
  });
};