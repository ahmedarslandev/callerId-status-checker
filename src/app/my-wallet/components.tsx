import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Transaction } from "@/models/transaction.model";

export const InfoCard = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => (
  <div className="bg-card p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="text-sm text-muted-foreground">{title}</div>
    <div className="text-2xl md:text-3xl font-bold">{value}</div>
  </div>
);

export const TransactionsTable = ({
  transactions,
  currency,
}: {
  transactions: Transaction[];
  currency: string;
}) => (
  <div className="bg-card p-4 md:p-8 rounded-lg shadow-md mt-8 overflow-x-auto">
    <div className="mb-4 md:mb-6 text-lg md:text-xl font-medium">
      Transactions
    </div>
    <Table className="min-w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Bank Account</TableHead>
          <TableHead>Bank Name</TableHead>
          <TableHead>Account Holder Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length > 0 ? (
          transactions.map((transaction, i) => (
            <TableRow key={i}>
              <TableCell>
                {new Date(transaction.timeStamp).toISOString().split("T")[0]}
              </TableCell>
              <TableCell>
                {transaction.amount}{" "}
                <span className="text-[8px] font-bold">{currency}</span>
              </TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.status}</TableCell>
              <TableCell>{transaction.bankAccount}</TableCell>
              <TableCell>{transaction.bank}</TableCell>
              <TableCell>{transaction.accountHolderName}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              You have no transactions yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);
