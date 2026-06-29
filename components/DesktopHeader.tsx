"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

import { FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

import SearchSheet from "./SearchSheet";
import LogoutConfirmation from "./LogoutConfirmation";
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"],
});

export default function DesktopHeader() {
  const { user } = useAuth();

  const [openUserActions, setOpenUserActions] = useState(false);

  const [openLogout, setOpenLogout] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenUserActions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="tracking-wider hidden lg:block">
      <div className="flex justify-between bg-black text-white py-4 px-10 text-sm">
        <div>
          <p>MIỄN PHÍ GIAO HÀNG CHO ĐƠN TỪ 499K</p>
        </div>

        <div className="flex divide-x divide-gray-500">
          <Link href="/contact" className="px-4">
            LIÊN HỆ
          </Link>
          <Link href="/about" className="px-4">
            VỀ NESWEAR
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center pl-10 pr-14 py-6 bg-white shadow-md">
        <div>
          <Link
            href="/"
            className={`tracking-widest ${montserrat.className} text-2xl`}
          >
            NESWEAR
          </Link>
        </div>

        <nav>
          <ul className="font-semibold flex gap-10">
            <li>
              <Link href="/" className="hover:underline">
                TRANG CHỦ
              </Link>
            </li>
            <li>
              <Link href="/products?category=shirt" className="hover:underline">
                ÁO
              </Link>
            </li>
            <li>
              <Link href="/products?category=pants" className="hover:underline">
                QUẦN
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=jacket"
                className="hover:underline"
              >
                ÁO KHOÁC
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=accessory"
                className="hover:underline"
              >
                PHỤ KIỆN
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex gap-7 text-2xl items-center">
          <SearchSheet />

          <FiHeart className="hover:cursor-pointer" />

          <FiShoppingBag className="hover:cursor-pointer" />

          <div ref={dropdownRef} className="relative">
            {!user ? (
              <FiUser
                className="hover:cursor-pointer"
                onClick={() => setOpenUserActions(!openUserActions)}
              />
            ) : (
              <Avatar onClick={() => setOpenUserActions(!openUserActions)}>
                <AvatarImage src={user.avatarUrl} alt="Avatar" />
                <AvatarFallback>
                  {`${user.firstName[0]}${user.lastName[0]}`}
                </AvatarFallback>
              </Avatar>
            )}

            {openUserActions && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border bg-white shadow-lg z-50 text-xl">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => {
                        setOpenUserActions(false);
                      }}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Đăng nhập
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => {
                        setOpenUserActions(false);
                      }}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Đăng ký
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => {
                        setOpenUserActions(false);
                      }}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Hồ sơ
                    </Link>
                    <button
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setOpenUserActions(false);
                        setOpenLogout(true);
                      }}
                    >
                      Đăng xuất
                    </button>
                  </>
                )}
              </div>
            )}

            <LogoutConfirmation
              open={openLogout}
              onOpenChange={setOpenLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
