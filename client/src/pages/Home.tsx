/**
 * MAMU OIL — PETROLEUM NOIR DESIGN CONTRACT
 * The page is an asymmetric energy current: black mineral fields, Mamu Amber traces,
 * editorial type, and glass only where it communicates a live or navigational layer.
 */
import { ArrowDown, ArrowUpRight, Droplets, Fuel, MapPin, Menu, Orbit, X } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";

const BarrelScene = lazy(() => import("@/components/BarrelScene"));

const navigation = [
  { label: "Standard", href: "#standard" },
  { label: "Operations", href: "#operations" },
  { label: "Contact", href: "#contact" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [barrelActive, setBarrelActive] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="mamu-site">
      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="Mamu Oil home">
          <img src="/manus-storage/mamu-mark_cf6cfd10.png" alt="Mamu Oil monogram" className="brand-mark" />
          <span className="brand-lockup"><strong>MAMU</strong><span>OIL</span></span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>

        <a className="header-contact" href="#contact">Talk to Mamu <ArrowUpRight size={15} /></a>

        <button
          className="menu-trigger"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={21} /> : <Menu size={22} />}
        </button>

        <nav id="mobile-navigation" className={`mobile-nav ${menuOpen ? "mobile-nav--open" : ""}`} aria-label="Mobile navigation">
          {navigation.map((item) => <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>)}
          <a href="#contact" onClick={closeMenu}>Talk to Mamu <ArrowUpRight size={16} /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-image" aria-hidden="true" />
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="energy-trace energy-trace--hero" aria-hidden="true" />

          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> Zaria, Kaduna <span className="eyebrow-divider">/</span> Nigeria</p>
            <h1 id="hero-title">Energy, carried<br /><em>with purpose.</em></h1>
            <p className="hero-description">Fuel, kerosene and oil &amp; gas supply from Zaria, Kaduna — carried with steady service and a clear local point of contact.</p>
            <div className="hero-actions">
              <a className="button button--primary" href="#standard">Enter the flow <ArrowDown size={16} /></a>
              <a className="button button--text" href="#contact">Make an enquiry <ArrowUpRight size={16} /></a>
            </div>
          </div>

          <div className="hero-3d" aria-label="Interactive three-dimensional oil barrel scene. Drag to inspect the barrel.">
            <Suspense fallback={<div className="scene-fallback" aria-hidden="true"><span /></div>}>
              <BarrelScene onExplore={() => setBarrelActive(true)} />
            </Suspense>
            <div className={`scene-readout ${barrelActive ? "scene-readout--active" : ""}`}>
              <Orbit size={13} />
              <span>{barrelActive ? "Barrel mode: active" : "Drag to explore"}</span>
            </div>
            <div className="scene-index"><span>01</span><span>03D</span></div>
          </div>

          <div className="hero-footnote">Scroll to follow the current <ArrowDown size={16} /></div>
        </section>

        <section className="signal-strip" aria-label="Mamu Oil snapshot">
          <div><span>01</span><p><strong>Local presence</strong>Zaria, Kaduna</p></div>
          <div><span>02</span><p><strong>Energy focus</strong>Fuel, kerosene &amp; oil</p></div>
          <div><span>03</span><p><strong>Digital direction</strong>Clarity in motion</p></div>
        </section>

        <section id="standard" className="standard-section section-shell" aria-labelledby="standard-title">
          <div className="section-kicker"><span><img src="/manus-storage/mamu-mark_cf6cfd10.png" alt="" /> 01 — The Mamu Standard</span><span>Supply / Service / Zaria</span></div>
          <div className="section-route section-route--standard" aria-hidden="true"><span>01</span><i /><b /></div>
          <div className="standard-heading">
            <h2 id="standard-title">A material<br /><em>way forward.</em></h2>
            <p>From fuel to kerosene, every supply conversation begins with the same standard: dependable movement, deliberate service, and a direct connection to the needs of Zaria.</p>
          </div>

          <div className="standard-stage">
            <figure className="oil-figure">
              <img src="/manus-storage/mamu-oil-macro_90e7a115.jpg" alt="A suspended black oil droplet above a glossy oil surface" />
              <figcaption><span>Material study</span><span>Black / Amber / Light</span></figcaption>
            </figure>

            <div className="principles-list">
              <article>
                <div className="principle-icon"><Fuel size={20} /></div>
                <span>01</span>
                <h3>Fuel provision</h3>
                <p>Fuel supply for the daily movement of people, businesses and essential local activity.</p>
              </article>
              <article>
                <div className="principle-icon"><Droplets size={20} /></div>
                <span>02</span>
                <h3>Product focus</h3>
                <p>Kerosene and oil &amp; gas supply handled with the focus and service discipline the work requires.</p>
              </article>
              <article>
                <div className="principle-icon"><MapPin size={20} /></div>
                <span>03</span>
                <h3>Rooted clarity</h3>
                <p>A Zaria-based operation with a clear local route for supply enquiries and business conversations.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="operations" className="operations-section" aria-labelledby="operations-title">
          <div className="operations-image-wrap">
            <img src="/manus-storage/mamu-route-operations_ffcc3088.jpg" alt="Northern Nigerian road at golden hour, representing energy movement" />
            <div className="route-overlay" aria-hidden="true"><span className="route-node route-node--start" /><span className="route-line" /><span className="route-node route-node--end" /></div>
          </div>
          <div className="operations-copy">
            <p className="eyebrow">02 / Operations</p>
            <h2 id="operations-title">From the source.<br /><em>Into the city.</em></h2>
            <p>Fuel, kerosene and oil &amp; gas supply move through a Zaria-rooted network with the same aim: keep the route clear, keep the service direct, keep Kaduna moving.</p>
            <div className="operations-tags" aria-label="Operations profile"><span>Fuel / Kerosene / Oil &amp; Gas</span><span>Zaria → Kaduna</span><span><img src="/manus-storage/mamu-mark_cf6cfd10.png" alt="" /> Mamu route</span></div>
            <a className="underlined-link" href="#contact">Talk supply with Mamu <ArrowUpRight size={16} /></a>
          </div>
        </section>

        <section id="contact" className="contact-section" aria-labelledby="contact-title">
          <div className="contact-glow" aria-hidden="true" />
          <div className="contact-topline"><span>03 — A clear next move</span><span>mamuoil.com</span></div>
          <div className="contact-content">
            <h2 id="contact-title">Start at<br /><em>the source.</em></h2>
            <div className="contact-details">
              <p>For supply enquiries and direct business conversations, Mamu Oil is ready to hear from you.</p>
              <a className="button button--primary" href="mailto:info@mamuoil.com">Contact Mamu Oil <ArrowUpRight size={17} /></a>
              <div className="location-line"><MapPin size={15} /><span>Zaria, Kaduna, Nigeria</span></div>
            </div>
          </div>
          <div className="contact-mark"><img src="/manus-storage/mamu-mark_cf6cfd10.png" alt="" /></div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Mamu Oil. Zaria, Kaduna.</p>
        <a href="#top">Back to top <ArrowUpRight size={14} /></a>
      </footer>
    </div>
  );
}
