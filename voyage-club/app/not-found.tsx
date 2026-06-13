import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="container narrow">
        <span className="eyebrow">404</span>
        <h1>That Page Is Off Course</h1>
        <p>The page may have moved or the address may be incomplete.</p>
        <Link className="btn primary" href="/" style={{ marginTop: 24 }}>Return home</Link>
      </div>
    </section>
  );
}

