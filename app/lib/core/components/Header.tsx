import { NavLink } from "react-router";

const Header = () => {
  return (
    <header className="px-8">
      <nav className="flex items-center gap-8 p-4">
        <NavLink to="/" className="items-left font-pixel z-1 flex flex-col text-2xl font-bold">
          Dumpster Diving
        </NavLink>
        <NavLink
          to="/docs"
          className="hover:text-jam-600 transition-all duration-300"
        >
          Docs
        </NavLink>
        <NavLink
          to="/levels"
          className="hover:text-jam-600 transition-all duration-300"
        >
          Game
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
