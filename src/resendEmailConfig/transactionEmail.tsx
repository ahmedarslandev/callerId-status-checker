import * as React from "react";

interface EmailTemplateProps {
  user: {
    username: string;
    profileImage: string;
  };
  transaction: {
    amount: string;
    type: string;
    status: string;
    accountHolderName: string;
    timeStamp: number;
    bankAccount: string;
    bank: string;
  };
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  user,
  transaction,
}) => (
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
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
            {user.username}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>
            {transaction.amount}{" "}
            <span style={{ fontSize: "10px", fontWeight: "bold" }}>USD</span>
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
          <div style={{ fontSize: "12px", fontWeight: "bold" }}>
            Transaction Type
          </div>
          <div style={{ fontSize: "16px" }}>{transaction.type}</div>
        </div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: "bold" }}>Status</div>
          <div style={{ fontSize: "16px", color: "#28a745" }}>
            {transaction.status}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: "bold" }}>Recipient</div>
          <div style={{ fontSize: "16px" }}>
            {transaction.accountHolderName}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: "bold" }}>Date</div>
          <div style={{ fontSize: "16px" }}>
            {new Date(transaction.timeStamp).toLocaleDateString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: "bold" }}>
            Bank Account
          </div>
          <div style={{ fontSize: "16px" }}>{transaction.bankAccount}</div>
        </div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: "bold" }}>Bank Type</div>
          <div style={{ fontSize: "16px" }}>{transaction.bank}</div>
        </div>
      </div>
      <hr style={{ margin: "20px 0", borderColor: "#ddd" }} />
      <div style={{ fontSize: "12px", color: "#999" }}>
        This transaction was initiated from your account.
      </div>
    </div>
  </div>
);
