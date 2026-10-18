// A custom hook is a JavaScript function whose name
// starts with "use" and that can use React hooks.

// Why do we create custom hooks?
// The purpose is to keep reusable stateful logic
// in one place so multiple components can reuse it.

// A custom hook can return state, functions,
// or any other values that a component needs

"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
}
