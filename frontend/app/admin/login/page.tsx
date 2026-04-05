"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({
        loginAccount: account,
        loginVerifyCode: password,
        loginType: "account",
      });
      router.replace("/admin/articles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <div className="card card-border w-full max-w-sm border-base-300 bg-base-100 shadow-xl">
        <div className="card-body gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-base-content">管理员登录</h1>
            <p className="mt-2 text-sm text-base-content/60">请输入账号和密码进入后台</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm">账号</legend>
              <input
                id="account"
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="请输入账号"
                required
                className="input input-bordered w-full border-base-300 bg-base-100"
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm">密码</legend>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                className="input input-bordered w-full border-base-300 bg-base-100"
              />
            </fieldset>

            {error && (
              <div role="alert" className="alert alert-error text-sm">
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary w-full gap-2">
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  登录
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
