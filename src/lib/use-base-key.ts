"use client";

import { useEffect, useState } from "react";

export const useBaseKey = () => {
  const [baseKey, setBaseKey] = useState<"Ctrl" | "⌘" | null>(null);
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) {
      setBaseKey("⌘");
    } else {
      setBaseKey("Ctrl");
    }
  }, []);
  return { baseKey, setBaseKey };
};
