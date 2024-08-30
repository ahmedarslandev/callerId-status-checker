import * as React from "react";

interface EmailTemplateProps {
  user: {
    username: string;
    profileImage: string;
    walletId: {
      _id: string;
    };
  };
  transaction: {
    amount: string;
    type: string;
    status: string;
    accountHolderName: string;
    timeStamp: number;
    bankAccount: string;
    bank: string;
    transactionId?: string; // Optional: Present if type is 'deposit'
    bankName?: string; // Optional: Present if type is 'deposit'
  };
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  user,
  transaction,
}) => {
  console.log(user.walletId);
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        color: "#333",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={user.profileImage}
              alt="User Avatar"
              style={{
                borderRadius: "50%",
                width: "40px",
                height: "40px",
              }}
            />
            <div
              style={{ fontSize: "18px", fontWeight: "bold", color: "green" }}
            >
              {user.username}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "green" }}
            >
              {transaction.amount}{" "}
              <span
                style={{ fontSize: "10px", fontWeight: "bold", color: "green" }}
              >
                USD
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>Requested</div>
          </div>
        </div>
        <hr style={{ margin: "20px 0", borderColor: "#ddd" }} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <div
              style={{ fontSize: "12px", fontWeight: "bold", color: "green" }}
            >
              Transaction Type
            </div>
            <div style={{ fontSize: "16px" }}>{transaction.type}</div>
          </div>
          {transaction.type != "deposit" && (
            <div>
              <div
                style={{ fontSize: "12px", fontWeight: "bold", color: "green" }}
              >
                Status
              </div>
              <div style={{ fontSize: "16px", color: "red" }}>
                {transaction.status}
              </div>
            </div>
          )}
          {transaction.type != "deposit" && (
            <div>
              <div
                style={{ fontSize: "12px", fontWeight: "bold", color: "green" }}
              >
                Recipient
              </div>
              <div style={{ fontSize: "16px" }}>
                {transaction.accountHolderName}
              </div>
            </div>
          )}
          <div>
            <div
              style={{ fontSize: "12px", fontWeight: "bold", color: "green" }}
            >
              Date
            </div>
            <div style={{ fontSize: "16px" }}>
              {new Date(transaction.timeStamp).toLocaleDateString()}
            </div>
          </div>
          <div>
            {transaction.type != "deposit" && (
              <div
                style={{ fontSize: "12px", fontWeight: "bold", color: "green" }}
              >
                Bank Account
              </div>
            )}
            <div style={{ fontSize: "16px" }}>{transaction.bankAccount}</div>
          </div>
          <div>
            <div
              style={{ fontSize: "12px", fontWeight: "bold", color: "green" }}
            >
              Bank Type
            </div>
            <div style={{ fontSize: "16px" }}>{transaction.bank}</div>
          </div>

          {/* Conditionally render these fields if the transaction type is 'deposit' */}
          {transaction.type == "deposit" && (
            <>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  Transaction ID
                </div>
                <div style={{ fontSize: "16px" }}>
                  {transaction.transactionId || "N/A"}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  Wallet ID
                </div>
                <div style={{ fontSize: "16px" }}>
                  {JSON.parse(JSON.stringify(user?.walletId?._id)) || "N/A"}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  Bank Name
                </div>
                <div style={{ fontSize: "16px" }}>
                  {transaction.bank || "N/A"}
                </div>
              </div>
            </>
          )}
        </div>
        <hr style={{ margin: "20px 0", borderColor: "#ddd" }} />
        <div style={{ fontSize: "12px", color: "#999" }}>
          This transaction was initiated from your account.
        </div>
      </div>
    </div>
  );
};
