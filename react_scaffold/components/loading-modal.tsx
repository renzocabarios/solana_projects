"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import FadeLoader from "react-spinners/FadeLoader";
interface ILoadingModal {
  open: boolean;
}

export default function LoadingModal({ open }: ILoadingModal) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogDescription className="flex flex-col gap-4 items-center">
            <FadeLoader />
            <p className="text-2xl font-medium">
              Wait for the transaction to finish
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
