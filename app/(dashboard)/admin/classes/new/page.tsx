import { ClassForm } from "@/components/admin/class-form";

export default function NewClassPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1a1a1a]">Nueva clase</h1>
        <p className="text-gray-500 text-sm mt-1">Crea una nueva clase de baile</p>
      </div>
      <ClassForm />
    </div>
  );
}
