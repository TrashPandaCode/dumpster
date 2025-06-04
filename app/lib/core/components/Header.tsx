import { NavLink } from "react-router";
import Navigation from "./docs/Navigation";

const Header = () => {
  return (
 <header className="px-8">
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="items-left font-pixel z-1 flex flex-col text-2xl font-bold">
            Dumpster Diving
          </NavLink>
          <div className="hidden md:flex gap-8">
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
          </div>
        </div>
        
        {/* Mobile Navigation Trigger */}
        <div className="lg:hidden">
          <Navigation />
        </div>
      </nav>
    </header>
  );
};

export default Header;
