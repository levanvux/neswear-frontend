"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BackButton({
  children = "← Quay lại",
  href,
}: {
  children?: React.ReactNode;
  href?: string;
}) {
  const router = useRouter();

  return (
    <Link
      href={href ?? "#"}
      onClick={(e) => {
        if (!href) {
          e.preventDefault();
          router.back();
        }
      }}
      className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer hover:underline"
    >
      {children}
    </Link>
  );
}
