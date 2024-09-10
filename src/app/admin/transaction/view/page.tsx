import TransactionPage from "@/components/transaction-view";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <TransactionPage />
    </Suspense>
  );
};

export default page;
