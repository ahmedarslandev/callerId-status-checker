import React from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const ButtonLoder = ({ name, variant = "default", isLoading }: any) => {
  console.log(isLoading);
  return isLoading ? (
    <Button>
      <Loader2 className="animate-spin" />
      <p className=" px-2">Loading ...</p>
    </Button>
  ) : (
    <Button type="submit" variant={variant}>
      {name}
    </Button>
  );
};

export default ButtonLoder;
