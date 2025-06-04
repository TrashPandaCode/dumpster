import * as Sheet from "@radix-ui/react-dialog";
import { HamburgerMenuIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import classnames from "classnames";
import { Index } from "flexsearch";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router";

import navigation from "~/lib/core/navigation.json";
import {
  cleanMarkdownContent,
  extractDescription,
  type NavigationItem,
  type NavigationSection,
  type SearchableItem,
} from "../../search-utils";
import Collapsible from "./Collapsible";

const Divider: React.FC<{ title: string }> = ({ title }) => (
  <div className="border-b border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 uppercase">
    {title}
  </div>
);

interface NavItemProps {
  item: NavigationItem | SearchableItem;
  className?: string;
  onClick?: () => void;
  showDescription?: boolean;
}

const docs = import.meta.glob("/content/docs/**/*.{md,mdx}", {
  query: "?raw",
  import: "default",
});

const NavigationContent: React.FC<{ onItemClick?: () => void }> = ({
  onItemClick,
}) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [docsLoaded, setDocsLoaded] = useState(false);
  const [searchIndex, setSearchIndex] = useState<{
    index: Index;
    items: SearchableItem[];
  } | null>(null);

  useEffect(() => {
    const initializeSearch = async () => {
      const index = new Index({
        tokenize: "forward",
        cache: true,
        resolution: 9,
      });

      const searchableItems: SearchableItem[] = [];

      for (const section of navigation as NavigationSection[]) {
        if (section.path) {
          const content = await loadMarkdownContent(section.path);

          const item: SearchableItem = {
            path: section.path,
            title: section.title,
            sectionTitle: section.title,
            type: "section",
            content,
            description: extractDescription(content),
          };
          searchableItems.push(item);

          const searchText =
            `${section.title} ${section.title} ${content}`.toLowerCase();
          index.add(item.path, searchText);
        }

        if (section.items) {
          for (const item of section.items) {
            const content = await loadMarkdownContent(item.path);

            const searchableItem: SearchableItem = {
              ...item,
              sectionTitle: section.title,
              type: "item",
              content,
              description: extractDescription(content),
            };
            searchableItems.push(searchableItem);

            const searchText =
              `${item.title} ${section.title} ${content}`.toLowerCase();
            index.add(item.path, searchText);
          }
        }
      }
      setSearchIndex({ index, items: searchableItems });
      setDocsLoaded(true);
    };

    initializeSearch();
  }, []);

  const loadMarkdownContent = async (path: string): Promise<string> => {
    try {
      // Convert navigation path to file path
      const pathParts = path.split("/").filter(Boolean);
      let filePath: string;

      if (pathParts.length === 3 && pathParts[0] === "docs") {
        // Category/topic structure: /docs/category/topic
        const [, category, topic] = pathParts;
        filePath = `/content/docs/${category}/${topic}.mdx`;

        // Try .mdx first, then .md
        if (!docs[filePath]) {
          filePath = `/content/docs/${category}/${topic}.md`;
        }
      } else if (pathParts.length === 2) {
        // Flat structure: /docs/topic
        const topic = pathParts[1];
        filePath = `/content/docs/${topic}.mdx`;

        // Try .mdx first, then .md
        if (!docs[filePath]) {
          filePath = `/content/docs/${topic}.md`;
        }
      } else {
        return "";
      }

      const loader = docs[filePath];
      if (loader) {
        const content = (await loader()) as string;

        if (!content) {
          console.warn(`No content found for ${path}`);
          return "";
        }

        return cleanMarkdownContent(content);
      }
    } catch (error) {
      console.warn(`Failed to load content for ${path}:`, error);
    }
    return "";
  };

  const searchResults = useMemo(() => {
    if (!searchTerm.trim() || !searchIndex) return [];

    const results = searchIndex.index.search(searchTerm, { limit: 20 });

    return results
      .map((id) => searchIndex.items.find((item) => item.path === id))
      .filter(Boolean) as SearchableItem[];
  }, [searchTerm, searchIndex]);

  const isActivePath = (path: string): boolean => path === location.pathname;

  const ActiveIndicator: React.FC = () => (
    <div className="bg-jam-600 h-[6px] w-[6px] rounded-full" />
  );

  const NavItem: React.FC<NavItemProps> = ({
    item,
    className = "",
    onClick,
    showDescription = false,
  }) => {
    const isActive = isActivePath(item.path);
    const searchableItem = item as SearchableItem;

    const combinedClasses = classnames(
      "flex flex-col gap-1 px-2 py-2 hover:bg-slate-50 rounded transition-colors",
      {
        "bg-blue-50 font-bold": isActive,
        [className]: className,
      }
    );

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={combinedClasses}
        onClick={onClick}
      >
        <div className="flex items-center gap-2">
          <span className={classnames("text-sm", { "font-bold": isActive })}>
            {item.title}
          </span>
          {isActive && <ActiveIndicator />}
        </div>
        {showDescription && searchableItem.description && (
          <div className="mt-1 line-clamp-2 text-xs text-slate-600">
            {searchableItem.description}
          </div>
        )}
      </NavLink>
    );
  };

  const SearchResults: React.FC = () => {
    if (!searchTerm.trim()) return null;

    if (!docsLoaded) {
      return (
        <div className="px-2 py-4 text-sm text-slate-500">
          Loading search results...
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className="px-2 py-4 text-sm text-slate-500">
          No results found for "{searchTerm}"
        </div>
      );
    }

    // Group results by section
    const groupedResults = searchResults.reduce(
      (acc, item) => {
        if (!acc[item.sectionTitle]) {
          acc[item.sectionTitle] = [];
        }
        acc[item.sectionTitle].push(item);
        return acc;
      },
      {} as Record<string, SearchableItem[]>
    );

    return (
      <div className="flex flex-col gap-3">
        {Object.entries(groupedResults).map(([sectionTitle, items]) => (
          <div key={sectionTitle}>
            <div className="border-b border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 uppercase">
              {sectionTitle}
            </div>
            <div className="mt-1 space-y-1">
              {items.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  onClick={onItemClick}
                  showDescription={true}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderNavigationSection = (
    section: NavigationSection
  ): React.ReactNode => {
    const elements: React.ReactNode[] = [];

    const matchesSearch = (item: NavigationItem) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase());

    const filteredItems = section.items?.filter(matchesSearch) ?? [];

    if (
      searchTerm &&
      !matchesSearch({ title: section.title, path: section.path ?? "" }) &&
      filteredItems.length === 0
    ) {
      return null;
    }

    if (!searchTerm && section.title === "Hierarchies") {
      elements.push(<Divider key="concepts-divider" title="Concepts" />);
    }

    // Section with collapsible items
    if (filteredItems.length) {
      elements.push(
        <Collapsible
          key={section.title}
          title={section.title}
          open={searchTerm === "" ? undefined : !!searchTerm}
        >
          {filteredItems.map((item) => (
            <NavItem key={item.path} item={item} onClick={onItemClick} />
          ))}
        </Collapsible>
      );
      return elements;
    }

    // Standalone section with direct path
    if (
      section.path &&
      matchesSearch({ title: section.title, path: section.path })
    ) {
      const sectionAsItem: NavigationItem = {
        path: section.path,
        title: section.title,
      };
      elements.push(
        <NavItem
          key={section.path}
          item={sectionAsItem}
          className="px-2 py-1"
          onClick={onItemClick}
        />
      );
      return elements;
    }

    return null;
  };

  return (
    <div className="flex min-h-0 w-full flex-col space-y-1">
      <div className="relative mb-3 flex-shrink-0 text-black">
        <input
          className="h-10 w-full rounded-lg border-2 border-slate-300 bg-white px-5 pr-16 text-sm transition-colors focus:border-slate-700 focus:outline-none"
          type="text"
          name="search"
          placeholder="Search documentation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute top-0 right-0 mt-3 mr-5">
          <MagnifyingGlassIcon className="h-4 w-4 fill-current text-slate-600" />
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {searchTerm ? (
          <SearchResults />
        ) : (
          <>
            {!searchTerm && <Divider title="Game" />}
            {(navigation as NavigationSection[]).map(renderNavigationSection)}
          </>
        )}
      </div>
    </div>
  );
};

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex lg:w-xs">
        <NavigationContent />
      </nav>

      {/* Mobile Navigation */}
      <Sheet.Root open={isOpen} onOpenChange={setIsOpen}>
        <Sheet.Trigger asChild>
          <button
            className="rounded-md p-2 transition-colors hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation menu"
          >
            <HamburgerMenuIcon className="h-6 w-6" />
          </button>
        </Sheet.Trigger>
        <Sheet.Portal>
          <Sheet.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
          <Sheet.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left fixed inset-y-0 left-0 z-50 flex h-full w-3/4 max-w-sm flex-col border-r bg-white shadow-lg transition ease-in-out">
            <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 p-6 pb-4">
              <Sheet.Title className="text-lg font-semibold">
                Navigation
              </Sheet.Title>
              <Sheet.Close asChild>
                <button
                  className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none"
                  aria-label="Close"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </Sheet.Close>
            </div>
            <div className="flex-1 overflow-y-scroll p-6 pt-4">
              <NavigationContent onItemClick={() => setIsOpen(false)} />
            </div>
          </Sheet.Content>
        </Sheet.Portal>
      </Sheet.Root>
    </>
  );
};

export default Navigation;
