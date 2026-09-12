"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { login, getMe } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { loading, user, setUser, setAccessToken } = useAuth();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [demoEmail, setDemoEmail] = useState("de@mo.com");
  const [demoPassword, setDemoPassword] = useState("welcome123@");

  const handleLogin = async (email: string, password: string) => {
    try {
      const { access_token } = await login({ email, password });

      setAccessToken(access_token);
      localStorage.setItem("access_token", access_token);

      const userData = await getMe(access_token);
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
  };

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    e.preventDefault();
    await handleLogin(email, password);
  };

  const handleDemoLogin = async (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    e.preventDefault();
    await handleLogin(demoEmail, demoPassword);
  };

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user, router]);

  //   return (
  //     <div className="divide-y space-y-5">
  //       <main className="px-2 py-10">
  //         <h1 className="text-xl font-bold mb-6">
  //           Đăng nhập bằng tài khoản của bạn
  //         </h1>

  //         <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
  //           <input
  //             type="email"
  //             placeholder="Email"
  //             className="border p-3 w-full"
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //             required
  //           />

  //           <input
  //             type="password"
  //             placeholder="Mật khẩu"
  //             className="border p-3 w-full"
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             required
  //           />

  //           <button
  //             type="submit"
  //             className="rounded bg-black text-white px-4 py-2 hover:bg-gray-700 hover:cursor-pointer"
  //           >
  //             ĐĂNG NHẬP
  //           </button>

  //           <p className="mt-1 text-gray-600">
  //             Bạn chưa có tài khoản?
  //             <Link
  //               href="/register"
  //               className="font-medium text-black underline hover:text-gray-700"
  //             >
  //               Đăng ký ngay
  //             </Link>
  //           </p>
  //         </form>
  //       </main>

  //       <section className="px-2">
  //         <h1 className="text-xl font-bold mb-6">
  //           Hoặc sử dụng tài khoản thử nghiệm
  //         </h1>

  //         <form onSubmit={handleDemoLogin} className="space-y-5 max-w-md">
  //           <input
  //             type="email"
  //             placeholder="Email"
  //             className="border p-3 w-full"
  //             value={demoEmail}
  //             onChange={(e) => setDemoEmail(e.target.value)}
  //             required
  //           />

  //           <input
  //             type="password"
  //             placeholder="Mật khẩu"
  //             className="border p-3 w-full"
  //             value={demoPassword}
  //             onChange={(e) => setDemoPassword(e.target.value)}
  //             required
  //           />

  //           <button
  //             type="submit"
  //             className="rounded bg-black text-white px-4 py-2 hover:bg-gray-700 hover:cursor-pointer"
  //           >
  //             ĐĂNG NHẬP
  //           </button>
  //         </form>
  //       </section>
  //     </div>
  //   );
  // }
  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-5xl">
        {/* Forms */}
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {/* Login */}
          <section className="rounded-xl border bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold sm:text-xl">Đăng nhập</h2>
              <p className="mt-1 text-sm text-gray-500">
                Sử dụng tài khoản Neswear của bạn
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Mật khẩu
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Đăng nhập
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-gray-500">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="cursor-pointer font-medium text-black underline underline-offset-2 hover:text-gray-600"
              >
                Đăng ký ngay
              </Link>
            </p>
          </section>
          {/* Demo */}
          <section className="rounded-xl border bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold sm:text-xl">
                Tài khoản thử nghiệm
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Dùng tài khoản demo để trải nghiệm nhanh website
              </p>
            </div>
            <form onSubmit={handleDemoLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="demo-email"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="demo-email"
                  type="email"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="demo-password"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Mật khẩu
                </label>
                <input
                  id="demo-password"
                  type="password"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  value={demoPassword}
                  onChange={(e) => setDemoPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer w-full rounded-lg border border-black bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-gray-100"
              >
                Đăng nhập tài khoản demo
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
