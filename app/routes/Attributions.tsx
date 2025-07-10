import Footer from "~/lib/core/components/Footer";
import Header from "~/lib/core/components/Header";

const Imprint = () => {
  return (
    <>
      <Header />

      <main className="flex w-full flex-col gap-12 px-12 pt-16 md:flex-row">
        <div className="prose prose-slate max-w-none flex-1">
          <h1>Attributions</h1>
          <p>
            The <strong>Dumpster</strong> project was made possible thanks to
            the work of the open-source community. The following libraries and
            tools were used:
          </p>

          <h2>Core Frameworks & State</h2>
          <ul>
            <li>
              <strong>
                <a href="https://reactjs.org" target="_blank">
                  React
                </a>
              </strong>{" "}
              (MIT) - UI library
            </li>
            <li>
              <strong>
                <a href="https://github.com/pmndrs/zustand" target="_blank">
                  Zustand
                </a>
              </strong>{" "}
              (MIT) - State management
            </li>
            <li>
              <strong>
                <a href="https://reactrouter.com" target="_blank">
                  React Router
                </a>
              </strong>{" "}
              (MIT) - Routing library
            </li>
            <li>
              <strong>
                <a href="https://reactflow.dev" target="_blank">
                  @xyflow/react (React Flow)
                </a>
              </strong>{" "}
              (MIT) - Node editor
            </li>
          </ul>

          <h2>UI & Interactions</h2>
          <ul>
            <li>
              <strong>
                <a href="https://www.radix-ui.com" target="_blank">
                  Radix UI
                </a>
              </strong>{" "}
              (MIT) - Accessible UI primitives
            </li>
            <li>
              <strong>
                <a
                  href="https://www.npmjs.com/package/classnames"
                  target="_blank"
                >
                  Classnames
                </a>
              </strong>{" "}
              (MIT) - Class utility
            </li>
            <li>
              <strong>
                <a href="https://www.embla-carousel.com" target="_blank">
                  Embla Carousel
                </a>
              </strong>{" "}
              (MIT) - Carousel component
            </li>
            <li>
              <strong>
                {" "}
                <a
                  href="https://github.com/bvaughn/react-resizable-panels"
                  target="_blank"
                >
                  React Resizable Panels
                </a>
              </strong>{" "}
              (MIT) - Layout resizing
            </li>
            <li>
              <strong>
                {" "}
                <a href="https://sonner.emilkowal.ski/" target="_blank">
                  Sonner
                </a>
              </strong>{" "}
              (MIT) - Toast notifications
            </li>
            <li>
              <strong>
                {" "}
                <a
                  href="https://www.npmjs.com/package/downshift"
                  target="_blank"
                >
                  Downshift
                </a>
              </strong>{" "}
              (MIT) - Autocomplete & dropdown primitives
            </li>
          </ul>

          <h2>Game Engine</h2>
          <ul>
            <li>
              <strong>
                <a href="https://github.com/kaplayjs/kaplay" target="_blank">
                  Kaplay
                </a>
              </strong>{" "}
              (MIT) - JavaScript/TypeScript game engine
            </li>
          </ul>

          <h2>Utility & Content</h2>
          <ul>
            <li>
              <strong>
                <a
                  href="https://github.com/nextapps-de/flexsearch"
                  target="_blank"
                >
                  FlexSearch
                </a>
              </strong>{" "}
              (MIT) - Full-text search
            </li>
            <li>
              <strong>
                <a href="https://www.npmjs.com/package/uuid" target="_blank">
                  UUID
                </a>
              </strong>{" "}
              (MIT) - Unique identifier generation
            </li>
            <li>
              <strong>
                <a
                  href="https://github.com/jonschlinkert/gray-matter"
                  target="_blank"
                >
                  Gray Matter
                </a>
              </strong>{" "}
              (MIT) - Front matter parsing
            </li>
          </ul>

          <h2>Markdown & Math</h2>
          <ul>
            <li>
              @mdx-js/rollup, remark-gfm, remark-math, rehype-katex - MDX & math
              rendering
            </li>
          </ul>

          <h2>Tooling & Dev Experience</h2>
          <ul>
            <li>
              <strong>TypeScript</strong> (Apache 2.0) - Strongly typed
              JavaScript
            </li>
            <li>
              <strong>Vite</strong> (MIT) - Fast bundler & dev server
            </li>
            <li>
              <strong>ESLint / Prettier</strong> (MIT) - Linting & code
              formatting
            </li>
            <li>
              <strong>Tailwind CSS</strong> (MIT) - Utility-first CSS
            </li>
            <li>
              <strong>Jest / ts-jest</strong> (MIT) - Testing framework
            </li>
            <li>
              <strong>React Router Devtools</strong> (MIT) - Devtools for React
              Router
            </li>
          </ul>

          <h2>Build Plugins</h2>
          <ul>
            <li>@vitejs/plugin-react-swc - React transform plugin</li>
            <li>vite-tsconfig-paths - TS paths support</li>
            <li>prettier-plugin-tailwindcss - Tailwind-aware formatting</li>
          </ul>

          <h2>Assets</h2>
          <ul>
            <li>
              <strong>
                <a href="https://ambientcg.com/" target="_blank">
                  ambientCG
                </a>
              </strong>{" "}
              Materials
            </li>
            <li>
              <strong>
                <a href="https://polyhaven.com/" target="_blank">
                  Poly Haven
                </a>
              </strong>{" "}
              3D Models & Materials
            </li>
          </ul>

          <p>
            All libraries are used under their respective open-source licenses.
            We are deeply grateful to the maintainers and contributors who make
            open-source possible.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Imprint;
