import { UsersTable } from "@/components/admin/users-table";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1a1a1a]">Usuarios</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona los usuarios y sus roles</p>
      </div>
      <UsersTable />
    </div>
  );
}
