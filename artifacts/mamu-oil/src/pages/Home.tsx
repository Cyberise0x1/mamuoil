/**
 * MAMU OIL — AMBER HORIZON / EXECUTIVE ENERGY DESIGN CONTRACT
 * A bright, editorial corporate experience: mineral-white space, purposeful amber routes,
 * real operational imagery, fast tactile interactions, and a concise 3D barrel accent.
 */
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Fuel,
  Handshake,
  MapPin,
  Menu,
  MessageCircle,
  Orbit,
  Send,
  Waypoints,
  X,
} from "lucide-react";
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BarrelFallback from "@/components/BarrelFallback";

const BarrelScene = lazy(() => import("@/components/BarrelScene"));
gsap.registerPlugin(ScrollTrigger);

const asset = (filename: string) => `${import.meta.env.BASE_URL}assets/${filename}`;
const whatsappUrl = (message: string) => `https://wa.me/2348100737315?text=${encodeURIComponent(message)}`;

const navigation = [
  { label: "Overview", href: "#overview" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Operations", href: "#operations" },
  { label: "Leadership", href: "#leadership" },
  { label: "Contact", href: "#contact" },
];

const capabilities = [
  {
    number: "01",
    label: "Core supply",
    title: "Fuel supply",
    text: "Direct fuel supply conversations for customers and business partners around Zaria.",
    Icon: Fuel,
    image: asset("tanker-depot.jpg"),
  },
  {
    number: "02",
    label: "Product focus",
    title: "Kerosene",
    text: "Practical kerosene supply handled through a direct and clear local channel.",
    Icon: Droplet,
    image: asset("tanker-road.jpg"),
  },
  {
    number: "03",
    label: "Energy scope",
    title: "Oil & gas",
    text: "A responsive starting point for wider oil-and-gas business enquiries and discussions.",
    Icon: Waypoints,
    image: asset("tanker-depot.jpg"),
  },
  {
    number: "04",
    label: "Local presence",
    title: "Zaria operation",
    text: "A Kaduna-rooted operator positioned close to the movement it supports.",
    Icon: MapPin,
    image: asset("refinery-hero.jpg"),
  },
  {
    number: "05",
    label: "Direct channel",
    title: "Business enquiry",
    text: "A direct line for commercial questions, requirements, and partnership conversations.",
    Icon: Handshake,
    image: asset("amber-liquid.jpg"),
  },
];

export default function Home() {
  const siteRef = useRef<HTMLDivElement>(null);
  const barrelRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [barrelActive, setBarrelActive] = useState(false);
  const [barrelVisible, setBarrelVisible] = useState(true);
  const [enable3D, setEnable3D] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [activeCapability, setActiveCapability] = useState(0);
  const [preparedEnquiryUrl, setPreparedEnquiryUrl] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(motionPreference.matches);
    motionPreference.addEventListener("change", update);
    return () => motionPreference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 651px)");
    const device = navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        addEventListener?: (type: string, listener: () => void) => void;
        removeEventListener?: (type: string, listener: () => void) => void;
      };
      deviceMemory?: number;
    };
    const connection = device.connection;
    let supportsWebGl: boolean | null = null;

    const update = () => {
      if (!desktop.matches || reducedMotion || connection?.saveData || (device.deviceMemory !== undefined && device.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)) {
        setEnable3D(false);
        return;
      }
      if (supportsWebGl === null) {
        try {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) || canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
          supportsWebGl = Boolean(context);
          context?.getExtension("WEBGL_lose_context")?.loseContext();
        } catch {
          supportsWebGl = false;
        }
      }
      setEnable3D(Boolean(supportsWebGl));
    };

    update();
    desktop.addEventListener("change", update);
    connection?.addEventListener?.("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      connection?.removeEventListener?.("change", update);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const barrel = barrelRef.current;
    if (!barrel || !("IntersectionObserver" in window)) return;
    let inView = true;
    const update = () => setBarrelVisible(inView && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    }, { rootMargin: "80px" });
    observer.observe(barrel);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useLayoutEffect(() => {
    const site = siteRef.current;
    if (!site || reducedMotion) return;

    const context = gsap.context(() => {
      gsap.set(".luxury-route-track", { scaleY: 0, transformOrigin: "top center" });
      gsap.to(".luxury-route-track", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: site, start: "top top", end: "bottom bottom", scrub: 0.55 },
      });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.25 });
      intro
        .from(".executive-header", { y: -20, autoAlpha: 0, duration: 0.62 })
        .from(".hero-content .luxury-reveal", { y: 28, autoAlpha: 0, duration: 0.66, stagger: 0.075 }, "-=0.34")
        .from(".hero-glass-card", { y: 20, autoAlpha: 0, duration: 0.58 }, "-=0.42")
        .from(".hero-barrel", { x: 28, autoAlpha: 0, duration: 0.8, ease: "power2.out" }, "-=0.55")
        .from(".hero-ribbon", { y: 18, autoAlpha: 0, duration: 0.54 }, "-=0.42");

      gsap.utils.toArray<HTMLElement>(".gsap-section").forEach((section) => {
        const targets = section.querySelectorAll("[data-gsap-reveal]");
        gsap.fromTo(targets, { y: 34, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.66,
          stagger: 0.085,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".route-marker-motion").forEach((marker) => {
        gsap.fromTo(marker, { scale: 0.55, autoAlpha: 0.25 }, {
          scale: 1,
          autoAlpha: 1,
          duration: 0.5,
          ease: "back.out(1.8)",
          scrollTrigger: { trigger: marker.parentElement, start: "top 72%", once: true },
        });
      });

      gsap.to(".liquid-banner > img", {
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: ".liquid-banner", start: "top bottom", end: "bottom top", scrub: 0.65 },
      });
    }, site);

    return () => context.revert();
  }, [reducedMotion]);

  const moveCapability = (direction: number) => {
    setActiveCapability((current) => (current + direction + capabilities.length) % capabilities.length);
  };

  const moveGlassHighlight = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--glass-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    event.currentTarget.style.setProperty("--glass-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };

  const submitEnquiry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const enquiry = [
      "Hello Mamu Oil, I would like to make an enquiry.",
      "",
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone") || "Not provided"}`,
      `Service: ${data.get("service")}`,
      "",
      `Message: ${data.get("message")}`,
    ].join("\n");
    const url = whatsappUrl(enquiry);
    setPreparedEnquiryUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const active = capabilities[activeCapability];
  const ActiveIcon = active.Icon;

  return (
    <div className="mamu-executive-site" ref={siteRef}>
      <div className="luxury-route-track" aria-hidden="true" />
      <div className={`oil-loader oil-loader--light ${loading ? "" : "is-leaving"}`} role="status" aria-live="polite" aria-label="Preparing Mamu Oil experience">
        <div className="loader-field"><span className="loader-thread" /><span className="loader-pool" /><span className="loader-drop" /></div>
        <div className="loader-copy"><img src={asset("mamu-mark.svg")} alt="" /><span>Preparing Mamu Oil</span><b>01 / 01</b></div>
        <button type="button" onClick={() => setLoading(false)}>Enter <ArrowUpRight size={14} /></button>
      </div>

      <header className="executive-header" aria-label="Primary navigation">
        <a className="executive-brand" href="#overview" aria-label="Mamu Oil home">
          <img src={asset("mamu-mark.svg")} alt="Mamu Oil monogram" />
          <span><strong>MAMU</strong><i>OIL</i></span>
        </a>
        <nav className="executive-nav" aria-label="Main menu">
          {navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <a className="header-contact" href="#contact">Enquire now <ArrowUpRight size={14} /></a>
        <button className="executive-menu" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-controls="mobile-navigation" aria-expanded={menuOpen}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav id="mobile-navigation" className={`executive-mobile-nav ${menuOpen ? "is-open" : ""}`} aria-label="Mobile navigation" onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }}>
          {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
          <a href="#contact" onClick={() => setMenuOpen(false)}>Enquire now <ArrowUpRight size={15} /></a>
        </nav>
      </header>

      <main>
        <section id="overview" className="executive-hero" aria-labelledby="hero-title">
          <img className="hero-image" src={asset("refinery-hero.jpg")} alt="Energy logistics terminal in warm daylight" />
          <div className="hero-wash" aria-hidden="true" />
          <div className="hero-route" aria-hidden="true"><span /><i /><span /></div>
          <div className="hero-route-label" aria-hidden="true"><span>M</span> Zaria route / 01</div>
          <div className="hero-content">
            <p className="eyebrow luxury-reveal"><span /> Zaria, Kaduna <b>/</b> Nigeria</p>
            <h1 id="hero-title" className="luxury-reveal">Energy that<br /><em>moves business.</em></h1>
            <p className="hero-lead luxury-reveal">Mamu Oil brings a direct, locally rooted route to fuel, kerosene, and oil-and-gas supply conversations from Zaria, Kaduna.</p>
            <div className="hero-actions luxury-reveal">
              <a className="button button--ink" href="#contact">Start an enquiry <ArrowRight size={16} /></a>
              <a className="text-link" href="#capabilities">Explore capabilities <ArrowDownIcon /></a>
            </div>
          </div>
          <aside className="hero-glass-card" aria-label="Mamu Oil operational profile">
            <div className="glass-card-top"><img src={asset("mamu-mark.svg")} alt="" /><span>Zaria service desk</span></div>
            <strong>Local route.<br />Clear response.</strong>
            <p>Fuel / Kerosene / Oil &amp; Gas</p>
          </aside>
          <div className="hero-barrel" ref={barrelRef}>
            {enable3D ? (
              <Suspense fallback={<BarrelFallback />}>
                <BarrelScene onExplore={() => setBarrelActive(true)} isActive={barrelVisible} />
              </Suspense>
            ) : <BarrelFallback />}
            {enable3D && <div className={`hero-barrel-readout ${barrelActive ? "is-active" : ""}`}><Orbit size={13} /> {barrelActive ? "Material view active" : "Drag to inspect"}</div>}
          </div>
          <div className="hero-ribbon" aria-label="Mamu Oil service areas">
            <div><span>01</span><strong>Fuel supply</strong></div>
            <div><span>02</span><strong>Kerosene</strong></div>
            <div><span>03</span><strong>Oil &amp; gas</strong></div>
            <a href="#contact">Talk to Mamu <ArrowUpRight size={15} /></a>
          </div>
        </section>

        <section className="signal-section gsap-section" aria-label="Mamu Oil operating principles">
          <p className="section-index route-marker-motion" data-gsap-reveal>Mamu Oil / Zaria route / 01</p>
          <h2 data-gsap-reveal>A direct route from <em>enquiry to movement.</em></h2>
          <p className="signal-copy" data-gsap-reveal>Mamu Oil connects straightforward commercial access with a clear local presence, visible product focus, and a responsive way to begin a business conversation.</p>
          <div className="signal-points">
            <article data-gsap-reveal><span>01</span><h3>Rooted locally</h3><p>Zaria, Kaduna provides the operating context for every direct enquiry.</p></article>
            <article data-gsap-reveal><span>02</span><h3>Built for clarity</h3><p>Product, enquiry, and contact paths are made easy to understand and reach.</p></article>
            <article data-gsap-reveal><span>03</span><h3>Ready to respond</h3><p>WhatsApp-based access keeps business conversations direct and immediate.</p></article>
          </div>
        </section>

        <section id="capabilities" className="capabilities-section gsap-section" aria-labelledby="capability-title">
          <div className="section-heading">
            <p className="section-index route-marker-motion" data-gsap-reveal>Capabilities / 02</p>
            <h2 id="capability-title" data-gsap-reveal>A sharper view of<br /><em>what moves through Mamu.</em></h2>
            <p data-gsap-reveal>Explore a capability for clear product and enquiry detail, then move directly to the right commercial channel.</p>
          </div>
          <div className="capability-focus" data-gsap-reveal>
            <div className="capability-list" role="group" aria-label="Mamu Oil capabilities">
              {capabilities.map((item, index) => (
                <button key={item.title} type="button" className={index === activeCapability ? "is-active" : ""} aria-pressed={index === activeCapability} onClick={() => setActiveCapability(index)}>
                  <span>{item.number}</span><strong>{item.title}</strong><ArrowUpRight size={16} />
                </button>
              ))}
            </div>
            <article className="capability-feature" aria-live="polite" onPointerMove={moveGlassHighlight} onPointerLeave={(event) => { event.currentTarget.style.removeProperty("--glass-x"); event.currentTarget.style.removeProperty("--glass-y"); }}>
              <img src={active.image} alt="" />
              <div className="capability-feature-wash" aria-hidden="true" />
              <div className="capability-feature-content"><p>{active.number} / {active.label}</p><ActiveIcon size={30} /><h3>{active.title}</h3><span>{active.text}</span></div>
              <div className="capability-controls"><button onClick={() => moveCapability(-1)} aria-label="Previous capability"><ChevronLeft size={20} /></button><button onClick={() => moveCapability(1)} aria-label="Next capability"><ChevronRight size={20} /></button></div>
            </article>
          </div>
        </section>

        <section id="operations" className="operations-section gsap-section" aria-labelledby="operations-title">
          <div className="operations-image-wrap" data-gsap-reveal><img src={asset("tanker-depot.jpg")} alt="Fuel terminal and tanker vehicles" /></div>
          <div className="operations-panel">
            <p className="section-index route-marker-motion" data-gsap-reveal>Operations / 03</p>
            <h2 id="operations-title" data-gsap-reveal>Built for the<br /><em>business of movement.</em></h2>
            <p data-gsap-reveal>From a Zaria-rooted operating position, Mamu Oil provides a clear channel for fuel, kerosene, and oil-and-gas enquiries—grounded in local context and handled with direct communication.</p>
            <dl data-gsap-reveal><div><dt>Fuel</dt><dd>Direct supply focus</dd></div><div><dt>Zaria</dt><dd>Kaduna, Nigeria</dd></div></dl>
            <div className="operations-proof-grid" aria-label="Mamu Oil operational response channels"><div><span>01</span><strong>Zaria contact point</strong><small>Local enquiry channel</small></div><div><span>02</span><strong>Product enquiry</strong><small>Fuel · Kerosene · Oil &amp; Gas</small></div><div><span>03</span><strong>Direct handoff</strong><small>WhatsApp message draft</small></div></div>
            <a className="button button--amber" href="#contact" data-gsap-reveal>Open a supply enquiry <ArrowRight size={16} /></a>
          </div>
        </section>

        <section id="leadership" className="founder-section gsap-section" aria-labelledby="founder-title">
          <div className="founder-frame">
            <figure className="founder-portrait-wrap" data-gsap-reveal>
              <img src={asset("founder-portrait.webp")} alt="Portrait of the founder of Mamu Oil" loading="lazy" />
              <figcaption>Founder / Mamu Oil</figcaption>
            </figure>
            <div className="founder-copy">
              <p className="section-index route-marker-motion" data-gsap-reveal>Leadership / Mamu Oil</p>
              <h2 id="founder-title" data-gsap-reveal>Rooted in Zaria.<br /><em>Focused on service.</em></h2>
              <p data-gsap-reveal>This portrait introduces the founder of Mamu Oil. Based in Zaria, the company welcomes enquiries about fuel, kerosene, and oil-and-gas services from customers and business partners.</p>
              <div className="founder-identity" data-gsap-reveal>
                <span>Founder</span>
                <strong>Mamu Oil</strong>
                <small>Fuel · Kerosene · Oil &amp; Gas</small>
              </div>
              <a className="founder-contact-link" href="#contact" data-gsap-reveal>Connect with Mamu Oil <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className="liquid-banner gsap-section" aria-label="Mamu Oil in motion">
          <img src={asset("amber-liquid.jpg")} alt="Abstract amber liquid ripple" />
          <div><p className="route-marker-motion" data-gsap-reveal>Oil movement / 04</p><h2 data-gsap-reveal>Measured response.<br /><em>Clear direction.</em></h2><span data-gsap-reveal>A supply current shaped by local route, product focus, and direct response.</span><a className="liquid-route-link" href="#contact">Continue to Zaria response desk <ArrowRight size={15} /></a></div>
        </section>

        <section id="contact" className="executive-contact gsap-section" aria-labelledby="contact-title">
          <div className="contact-intro"><p className="section-index route-marker-motion" data-gsap-reveal>Contact / Mamu Oil</p><h2 id="contact-title" data-gsap-reveal>Start with<br /><em>the right channel.</em></h2><p data-gsap-reveal>Share your requirement to prepare a WhatsApp message. Review it and tap Send in WhatsApp to deliver your enquiry.</p><div className="contact-command-strip" aria-label="Mamu Oil contact command"><span>Zaria contact</span><strong>Fuel / Kerosene / Oil &amp; Gas</strong><small>Direct business enquiry</small></div><a href={whatsappUrl("Hello Mamu Oil, I would like to make an enquiry.")} target="_blank" rel="noopener noreferrer" className="whatsapp-link" data-gsap-reveal><MessageCircle size={18} /> WhatsApp direct <ArrowUpRight size={15} /></a><span className="location-line" data-gsap-reveal><MapPin size={15} /> Zaria, Kaduna, Nigeria</span></div>
          <form className="executive-form" onSubmit={submitEnquiry} onChange={() => setPreparedEnquiryUrl(null)} data-gsap-reveal>
            <div className="form-header"><span>Business enquiry</span><span>WhatsApp handoff</span></div>
            <label><span>Your name</span><input required name="name" autoComplete="name" placeholder="Full name" /></label>
            <label><span>Email address</span><input required type="email" name="email" autoComplete="email" placeholder="name@company.com" /></label>
            <label><span>Phone number</span><input type="tel" name="phone" autoComplete="tel" placeholder="Optional" /></label>
            <label><span>Enquiry type</span><select required name="service" defaultValue=""><option value="" disabled>Select a requirement</option><option>Fuel supply</option><option>Kerosene supply</option><option>Oil &amp; gas enquiry</option><option>Business partnership</option><option>General enquiry</option></select></label>
            <label className="message-field"><span>Tell us what you need</span><textarea required name="message" rows={5} placeholder="Share the requirement, quantity, location, or business context." /></label>
            <button className="form-submit" type="submit"><Send size={16} /> Prepare WhatsApp message</button>
            {preparedEnquiryUrl && <p className="form-status" role="status">Your message is ready. Review it and tap Send in WhatsApp. If WhatsApp did not open, <a href={preparedEnquiryUrl} target="_blank" rel="noopener noreferrer">open your prepared message here</a>.</p>}
          </form>
        </section>
      </main>

      <footer className="executive-footer"><span>© {new Date().getFullYear()} Mamu Oil. Zaria, Kaduna.</span><a href="#overview">Back to top <ArrowUpRight size={14} /></a></footer>
    </div>
  );
}

function ArrowDownIcon() {
  return <span aria-hidden="true">↓</span>;
}
