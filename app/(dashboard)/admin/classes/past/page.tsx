import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClassesTable } from "@/components/admin/classes-table";

export default function PastClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1a1a1a]">
            Clases pasadas
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Historial de clases anteriores
          </p>
        </div>
        <Link href="/admin/classes">
          <Button variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      <ClassesTable mode="past" />
    </div>
  );
}
