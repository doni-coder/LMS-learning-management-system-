import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
axios.defaults.withCredentials = true;

function Alert({ open, setOpen, email, userRole }) {
  const handlePasswordReset = async () => {
    if (!email || !userRole) {
      alert("please enter email and userRole");
      return;
    }
    await axios
      .post(`${import.meta.env.VITE_API_URL}/api/common/reset-password`, {
        email,
        userRole,
      })
      .then((response) => {
        window.location.href = `/enter-otp/?email=${encodeURIComponent(
          response.data.email
        )}&userRole=${encodeURIComponent(response.data.userRole)}`;
      });
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. By click Reset you can reset your
            account password.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handlePasswordReset}
            className={"text-white"}
          >
            Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Alert;
