import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-8xl font-black text-primary mb-4">404</p>
      <h1 className="text-3xl font-black text-[#1a1a1a] mb-3">
        Clase no encontrada
      </h1>
      <p className="text-gray-500 max-w-md mb-8">
        Esta clase no existe o ya no está disponible. Vuelve a la página
        principal para ver las clases activas.
      </p>
      <Link href="/#clases">
        <Button className="bg-primary hover:bg-[#6d1730] font-bold">
          Ver todas las clases
        </Button>
      </Link>
    </div>
  );
}
