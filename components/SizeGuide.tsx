import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SIZE_GUIDES = {
  shirt: {
    title: "BẢNG SIZE ÁO",
    sizes: [
      ["S", "160-166", "56-62"],
      ["M", "167-172", "63-68"],
      ["L", "173-178", "69-74"],
      ["XL", "179-184", "75-80"],
    ],
  },

  jacket: {
    title: "BẢNG SIZE ÁO KHOÁC",
    sizes: [
      ["S", "160-166", "55-62"],
      ["M", "167-172", "63-70"],
      ["L", "173-178", "71-78"],
      ["XL", "179-184", "79-86"],
    ],
  },

  pants: {
    title: "BẢNG SIZE QUẦN",
    sizes: [
      ["S", "160-166", "50-58"],
      ["M", "167-172", "59-67"],
      ["L", "173-178", "68-76"],
      ["XL", "179-184", "77-85"],
    ],
  },

  underwear: {
    title: "BẢNG SIZE ĐỒ LÓT",
    sizes: [
      ["S", "160-166", "50-58"],
      ["M", "167-172", "59-67"],
      ["L", "173-178", "68-76"],
      ["XL", "179-184", "77-85"],
    ],
  },
};

export default function SizeGuide({
  category,
}: {
  category: "shirt" | "pants" | "jacket" | "underwear" | "accessory";
}) {
  if (category === "accessory") {
    return <></>;
  }

  const guide = SIZE_GUIDES[category];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-sm underline text-gray-800 cursor-pointer">
          Hướng dẫn chọn kích thước
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">NESWEAR</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <h2 className="text-center text-2xl font-bold">{guide.title}</h2>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-center">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="p-3">SIZE</th>
                  <th className="p-3">CHIỀU CAO</th>
                  <th className="p-3">CÂN NẶNG</th>
                </tr>
              </thead>

              <tbody>
                {guide.sizes.map((row) => (
                  <tr key={row[0]}>
                    <td className="p-3 font-semibold">{row[0]}</td>
                    <td className="p-3">{row[1]} cm</td>
                    <td className="p-3">{row[2]} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
