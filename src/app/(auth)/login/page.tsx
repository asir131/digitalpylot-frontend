"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { push } = useToast();
  const [email, setEmail] = useState("admin@rbac.local");
  const [password, setPassword] = useState("Admin123!");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      push({ title: "Welcome back", description: "Login successful", tone: "success" });
      router.push("/dashboard");
    } catch (error) {
      push({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Check your credentials",
        tone: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] px-6 py-12">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2 text-ink">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-citrus text-white font-bold">
            O
          </div>
          <span className="font-display text-lg">Obliq</span>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
        <Card className="self-center p-12">
          <h2 className="text-center font-display text-2xl text-ink">Login</h2>
          <p className="mt-2 text-center text-sm text-mist">Enter your details to continue</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs text-mist">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <div>
              <label className="text-xs text-mist">Password</label>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            </div>
            <div className="flex items-center justify-between text-xs text-mist">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-citrus" />
                Remember me
              </label>
              <button
                type="button"
                className="text-citrus"
                onClick={() => push({ title: "Reset password", description: "Contact your admin", tone: "info" })}
              >
                Forgot password?
              </button>
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>
          <div className="mt-4 rounded-xl border border-steel bg-cream p-3 text-xs text-mist">
            Super Admin: admin@rbac.local / Admin123!
          </div>
          <div className="mt-6 text-center text-xs text-mist">
            Don’t have an account?{" "}
            <button
              type="button"
              className="text-ink font-semibold"
              onClick={() => push({ title: "Request access", description: "Contact your admin", tone: "info" })}
            >
              Sign up
            </button>
          </div>
        </Card>
        <div className="panel hidden h-[640px] overflow-hidden lg:block slide-in-right">
          <img src="/img.png" alt="Login visual" className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
