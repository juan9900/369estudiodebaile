export function AboutSection() {
  return (
    <section id="sobre-nosotros" className="py-20 px-6 bg-white">
      <div className="container mx-auto ">
        <div className="flex flex-row items-start gap-10">
          <div className="w-full ">
            <h2 className="text-5xl md:text-7xl font-black text-primary mb-12 leading-none">
              SOBRE
              <br />
              NOSOTROS
            </h2>
            <p className="text-lg text-[#1a1a1a] leading-relaxed">
              En Estudio 369, creemos que el baile es más que movimiento—es
              expresión, conexión y transformación. Nuestro espacio profesional
              está diseñado para inspirarte a descubrir tu mejor versión a
              través del ritmo.
            </p>
            <p className="text-lg text-[#1a1a1a] leading-relaxed">
              Con instructores expertos y un ambiente acogedor, ofrecemos clases
              intensivas cada sábado para todos los niveles. Ya seas
              principiante o bailarín experimentado, aquí encontrarás tu lugar.
            </p>
          </div>
          <div className="relative h-[500px] w-full ">
            <div className="absolute top-0 left-0 w-[70%] h-[300px] rounded-lg overflow-hidden bg-gradient-to-br from-primary to-[#6d1730] flex items-center justify-center border-8 border-white shadow-2xl z-10">
              <span className="text-white text-xl font-bold">EXPERTOS</span>
            </div>
            <div className="absolute bottom-0 right-0 w-[60%] h-[250px] rounded-lg overflow-hidden bg-gradient-to-br from-[#6d1730] to-primary flex items-center justify-center border-8 border-white shadow-2xl">
              <span className="text-white text-xl font-bold">ESPACIO PRO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
