"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const router = useRouter();

  const { user, loading, handleLogout } = useAuth();

  if (loading) {
    return (
      <main className="flex justify-center py-20">
        <p className="text-gray-600">Đang tải thông tin...</p>
      </main>
    );
  }

  if (!user) {
    router.push("/login?redirect=/profile");
    return null;
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-xl border shadow-sm">
        <div className="flex flex-col items-center border-b p-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatarUrl} alt="Avatar" />
            <AvatarFallback>
              {`${user.firstName[0]}${user.lastName[0]}`}
            </AvatarFallback>
          </Avatar>

          <h1 className="mt-4 text-2xl font-semibold">
            {user.firstName} {user.lastName}
          </h1>

          <p className="text-gray-500 uppercase">{user.role}</p>
        </div>

        <div className="space-y-6 p-8">
          <section>
            <h2 className="mb-4 text-lg font-semibold">Thông tin cá nhân</h2>

            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Họ và tên</span>
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Email</span>
                <span>{user.email}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Số điện thoại</span>
                <span>{user.phoneNumber}</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">Địa chỉ</h2>

            {user.addresses.length === 0 ? (
              <p className="text-gray-500">Bạn chưa có địa chỉ nào.</p>
            ) : (
              <div className="space-y-3">
                {user.addresses.map((address, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-4 text-gray-700"
                  >
                    {address.street}, {address.ward}, {address.district},{" "}
                    {address.city}
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex flex-col md:flex-row justify-end gap-3 border-t pt-6">
            <button
              onClick={() => toast("Chức năng sẽ được cập nhật sau.")}
              className="rounded-lg bg-blue-500 text-white px-5 py-2 transition hover:bg-blue-600"
            >
              Chỉnh sửa
            </button>

            <button
              onClick={() => toast("Chức năng sẽ được cập nhật sau.")}
              className="rounded-lg bg-blue-500 text-white px-5 py-2 transition hover:bg-blue-600"
            >
              Đổi mật khẩu
            </button>

            <button
              onClick={async () => {
                if (!confirm("Bạn có chắc chắn muốn đăng xuất?")) return;

                await handleLogout();
                toast.success("Đã đăng xuất");
              }}
              className="rounded-lg bg-red-600 px-5 py-2 text-white transition hover:bg-red-700"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
