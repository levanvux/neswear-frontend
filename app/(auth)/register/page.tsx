"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { Division } from "@/types/location";
import { getDistricts, getProvinces, getWards } from "@/services/location";
import LocationSelect from "@/components/LocationSelect";
import { register } from "@/services/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [street, setStreet] = useState("");

  const [provinces, setProvinces] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<Division[]>([]);
  const [wards, setWards] = useState<Division[]>([]);

  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getProvinces();
        setProvinces(data);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (!provinceName) return;

    async function loadDistricts() {
      const province = provinces.find((p) => p.name === provinceName);
      if (!province) {
        return;
      }

      const data = await getDistricts(province.code);
      setDistricts(data);
    }

    loadDistricts();
  }, [provinceName, provinces]);

  useEffect(() => {
    if (!districtName) return;

    async function loadWards() {
      const district = districts.find((d) => d.name === districtName);
      if (!district) {
        return;
      }

      const data = await getWards(district.code);
      setWards(data);
    }

    loadWards();
  }, [districtName, districts]);

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    e.preventDefault();

    const vietnamesePhoneNumber = /^0\d{9}$/;
    if (!vietnamesePhoneNumber.test(phone)) {
      toast.error("Vui lòng nhập số điện thoại VN hợp lệ.");
      return;
    }

    const goodPassword = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!goodPassword.test(password)) {
      toast.error(
        "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ, số và ký tự đặc biệt.",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    const hasPartialAddress = street || provinceName;
    const hasFullAddress = street && provinceName && districtName && wardName;
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
                city: provinceName,
                district: districtName,
                ward: wardName,
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

          <div>
            <label className="mb-2 block text-sm font-medium">
              Tên đường / Số nhà
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full rounded border px-3 py-2 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Tỉnh / Thành phố
            </label>

            <LocationSelect
              list={provinces}
              divisionName={provinceName}
              onChange={(name) => {
                setProvinceName(name);

                setDistrictName("");
                setDistricts([]);

                setWardName("");
                setWards([]);
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Quận / Huyện
            </label>

            <LocationSelect
              list={districts}
              divisionName={districtName}
              onChange={(name) => {
                setDistrictName(name);

                setWardName("");
                setWards([]);
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phường / Xã
            </label>

            <LocationSelect
              list={wards}
              divisionName={wardName}
              onChange={(name) => {
                setWardName(name);
              }}
            />
          </div>

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
