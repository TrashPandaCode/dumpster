import { NavLink } from "react-router";

const Footer = () => {
  return (
    <footer className="grid grid-cols-3 gap-12 p-12">
      <div className="flex flex-col">
        <h1 className="pb-4 text-lg font-bold">About</h1>
        <a
          href=""
          target="_blank"
          className="self-start text-sm hover:underline"
        >
          Team
        </a>
        <a
          href=""
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
        <a
          href=""
          target="_blank"
          className="self-start text-sm hover:underline"
        >
          Imprint
        </a>
        <a
          href=""
          target="_blank"
          className="self-start text-sm hover:underline"
        >
          Privacy policy
        </a>
        <a
          href=""
          target="_blank"
          className="self-start text-sm hover:underline"
        >
          Cookie policy
        </a>
        <a
          href=""
          target="_blank"
          className="self-start text-sm hover:underline"
        >
          Code of conduct
        </a>
      </div>
      <div className="flex flex-col">
        <h1 className="pb-4 text-lg font-bold">Get Help</h1>
        <a
          href=""
          target="_blank"
          className="self-start text-sm hover:underline"
        >
          FAQs
        </a>
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
