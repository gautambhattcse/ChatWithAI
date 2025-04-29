"use client";
import React, { useEffect, useState } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import AuthProvider from "./AuthProvider";

function Provider({ children }) {
  const [convex, setConvex] = useState(null);

  useEffect(() => {
    setConvex(new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL));
  }, []);

  if (!convex) return null; // Avoid hydration mismatch

  return (
    <ConvexProvider client={convex}>
      <AuthProvider>{children}</AuthProvider>
    </ConvexProvider>
  );
}

export default Provider;
