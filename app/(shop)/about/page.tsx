import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Về Neswear</h1>

          <p className="text-lg leading-8 text-gray-800">
            Neswear là thương hiệu thời trang nam hiện đại, mang đến những sản
            phẩm kết hợp hài hòa giữa sự thoải mái, chất lượng và phong cách bền
            vững theo thời gian. Mỗi sản phẩm đều được tuyển chọn kỹ lưỡng để
            giúp khách hàng tự tin trong công việc, những buổi dạo phố hay các
            hoạt động thường ngày mà vẫn đảm bảo sự chỉn chu và chất lượng.
          </p>

          <p className="text-lg leading-8 text-gray-800">
            Chúng tôi tin rằng thời trang đẹp nên dễ dàng tiếp cận với mọi
            người. Vì vậy, Neswear luôn nỗ lực mang đến trải nghiệm mua sắm
            thuận tiện, dịch vụ chăm sóc khách hàng tận tâm cùng những sản phẩm
            được hoàn thiện tỉ mỉ, giúp mỗi khách hàng luôn tự tin với phong
            cách của mình.
          </p>

          <Link
            href="/contact"
            className="inline-block rounded-lg text-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Liên hệ với chúng tôi
          </Link>
        </div>

        <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-lg">
          <Image
            src="/shop.png"
            alt="Neswear"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </main>
  );
}
