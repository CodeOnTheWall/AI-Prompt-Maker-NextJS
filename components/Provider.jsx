"use client";

import { SessionProvider } from "next-auth/react";

// higher order component, meaning we will wrap other components with it
export default function Provider({ children, session }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
