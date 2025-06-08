import { NavLink } from "react-router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/lib/core/components/Breadcrumb";
import DocsNodeEditor from "~/lib/core/DocsNodeEditor";
import type { Route } from "../docs/+types/DocsContent";
import "katex/dist/katex.min.css";

const docs = import.meta.glob("/content/docs/**/*.{md,mdx}");

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
    default: React.ComponentType<{ components?: Record<string, React.ComponentType<any>> }>;
  };

  return {
    metadata: mod.frontmatter,
    MDXComponent: mod.default,
    category,
    topic,
  };
}

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
              <BreadcrumbItem className="capitalize">{category.replaceAll("-", " ")}</BreadcrumbItem>
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
        <MDXComponent components={{ DocsNodeEditor }} />
      </article>
    </main>
  );
};

export default Docs;
