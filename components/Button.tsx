import React from "react";
import { SearchButton, NoBgButton, HyperButton } from "./ui/buttons";

export default function Button({
  type,
  handler,
  className,
  children,
}: {
  type: string;
  handler: () => void;
  className?: string;
  children?: React.ReactNode;
}) {
  if (type == "search-button") {
    return <SearchButton onClick={handler} />;
  } else if (type == "no-bg") {
    return (
      <NoBgButton onClick={handler} className={className || ""}>
        {children || <></>}
      </NoBgButton>
    );
  } else if(type == "hyper"){
    return <HyperButton onClick={handler} className={className || ""}>
        {children || <></>}
    </HyperButton>
  }
}
