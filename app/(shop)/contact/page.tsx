"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    // Giả lập gửi backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setMessage(
      "Cảm ơn bạn đã liên hệ với Neswear. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.",
    );

    setName("");
    setEmail("");
    setContent("");
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 grid gap-10 md:grid-cols-2">
      <section className="space-y-6 rounded-xl border border-gray-600 p-8 shadow-sm">
        <h2 className="text-2xl font-semibold">Thông tin liên hệ</h2>

        <div>
          <p className="font-medium">Địa chỉ</p>
          <p className="text-gray-600">
            Tầng 12, Tòa nhà Chọc Trời, Quận 12,
            <br />
            Thành phố Hồ Chí Minh, Việt Nam
          </p>
        </div>

        <div>
          <p className="font-medium">Điện thoại</p>
          <p className="text-gray-600">0912 345 678</p>
        </div>

        <div>
          <p className="font-medium">Email</p>
          <p className="text-gray-600">cskh@neswear.example</p>
        </div>

        <div>
          <p className="font-medium">Thời gian làm việc</p>
          <p className="text-gray-600">
            Thứ Hai - Thứ Bảy
            <br />
            09:00 - 18:00
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-gray-600 p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold">Gửi tin nhắn</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">
              Họ và tên <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-600 px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Email <span className="text-red-500">*</span>
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-600 px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Nội dung <span className="text-red-500">*</span>
            </label>

            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none rounded-lg border border-gray-600 px-4 py-2 outline-none"
            />
          </div>

          {message && (
            <div className="rounded-lg bg-green-50 p-3 text-green-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Đang gửi..." : "Gửi liên hệ"}
          </button>
        </form>
      </section>
    </main>
  );
}
