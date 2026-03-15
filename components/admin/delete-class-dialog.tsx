"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeleteDialogState = "no-registrations" | "has-active" | "all-cancelled";

interface DeleteClassDialogProps {
  classId: string;
  className: string;
  open: boolean;
  state: DeleteDialogState;
  activeCount?: number;
  onClose: () => void;
  onConfirmHardDelete: () => Promise<void>;
  onConfirmSoftDelete: () => Promise<void>;
}

export function DeleteClassDialog({
  classId,
  className,
  open,
  state,
  activeCount = 0,
  onClose,
  onConfirmHardDelete,
  onConfirmSoftDelete,
}: DeleteClassDialogProps) {
  const handleConfirm = async () => {
    if (state === "no-registrations") {
      await onConfirmHardDelete();
    } else if (state === "all-cancelled") {
      await onConfirmSoftDelete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Eliminar clase</DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-2">
          <p className="text-sm font-medium text-gray-800">{className}</p>

          {state === "no-registrations" && (
            <p className="text-sm text-gray-600">
              Esta clase no tiene inscripciones. Se eliminará permanentemente.
            </p>
          )}

          {state === "has-active" && (
            <p className="text-sm text-gray-600">
              Esta clase tiene{" "}
              <span className="font-semibold">{activeCount}</span>{" "}
              {activeCount === 1 ? "inscripción activa" : "inscripciones activas"}.
              Debes cancelar todas antes de eliminar.
            </p>
          )}

          {state === "all-cancelled" && (
            <p className="text-sm text-gray-600">
              Todas las inscripciones están canceladas. La clase se marcará
              como cancelada y no se mostrará en la lista principal.
            </p>
          )}
        </div>

        <DialogFooter>
          {state === "has-active" ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
              <Link href={`/admin/classes/${classId}/registrations`}>
                <Button className="text-white">Ir a inscripciones</Button>
              </Link>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirmar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
