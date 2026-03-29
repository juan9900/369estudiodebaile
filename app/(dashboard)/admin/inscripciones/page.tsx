import { RegistrationsTable } from "@/components/admin/registrations-table";

export default function AdminRegistrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1a1a1a]">Inscripciones</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona todas las inscripciones de clases</p>
      </div>
      <RegistrationsTable />
    </div>
  );
}
