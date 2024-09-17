import axios from "axios";

export const fetchUserData = async () => {
  try {
    const response = await axios.get("/api/u/me"); // Changed to GET request
    return response.data.dbUser;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const fetchWalletData = async () => {
  try {
    const { data } = await axios.post("/api/u/wallet");
    const formattedWallet = {
      ...data.dbUser.walletId,
      lastUpdated: new Date(data.dbUser.walletId.lastUpdated).toLocaleString(),
      lastWithdraw: data.dbUser.walletId.lastWithdraw
        ? new Date(data.dbUser.walletId.lastWithdraw).toLocaleString()
        : "N/A",
      lastDeposited: data.dbUser.walletId.lastDeposited
        ? new Date(data.dbUser.walletId.lastDeposited).toLocaleString()
        : "N/A",
    };
    return {
      transactions: data.transactions.reverse(),
      wallet: formattedWallet,
    };
  } catch (error) {
    console.error("Failed to fetch wallet data:", error);
  }
};

export const fetchFiles = async (toast: any) => {
  try {
    const { data } = await axios.get("/api/u/file");
    if (!data.success) {
      toast({ title: "Error", description: data.message, duration: 5000 });
      return;
    }
    return data.files;
  } catch (error) {
    toast({
      title: "Error",
      description: "Something went wrong",
      duration: 5000,
    });
  }
};

export async function getUsers() {
  try {
    const { data } = await axios.get("/api/admin/user");

    if (data?.success == false) {
      return null;
    }
    return data.users;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUser(id: string) {
  try {
    const { data } = await axios.post(`/api/admin/user`, { userId: id });

    console.log(data);
    if (data?.success == false) {
      return null;
    }

    return data.user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getTransaction(transactionId: string) {
  const { data } = await axios.post("/api/admin/transactions", {
    transactionId,
  });

  if (data.success == false) {
    return null;
  }

  return data.transaction;
}
