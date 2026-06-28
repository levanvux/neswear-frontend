import Link from "next/link";
import { FaGithub, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-4 flex flex-col gap-4">
          <h2 className="text-red-500 font-bold text-lg">
            Thời trang nam Neswear
          </h2>
          <p>
            Chúng tôi mang đến giải pháp thời trang nam hiện đại, nơi sự tối
            giản gặp gỡ phong cách và chất lượng.
          </p>
          <div className="flex flex-row gap-2">
            <a
              href="https://github.com/levanvux"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center 
                   border border-gray-300 rounded-md
                   text-gray-700 hover:text-red-500 hover:border-red-500 transition duration-300"
            >
              <FaGithub size={18} />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61588889745044"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center 
            border border-gray-300 rounded-md
            text-gray-700 hover:text-red-500 hover:border-red-500 transition duration-300"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/levanvux/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center 
                   border border-gray-300 rounded-md
                   text-gray-700 hover:text-red-500 hover:border-red-500 transition duration-300"
            >
              <FaLinkedinIn size={18} />
            </a>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <h2 className=" text-red-500 text-lg font-bold">Thông tin liên hệ</h2>
          <p>
            <strong>Địa chỉ:</strong> Tầng 12, Tòa nhà Chọc Trời, Quận 12, Thành
            phố Hồ Chí Minh, Việt Nam
          </p>
          <p>
            <strong>Điện thoại:</strong> 09123456709
          </p>
          <p>
            <strong>Email:</strong> cskh@neswear.example
          </p>
          <p>
            <strong>Thời gian làm việc:</strong> Thứ 2 đến thứ 7 (9:00 AM - 6:00
            PM)
          </p>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <h2 className="text-red-500 text-lg font-bold">Nhóm liên kết</h2>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                className="hover:text-red-500 transition duration-300"
                href="/about"
              >
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-red-500 transition duration-300"
                href="/chinh-sach-doi-tra"
              >
                Chính sách đổi trả
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-red-500 transition duration-300"
                href="/chinh-sach-bao-mat"
              >
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-red-500 transition duration-300"
                href="/tuyen-dung"
              >
                Tuyển dụng
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-red-500 transition duration-300"
                href="/contact"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mb-10">
        Copyright &copy; {new Date().getFullYear()} Neswear. All rights
        reserved.
      </p>
    </footer>
  );
}
