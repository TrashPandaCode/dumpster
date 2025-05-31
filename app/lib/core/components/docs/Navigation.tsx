import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
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
}

const Navigation: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const isActivePath = (path: string): boolean => path === location.pathname;

  const ActiveIndicator: React.FC = () => (
    <div className="bg-jam-600 h-[6px] w-[6px] rounded-full" />
  );

  const NavLinkItem: React.FC<NavLinkItemProps> = ({
    item,
    className = "",
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
      <NavLink key={item.path} to={item.path} className={combinedClasses}>
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
      elements.push(<Divider title="Concepts" />);
    }

    // Section with collapsible items
    if (filteredItems.length) {
      elements.push(
        <Collapsible
          key={section.title}
          title={section.title}
          open={!!searchTerm}
        >
          {filteredItems.map((item) => (
            <NavLinkItem key={item.path} item={item} />
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
        />
      );
      return elements;
    }

    return null;
  };

  return (
    <nav className="flex min-h-96 min-w-xs flex-col gap-2">
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
    </nav>
  );
};

export default Navigation;
