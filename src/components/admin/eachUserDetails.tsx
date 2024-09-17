"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit2, Save, Eye } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/models/user.model";
import { Wallet } from "@/models/wallet.model";
import axios from "axios";
import { toast } from "../ui";

interface Transaction {
  _id: string;
  wallet_id: string;
  amount: string;
  type: string;
  status: string;
  from: string;
  to: string;
  timeStamp: Date;
  bankAccount: string;
  accountHolderName: string;
  bank: string;
  BBT: number;
  BAT: number;
}

interface UserDetailsProps {
  user: Omit<User, "walletId"> & { walletId: Wallet };
}

export function UserDetails({ user: initialUser }: UserDetailsProps | any) {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(
    initialUser?.walletId?.transactions
  );

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser: any) => ({ ...prevUser, [name]: value }));
  };

  const handleSwitchChange = (name: string) => {
    setUser((prevUser: any) => ({
      ...prevUser,
      [name]: !prevUser[name as keyof User],
    }));
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.put("/api/admin/user", {
        updatedUser: user,
      });
      console.log(data);
      if (data?.success === false) {
        toast({
          title: "Error",
          description: data.message,
          duration: 5000,
        });
        return;
      }
      toggleEdit();
      toast({
        title: "Success",
        description: "User updated successfully",
        duration: 5000,
      });
    } catch (error) {}
  };

  const handleTransactionStatusChange = (
    transactionId: string,
    newStatus: string
  ) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction._id === transactionId
          ? { ...transaction, status: newStatus }
          : transaction
      )
    );
    // In a real application, you would send this update to your API
    console.log(`Updated transaction ${transactionId} status to ${newStatus}`);
  };

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Link
            href="/admin/users"
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
          {isEditing ? (
            <Button onClick={handleSave} variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          ) : (
            <Button onClick={toggleEdit} variant="outline" size="sm">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <img
            src={user.profileImage || "/placeholder.svg?height=200&width=200"}
            alt={`${user.username}'s avatar`}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <CardTitle>{user.username}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={user.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    name="role"
                    value={user.role}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="walletId">Wallet ID</Label>
                  <Input
                    id="walletId"
                    name="walletId"
                    value={user.walletId._id.toString()}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Created At</Label>
                  <p className="text-sm text-zinc-500">
                    {new Date(user.createdAt).toDateString()}
                  </p>
                </div>
                <div>
                  <Label>Updated At</Label>
                  <p className="text-sm text-zinc-500">
                    {new Date(user.updatedAt).toDateString()}
                  </p>
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={user.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="security">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="verified"
                  checked={user.isVerified}
                  onCheckedChange={() => handleSwitchChange("isVerified")}
                  disabled={!isEditing}
                />
                <Label htmlFor="verified">Verified</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="admin"
                  checked={user.role == "admin" ? true : false}
                  onCheckedChange={() => handleSwitchChange("isAdmin")}
                  disabled={!isEditing}
                />
                <Label htmlFor="admin">Admin</Label>
              </div>
              <div>
                <Label htmlFor="verifyCode">Verify Code</Label>
                <Input
                  id="verifyCode"
                  name="verifyCode"
                  value={user.verifyCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="verifyCodeExpiry">Verify Code Expiry</Label>
                <Input
                  id="verifyCodeExpiry"
                  name="verifyCodeExpiry"
                  value={user.verifyCodeExpiry}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="verifyCodeLimit">Verify Code Limit</Label>
                <Input
                  id="verifyCodeLimit"
                  name="verifyCodeLimit"
                  type="number"
                  value={user.verifyCodeLimit}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="social">
            <div className="space-y-4">
              <div>
                <Label htmlFor="googleId">Google ID</Label>
                <Input
                  id="googleId"
                  name="googleId"
                  value={user.googleId}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="githubId">GitHub ID</Label>
                <Input
                  id="githubId"
                  name="githubId"
                  value={user.githubId}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="twitterId">Twitter ID</Label>
                <Input
                  id="twitterId"
                  name="twitterId"
                  value={user.twitterId}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="facebookId">Facebook ID</Label>
                <Input
                  id="facebookId"
                  name="facebookId"
                  value={user.facebookId}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="transactions">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>
                          {/* Conditionally enable/disable the Select based on isEditing */}
                          <Select
                            value={transaction.status}
                            onValueChange={(value) =>
                              handleTransactionStatusChange(
                                transaction._id,
                                value
                              )
                            }
                            disabled={!isEditing} // Disable when not editing
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.timeStamp).toDateString()}
                        </TableCell>
                        <TableCell>{transaction.bank}</TableCell>
                        <TableCell>
                          <Link
                            href={`/admin/users/${user._id}/transactions/${transaction._id}`}
                          >
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="flex items-center space-x-2">
          <Label>Logged in with credentials:</Label>
          <Switch
            checked={user.isLoggedInWithCredentials}
            onCheckedChange={() =>
              handleSwitchChange("isLoggedInWithCredentials")
            }
            disabled={!isEditing}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
