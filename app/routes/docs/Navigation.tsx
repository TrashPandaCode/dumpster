import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useLocation } from "react-router";

import Collapsible from "./Collapsible";

const Navigation = () => {
  const location = useLocation();
  return (
    <nav className="flex h-96 min-w-3xs flex-col gap-8">
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

      <p>Kinematics</p>
      <p>Inverse Kinematics</p>
      <p>Forward Kinematics</p>

      <Collapsible title="Animation">
        <p className="flex items-center gap-2">
          Motion Capture <div className="bg-jam-600 h-2 w-2 rounded-full" />
        </p>
        <p>Motion Capture</p>
        <p>Motion Capture</p>
      </Collapsible>
    </nav>
  );
};

export default Navigation;
