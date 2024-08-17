import * as React from "react";

interface EmailTemplateProps {
  username: string;
  OTP: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  username,
  OTP,
}: any) => (
  <div>
    <h1>Welcome, {username}!</h1>
    <h1>Your OTP code here : {OTP}</h1>
  </div>
);
