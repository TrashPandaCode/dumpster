import { NavLink } from "react-router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/lib/core/components/Breadcrumb";
import type { Route } from "../docs/+types/DocsContent";

const docs = import.meta.glob("/content/docs/**/*.md");

export async function clientLoader({ params }: Route.LoaderArgs) {
  const { category, topic } = params;
  const key = `/content/docs/${category}/${topic}.md`;

  const loader = docs[key];
  if (!loader) {
    throw new Response("Not found", { status: 404 });
  }

  const mod = await loader();
  return {
    html: mod.html, // TODO: fix types
    metadata: mod.attributes, // TODO: fix types
    category,
    topic,
  };
}

const Docs = ({ loaderData }: Route.ComponentProps) => {
  const { html, metadata, category, topic } = loaderData;

  return (
    <main className="w-full">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/docs">Docs</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink className="capitalize" to={`/docs/${category}`}>
                {category}
              </NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">
              {metadata?.title || topic}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <article
        className="prose prose-slate max-w-4xl"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
};

export default Docs;
