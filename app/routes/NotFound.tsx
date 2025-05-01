import React from "react";
import Header from "~/lib/core/components/Header";

const NotFound: React.FC = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex h-full flex-col items-center bg-slate-800 text-white">
        <div className= "pt-[5%] w-[65%]">
          <h1 className="text-4xl">:(</h1>
          <p>Oops. Something should be here.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;