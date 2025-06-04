import * as Sheet from "@radix-ui/react-dialog";
import { HamburgerMenuIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import classnames from "classnames";
import type React from "react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router";

import navigation from "~/lib/core/navigation.json";
import Collapsible from "./Collapsible";

const Divider: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center gap-2 px-2 py-1">
    <span className="text-sm">{title}</span>
    <div className="h-[1px] w-full bg-gray-300" />
  </div>
);

interface NavigationItem {
  path: string;
  title: string;
}

interface NavigationSection {
  title: string;
  path?: string;
  items?: NavigationItem[];
}

interface NavLinkItemProps {
  item: NavigationItem;
  className?: string;
  onClick?: () => void;
}

const NavigationContent: React.FC<{ onItemClick?: () => void }> = ({
  onItemClick,
}) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const isActivePath = (path: string): boolean => path === location.pathname;

  const ActiveIndicator: React.FC = () => (
    <div className="bg-jam-600 h-[6px] w-[6px] rounded-full" />
  );

  const NavLinkItem: React.FC<NavLinkItemProps> = ({
    item,
    className = "",
    onClick,
  }) => {
    const isActive = isActivePath(item.path);
    const combinedClasses = classnames(
      "flex items-center gap-2 px-2 py-1 hover:underline",
      {
        "font-bold": isActive,
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
        {item.title}
        {isActive && <ActiveIndicator />}
      </NavLink>
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
            <NavLinkItem key={item.path} item={item} onClick={onItemClick} />
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
        <NavLinkItem
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
    <div className="flex min-h-96 min-w-3xs lg:min-w-xs flex-col gap-2">
      <div className="relative text-black">
        <input
          className="h-10 w-full rounded-lg border-2 border-slate-300 bg-white px-5 pr-16 text-sm focus:outline-none"
          type="text"
          name="search"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute top-0 right-0 mt-3 mr-5 cursor-pointer">
          <MagnifyingGlassIcon className="h-4 w-4 fill-current text-gray-600" />
        </div>
      </div>

      {!searchTerm && <Divider title="Game" />}

      {(navigation as NavigationSection[]).map(renderNavigationSection)}
    </div>
  );
};

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex">
        <NavigationContent />
      </nav>

      {/* Mobile Navigation */}
      <Sheet.Root open={isOpen} onOpenChange={setIsOpen}>
        <Sheet.Trigger asChild>
          <button
            className="rounded-md p-2 transition-colors hover:bg-gray-100 lg:hidden"
            aria-label="Open navigation menu"
          >
            <HamburgerMenuIcon className="h-6 w-6" />
          </button>
        </Sheet.Trigger>
        <Sheet.Portal>
          <Sheet.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
          <Sheet.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left fixed inset-y-0 left-0 z-50 h-full w-3/4 max-w-sm border-r bg-white p-6 shadow-lg transition ease-in-out">
            <div className="mb-4 flex items-center justify-between">
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
            <div className="overflow-y-auto">
              <NavigationContent onItemClick={() => setIsOpen(false)} />
            </div>
          </Sheet.Content>
        </Sheet.Portal>
      </Sheet.Root>
    </>
  );
};

export default Navigation;
