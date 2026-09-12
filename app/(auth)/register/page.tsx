"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";
import { register } from "@/services/auth";
import AddressForm from "@/components/AddressForm";

export default function RegisterPage() {
  const router = useRouter();

  const { loading, user } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [address, setAddress] = useState({
    street: "",
    city: "",
    ward: "",
  });

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    e.preventDefault();

    const vietnamesePhoneNumber = /^0\d{9}$/;
    if (!vietnamesePhoneNumber.test(phone)) {
      toast.error("Vui lòng nhập số điện thoại VN hợp lệ.");
      return;
    }

    if (password.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    const goodPassword = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!goodPassword.test(password)) {
      toast.error("Mật khẩu phải bao gồm chữ, số và ký tự đặc biệt.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    const { street, city, ward } = address;
    const hasPartialAddress = street || city;
    const hasFullAddress = street && city && ward;

    if (hasPartialAddress && !hasFullAddress) {
      toast.error("Vui lòng nhập đầy đủ địa chỉ");
      return;
    }

    const formData = {
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      password,
      confirmPassword,
      ...(hasFullAddress
        ? {
            addresses: [
              {
                street,
                city,
                ward,
                isDefault: true,
              },
            ],
          }
        : {}),
    };

    try {
      await register(formData);

      toast.success("Đăng ký thành công!");
      router.push("/login");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Không thể kết nối đến server");
      }
    }
  };

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user, router]);

  return (
    <main className="px-2 py-16">
      <div className="max-w-xl">
        <h1 className="mb-8 text-3xl font-bold">ĐĂNG KÝ TÀI KHOẢN</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded border px-3 py-2 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Họ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded border px-3 py-2 outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border px-3 py-2 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded border px-3 py-2 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Nhập lại mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded border px-3 py-2 outline-none focus:border-black"
            />
          </div>

          <hr className="my-6" />

          <h2 className="text-lg font-semibold">Địa chỉ (không bắt buộc)</h2>

          <AddressForm setAddress={setAddress} />

          <button
            type="submit"
            className="w-full rounded bg-black py-3 font-medium text-white transition hover:cursor-pointer hover:bg-neutral-800"
          >
            ĐĂNG KÝ
          </button>

          <p className="text-center text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-medium text-black underline hover:text-gray-700"
            >
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
