import Link from "next/link";
import { Plus, History, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClassesTable } from "@/components/admin/classes-table";

export default function AdminClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1a1a1a]">
            Gestión de clases
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Crear, editar y eliminar clases
          </p>
        </div>
        <div className="flex flex-row flex-wrap my-3 lg:my-0 items-center gap-2">
          <Link href="/admin/classes/past">
            <Button variant="outline">
              <History size={16} className="mr-2" />
              Clases pasadas
            </Button>
          </Link>
          <Link href="/admin/classes/cancelled">
            <Button variant="outline">
              <Trash2 size={16} className="mr-2" />
              Clases canceladas
            </Button>
          </Link>
          <Link href="/admin/classes/new">
            <Button className="bg-primary hover:bg-primary-dark text-white">
              <Plus size={16} className="mr-2" />
              Nueva clase
            </Button>
          </Link>
        </div>
      </div>

      <ClassesTable mode="upcoming" />
    </div>
  );
}
