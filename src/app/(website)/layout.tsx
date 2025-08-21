import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  // We've removed the container and px-0 classes to allow the content to be full-width.
  return <div className="flex flex-col w-full">{children}</div>;
};

export default Layout;
