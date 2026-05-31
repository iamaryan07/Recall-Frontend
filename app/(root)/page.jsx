"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import LoginButton from "@/components/auth/LoginButton";
import AuthLoading from "@/components/auth/AuthLoading";

import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function debug() {
      const { data } = await supabase.auth.getSession();
      console.log("SESSION =", data.session);

      const { data: userData } = await supabase.auth.getUser();
      console.log("USER =", userData.user);
    }

    debug();
  }, []);

  async function getUser() {
    const { data } = await supabase.auth.getUser();

    setUser(data.user);
    setLoading(false);
  }

  useEffect(() => {
    getUser();

    if (window.location.hash) {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }

    const authListener = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      router.replace("/chat");
    }
  }, [user, router]);

  if (loading) {
    return <AuthLoading />;
  }

  if (!user) {
    return <LoginButton />;
  }

  return <AuthLoading />;
}