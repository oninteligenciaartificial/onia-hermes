import Link from "next/link";

export default function NotFound() {
  return (
    <main className="control-center">
      <section className="hero">
        <p className="eyebrow">Onia Center</p>
        <h1>Pagina no encontrada</h1>
        <p>La ruta no existe o todavia no esta publicada en este panel.</p>
        <div className="hero-actions">
          <Link href="/">Volver al inicio</Link>
          <Link href="/onia-center">Abrir Onia Center</Link>
        </div>
      </section>
    </main>
  );
}
