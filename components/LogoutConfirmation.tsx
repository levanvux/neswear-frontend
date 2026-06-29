import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  //   AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";

export default function LogoutConfirmation({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { handleLogout } = useAuth();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc muốn đăng xuất?</AlertDialogTitle>
          {/* <AlertDialogDescription>
            Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng.
          </AlertDialogDescription> */}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-600/80 cursor-pointer"
          >
            Tiếp tục
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
