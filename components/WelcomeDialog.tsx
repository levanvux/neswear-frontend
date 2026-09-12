"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function WelcomeDialog() {
  const [seenWelcomeDialog, setSeenWelcomeDialog] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeenWelcomeDialog(
      sessionStorage.getItem("seen-welcome-dialog") === "true",
    );
  }, []);

  return (
    <Dialog
      open={!seenWelcomeDialog}
      onOpenChange={(open) => {
        if (!open) {
          setSeenWelcomeDialog(true);
          sessionStorage.setItem("seen-welcome-dialog", "true");
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chào mừng đến với Neswear!</DialogTitle>
          <DialogDescription className="mt-4 leading-relaxed">
            Đây là website mô phỏng một cửa hàng thời trang nam, được xây dựng
            nhằm mục đích học tập và thử nghiệm. Các thông tin và giao dịch trên
            website đều là dữ liệu giả lập.
            <br />
            <br />
            Vui lòng không cung cấp bất kỳ thông tin cá nhân nào khi sử dụng
            website.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setSeenWelcomeDialog(true);
                sessionStorage.setItem("seen-welcome-dialog", "true");
              }}
            >
              Tiếp tục trải nghiệm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
