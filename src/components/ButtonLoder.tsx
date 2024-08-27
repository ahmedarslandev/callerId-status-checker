import React from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const ButtonLoder = ({ name, variant = "default", isLoading, ...atr }: any) => {
  return isLoading ? (
    <Button>
      <Loader2 className="animate-spin" />
      <p className=" px-2">Loading ...</p>
    </Button>
  ) : (
    <Button {...atr} type="submit" variant={variant}>
      {name}
    </Button>
  );
};

export default ButtonLoder;
