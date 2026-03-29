"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteUserDialogProps {
  open: boolean;
  userEmail: string;
  userId: string;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteUserDialog({
  open,
  userEmail,
  userId,
  onClose,
  onDeleted,
}: DeleteUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.error ?? "Error al eliminar usuario");
      return;
    }
    onDeleted();
    onClose();
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setError(null);
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Eliminar usuario</DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-2">
          <p className="text-sm font-medium text-gray-800">{userEmail}</p>
          <p className="text-sm text-gray-600">
            Esta acción eliminará permanentemente al usuario y no se puede deshacer.
          </p>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Eliminando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
