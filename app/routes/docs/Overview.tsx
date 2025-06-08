import { useOutlet } from "react-router";

import Footer from "~/lib/core/components/Footer";
import Header from "~/lib/core/components/Header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/lib/core/docs/components/Breadcrumb";
import Navigation from "~/lib/core/docs/components/Navigation";

const Docs = () => {
  const outlet = useOutlet();

  return (
    <>
      <Header />
      <div className="flex gap-8 px-12 pt-4">
        <div className="hidden lg:flex">
          <Navigation />
        </div>
        {outlet || (
          <main className="w-full">
            <Breadcrumb className="mt-[10px] mb-8">
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
                Welcome to the documentation for our educational game about
                computer animation! This project is designed to help you explore
                and understand key concepts in animation, game logic, and
                interactive systems through hands-on experimentation.
              </p>
              <p>
                In this game, you use a visual node editor to build logic,
                control game objects, and solve creative puzzles. Each level
                introduces new mechanics and concepts, from basic value
                manipulation to more advanced topics such as conditional logic,
                movement, and more.
              </p>
              <p>
                This documentation provides detailed explanations of all
                available nodes as well as background information on animation
                systems.
              </p>
              <p>
                Whether you are a student, educator, or enthusiast, this
                platform encourages experimentation and learning by doing. We
                invite you to join our community to ask questions, give
                feedback, or share your experiences with others.
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
