import Link from "next/link";
import Container from "./Container";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
  { href: "/signin", label: "Sign In" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#08090f]/80 backdrop-blur">
      <Container className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-lime-300 via-cyan-300 to-white bg-clip-text text-transparent">
              AutoChord
            </span>
          </Link>
        </div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/features"
          className="inline-flex items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-medium text-white transition hover:border-cyan-300/60 hover:bg-cyan-300/20"
        >
          Get Started
        </Link>
      </Container>
    </header>
  );
}
