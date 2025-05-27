import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { NavLink, useLocation } from "react-router";

import navigation from "~/lib/core/navigation.json";
import Collapsible from "./Collapsible";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="flex min-h-96 min-w-3xs flex-col gap-4">
      <div className="relative text-black">
        <input
          className="h-10 w-full rounded-lg border-2 border-slate-300 bg-white px-5 pr-16 text-sm focus:outline-none"
          type="text"
          name="search"
          placeholder="Search"
        />
        <button
          type="submit"
          className="absolute top-0 right-0 mt-3 mr-5 cursor-pointer"
        >
          <MagnifyingGlassIcon className="h-4 w-4 fill-current text-gray-600" />
        </button>
      </div>

      {navigation.map((section) =>
        section.items?.length ? (
          <Collapsible key={section.title} title={section.title}>
            {section.items.map((item) =>
              item.path == location.pathname ? (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 font-bold hover:underline"
                >
                  {item.title}
                  <div className="bg-jam-600 h-[6px] w-[6px] rounded-full" />
                </NavLink>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="hover:underline"
                >
                  {item.title}
                </NavLink>
              )
            )}
          </Collapsible>
        ) : section.path ? (
          // This handles standalone entries (without items)
          section.path === location.pathname ? (
            <NavLink
              key={section.path}
              to={section.path}
              className="flex items-center gap-2 font-bold hover:underline px-2 py-1"
            >
              {section.title}
              <div className="bg-jam-600 h-[6px] w-[6px] rounded-full" />
            </NavLink>
          ) : (
            <NavLink
              key={section.path}
              to={section.path}
              className="hover:underline px-2 py-1"
            >
              {section.title}
            </NavLink>
          )
        ) : null
      )}
    </nav>
  );
};

export default Navigation;
