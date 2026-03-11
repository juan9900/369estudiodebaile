export function Hero() {
  return (
    <section className="relative bg-[#F5F5F0] py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <span className="text-[400px] md:text-[500px] font-black text-primary transform -rotate-12 translate-x-20 translate-y-10">
          369
        </span>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl">
          <span className="inline-block bg-primary text-white text-sm font-bold px-4 py-2 rounded-full mb-4 tracking-wider">
            MUEVE TU CUERPO
          </span>

          <h1 className="text-5xl md:text-8xl font-black text-[#1a1a1a] mb-8 leading-none">
            ESTUDIO DE
            <br />
            BAILE 369
          </h1>

          <div className="flex items-start gap-4 mb-8">
            <p className="text-lg text-[#1a1a1a] max-w-xl leading-relaxed">
              Eleva tu ritmo cada sábado. Descubre tu pasión con nuestros
              intensivos diseñados para todos los niveles.
            </p>
            <div className="flex-shrink-0 mt-2">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8B1E3F"
                strokeWidth="2"
              >
                <path d="M7 7l10 10M7 7v10M7 7h10" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <a
              href="#clases"
              className="bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-[#6d1730] transition-colors text-center"
            >
              VER HORARIOS
            </a>
            <a
              href="#sobre-nosotros"
              className="border-2 border-primary text-primary font-bold px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors text-center"
            >
              SABER MÁS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
