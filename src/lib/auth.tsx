import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

type Role = "admin" | "user" | null;

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  role: Role;
  loading: boolean;
  signInWithOtp: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session: s },
      } = await supabase.auth.getSession();
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (error || !data) {
        // If profile doesn't exist yet, create with default role 'user'
        const { error: upsertErr } = await supabase
          .from("profiles")
          .upsert({ id: user.id, role: "user" }, { onConflict: "id" });
        if (upsertErr) {
          // eslint-disable-next-line no-console
          console.warn("Failed to upsert profile", upsertErr.message);
          setRole(null);
          return;
        }
        setRole("user");
        return;
      }
      setRole((data as { role: Role }).role);
    };
    fetchRole();
  }, [user]);

  const signInWithOtp = useMemo(
    () => async (email: string) => {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
    },
    []
  );

  const signOut = useMemo(
    () => async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    []
  );

  const value: AuthContextValue = {
    session,
    user,
    role,
    loading,
    signInWithOtp,
    signOut,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
