import UserPage from "@/components/admin/eachUserTable";
import React from "react";

const page = ({ params }: { params: { userId: string } }) => {
  return <UserPage params={{ id: params.userId }} />;
};

export default page;
