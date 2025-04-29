import { useOutlet } from "react-router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/lib/core/components/Breadcrumb";
import Footer from "~/lib/core/components/Footer";
import Header from "~/lib/core/components/Header";
import Navigation from "./Navigation";

const Docs = () => {
  const outlet = useOutlet();

  return (
    <>
      <Header />
      <div className="flex gap-4 px-12">
        <Navigation />
        {outlet || (
          <main className="w-full">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>Docs</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="prose prose-slate max-w-4xl">
              <h1>Overview</h1>
              <p>
                Whatever we wanna explain. Lorem ipsum dolor sit amet,
                consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                invidunt ut labore et dolore magna aliquyam erat, sed diam
                voluptua. At vero eos et accusam et justo duo dolores et ea
                rebum. Stet clita kasd gubergren, no sea takimata sanctus est
                Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
                consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                invidunt ut labore et dolore magna aliquyam erat, sed diam
                voluptua. At vero eos et accusam et justo duo dolores et ea
                rebum. Stet clita kasd gubergren, no sea takimata sanctus est
                Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
                consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                invidunt ut labore et dolore magna aliquyam erat, sed diam
                voluptua. At vero eos et accusam et justo duo dolores et ea
                rebum. Stet clita kasd gubergren, no sea takimata sanctus est
                Lorem ipsum dolor sit amet.
              </p>
            </div>
          </main>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Docs;
