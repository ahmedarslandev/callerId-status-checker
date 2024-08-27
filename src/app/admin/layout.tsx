import Sidebar from "@/components/admin/SideBar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" flex w-full h-screen">
      <div className="h-full w-1/5">
        <Sidebar />
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default layout;
