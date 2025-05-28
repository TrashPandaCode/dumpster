import { NavLink } from "react-router";

const Footer = () => {
  return (
    <footer className="grid grid-cols-3 gap-12 p-12">
      <div className="flex flex-col">
        <h1 className="pb-4 text-lg font-bold">About</h1>
        <a
          href="https://github.com/TrashPandaCode/dumpster/graphs/contributors"
          target="_blank"
          className="self-start text-sm hover:underline"
        >
          Team
        </a>
        <a
          href="https://github.com/TrashPandaCode/dumpster"
          target="_blank"
          className="self-start text-sm hover:underline"
        >
          Source Code
        </a>
        <a
          href=""
          target="_blank"
          className="self-start text-sm hover:underline"
        >
          Literature
        </a>
      </div>
      <div className="flex flex-col">
        <h1 className="pb-4 text-lg font-bold">Legal & Policies</h1>
        <NavLink to="/imprint" className="self-start text-sm hover:underline">
          Imprint
        </NavLink>
        <NavLink
          to="/privacy-policy"
          className="self-start text-sm hover:underline"
        >
          Privacy policy
        </NavLink>
        <NavLink
          to="/cookie-policy"
          className="self-start text-sm hover:underline"
        >
          Cookie policy
        </NavLink>
      </div>
      <div className="flex flex-col">
        <h1 className="pb-4 text-lg font-bold">Get Help</h1>
        <NavLink
          to="/faqs"
          target="_blank"
          className="self-start text-sm hover:underline"
        >
          FAQs
        </NavLink>
        <a
          href=""
          target="_blank"
          className="self-start text-sm hover:underline"
        >
          Getting Started
        </a>
        <NavLink
          to="/docs"
          target="_blank"
          className="self-start text-sm hover:underline"
        >
          Dumpster Docs
        </NavLink>
      </div>
    </footer>
  );
};

export default Footer;
