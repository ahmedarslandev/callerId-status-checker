import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Transaction } from "@/models/transaction.model";
import { useRouter } from "next/navigation";

interface InfoCardProps {
  title: string;
  value: number | string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => (
  <div className="bg-card p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="text-sm text-muted-foreground">{title}</div>
    <div className="text-2xl md:text-3xl font-bold">{value}</div>
  </div>
);

interface TransactionsTableProps {
  transactions: Transaction[];
  currency: string;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  currency,
}) => {
  const router = useRouter();

  const handleRowClick = (transactionId: string) => {
    router.push(`/transaction/view?transactionId=${transactionId}`);
  };

  const renderTransactionRows = () => {
    if (transactions.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center">
            You have no transactions yet.
          </TableCell>
        </TableRow>
      );
    }

    return transactions.map((transaction) => (
      <TableRow
        key={String(transaction._id)}
        className="hover:bg-muted transition-colors cursor-pointer"
        onClick={() => handleRowClick(String(transaction._id))}
      >
        <TableCell>
          {new Date(transaction.timeStamp).toISOString().split("T")[0]}
        </TableCell>
        <TableCell>
          {new Date(transaction.timeStamp)
            .toISOString()
            .split("T")[1]
            .slice(0, 8)}
        </TableCell>
        <TableCell>
          {transaction.amount}{" "}
          <span className="text-xs font-bold">{currency}</span>
        </TableCell>
        <TableCell>{transaction.type}</TableCell>
        <TableCell className="text-xs text-zinc-700">{!transaction.comment ? "No comment" : transaction.comment}</TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="bg-card p-4 md:p-8 rounded-lg shadow-md mt-8 overflow-x-auto">
      <div className="mb-4 md:mb-6 text-lg md:text-xl font-medium">
        Transactions
      </div>
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/12">Date</TableHead>
            <TableHead className="w-2/12">Time</TableHead>
            <TableHead className="w-2/12">Amount</TableHead>
            <TableHead className="w-2/12">Type</TableHead>
            <TableHead>Comment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderTransactionRows()}</TableBody>
      </Table>
    </div>
  );
};
