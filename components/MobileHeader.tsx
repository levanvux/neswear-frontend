"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

import { FiMenu, FiUser } from "react-icons/fi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

import SearchSheet from "./SearchSheet";
import LogoutConfirmation from "./LogoutConfirmation";
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"],
});

export default function MobileHeader() {
  const { user } = useAuth();

  const [openUserActions, setOpenUserActions] = useState(false);

  const [openLogout, setOpenLogout] = useState(false);

  const [openMenu, setOpenMenu] = useState(false);

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
    <header className="tracking-wider block lg:hidden">
      <div className="flex justify-between bg-black text-white py-4 px-10 text-sm">
        MIỄN PHÍ GIAO HÀNG CHO ĐƠN TỪ 499K
      </div>

      <div className="relative flex justify-between px-4 py-5  bg-white shadow-md">
        <FiMenu
          className="text-xl cursor-pointer"
          onClick={() => setOpenMenu(true)}
        />

        <div>
          <Link
            href="/"
            className={`absolute left-1/2 top-4.25 -translate-x-1/2 tracking-widest ${montserrat.className} text-base`}
          >
            NESWEAR
          </Link>
        </div>

        <div className="flex gap-3 text-xl">
          <SearchSheet />

          <div ref={dropdownRef} className="relative">
            {!user ? (
              <FiUser
                className="hover:cursor-pointer"
                onClick={() => setOpenUserActions(!openUserActions)}
              />
            ) : (
              <Avatar
                size="sm"
                onClick={() => setOpenUserActions(!openUserActions)}
              >
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

      {openMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpenMenu(false)}
          />

          {/* Drawer */}
          <div className="fixed top-0 left-0 z-50 h-screen w-4/6 bg-white p-6">
            <ul className="space-y-6 font-semibold">
              <li>
                <Link
                  href="/collections/quan"
                  onClick={() => setOpenMenu(false)}
                >
                  GIỎ HÀNG
                </Link>
              </li>

              <li>
                <Link
                  href="/collections/ao-khoac"
                  onClick={() => setOpenMenu(false)}
                >
                  YÊU THÍCH
                </Link>
              </li>

              <hr />

              <li>
                <Link href="/" onClick={() => setOpenMenu(false)}>
                  TRANG CHỦ
                </Link>
              </li>

              <li>
                <Link
                  href="/products?category=shirt"
                  onClick={() => setOpenMenu(false)}
                >
                  ÁO
                </Link>
              </li>

              <li>
                <Link
                  href="/products?category=pants"
                  onClick={() => setOpenMenu(false)}
                >
                  QUẦN
                </Link>
              </li>

              <li>
                <Link
                  href="/products?category=jacket"
                  onClick={() => setOpenMenu(false)}
                >
                  ÁO KHOÁC
                </Link>
              </li>

              <li>
                <Link
                  href="/products?category=accessory"
                  onClick={() => setOpenMenu(false)}
                >
                  PHỤ KIỆN
                </Link>
              </li>

              <hr />

              <li>
                <Link href="/contact" onClick={() => setOpenMenu(false)}>
                  LIÊN HỆ
                </Link>
              </li>

              <li>
                <Link href="/about" onClick={() => setOpenMenu(false)}>
                  VỀ NESWEAR
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}
    </header>
  );
}
