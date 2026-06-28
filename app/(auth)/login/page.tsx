"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { login, getMe } from "@/services/auth";

export default function LoginPage() {
  const { setUser } = useAuth();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    e.preventDefault();

    try {
      const loginData = await login({ email, password });

      localStorage.setItem("access_token", loginData.access_token);

      const userData = await getMe(loginData.access_token);

      setUser(userData);

      toast.success("Đăng nhập thành công");
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Không thể kết nối đến server");
      }
    }
  }

  return (
    <main className="px-2 py-32">
      <h1 className="text-3xl font-bold mb-6">ĐĂNG NHẬP</h1>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          className="border p-3 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 hover:bg-gray-700 hover:cursor-pointer"
        >
          ĐĂNG NHẬP
        </button>

        <p className="mt-6 text-gray-600">
          Bạn chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="font-medium text-black underline hover:text-gray-700"
          >
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </main>
  );
}
