export function Marquee() {
  const text =
    "URBANO • JAZZ • POP • ÁRABE • CONTEMPORÁNEO • AFRO • SALSA • K-POP • BACHATA • KIZOMBA • WAACKING • POPPING";

  return (
    <section className="bg-primary py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="text-2xl font-bold text-white mx-8">{text}</span>
        <span className="text-2xl font-bold text-white mx-8">{text}</span>
        <span className="text-2xl font-bold text-white mx-8">{text}</span>
        <span className="text-2xl font-bold text-white mx-8">{text}</span>
      </div>
    </section>
  );
}
