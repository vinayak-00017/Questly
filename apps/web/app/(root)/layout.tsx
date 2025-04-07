import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <div>{children}</div>
    </main>
  );
};

export default Layout;
