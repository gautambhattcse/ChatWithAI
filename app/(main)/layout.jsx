import React from "react";
import MainHeader from "./_components/MainHeader";

function Dashboardlayout({ children }) {
  return (
    <div>
      <MainHeader />
      <div className="p-10 mt-14 md:px-20 lg:px-32 xl:px-56 2xl:px-72">{children}</div>
    </div>
  );
}

export default Dashboardlayout;
