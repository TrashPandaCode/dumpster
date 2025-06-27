import { NavLink } from "react-router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/lib/core/docs/components/Breadcrumb";
import DocsNodeEditor from "~/lib/core/docs/DocsNodeEditor";
import type { Route } from "../docs/+types/DocsContent";

import "katex/dist/katex.min.css";

import Details from "~/lib/core/docs/components/Details";

/**
 * Import all markdown files from the /content/docs directory
 * This will allow us to dynamically load the content based on the route parameters
 */
const docs = import.meta.glob("/content/docs/**/*.{md,mdx}");

/**
 * Loader function for the Docs route.
 * It retrieves the markdown content based on the category and topic from the URL parameters.
 * If the content is not found, it throws a 404 error.
 *
 * @param {Route.LoaderArgs} args - The route loader arguments containing URL parameters.
 * @returns {Promise<{ metadata: Record<string, any>; MDXComponent: React.ComponentType; category?: string; topic?: string }>} - The loaded content and metadata.
 */
export async function clientLoader({ params }: Route.LoaderArgs) {
  let { category, topic } = params;

  // if there's only `topic`, treat it as coming from a flat file under /docs
  if (!topic && category) {
    topic = category;
    category = undefined;
  }

  let path = category
    ? `/content/docs/${category}/${topic}.mdx`
    : `/content/docs/${topic}.mdx`;

  let loader = docs[path];

  if (!loader) {
    path = category
      ? `/content/docs/${category}/${topic}.md`
      : `/content/docs/${topic}.md`;
    loader = docs[path];
  }

  if (!loader) {
    throw new Response("Not found", { status: 404 });
  }

  const mod = (await loader()) as {
    frontmatter: Record<string, any>;
    default: React.ComponentType<{
      components?: Record<string, React.ComponentType<any>>;
    }>;
  };

  return {
    metadata: mod.frontmatter,
    MDXComponent: mod.default,
    category,
    topic,
  };
}

/**
 * Docs component that renders the documentation page.
 * It displays a breadcrumb navigation, the title of the documentation,
 * and the content of the documentation using the MDXComponent.
 */
const Docs = ({ loaderData }: Route.ComponentProps) => {
  const { metadata, MDXComponent, category, topic } = loaderData;

  return (
    <main className="w-full">
      <Breadcrumb className="mt-[10px] mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/docs">Docs</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="capitalize">
                {category.replaceAll("-", " ")}
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">
              {metadata?.title || topic}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article className="prose prose-slate max-w-4xl">
        <MDXComponent components={{ DocsNodeEditor, Details }} />
      </article>
    </main>
  );
};

export default Docs;
