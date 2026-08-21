/**
 * MAMU OIL — PETROLEUM NOIR / CINEMATIC SCROLL DESIGN CONTRACT
 * This page is a Mamu-specific energy journey: material oil, a 3D barrel, Zaria logistics,
 * and service capabilities are revealed through one continuous sticky scroll sequence.
 */
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Droplet, Fuel, Handshake, MapPin, Menu, MessageCircle, Orbit, Send, Waypoints, X } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

const BarrelScene = lazy(() => import("@/components/BarrelScene"));

const navigation = [
  { label: "Origin", href: "#origin" },
  { label: "Supply", href: "#supply" },
  { label: "Operations", href: "#operations" },
  { label: "Contact", href: "#contact" },
];

const capabilities = [
  { kicker: "01 / Core supply", title: "Fuel supply", text: "A direct route for fuel supply conversations in and around Zaria.", Icon: Fuel, image: "/manus-storage/mamu-depot-tankers_c7522131.jpg", imageAlt: "Fuel tanker vehicles at an editorial depot scene" },
  { kicker: "02 / Product focus", title: "Kerosene", text: "Practical kerosene supply handled with measured service and a clear local point of contact.", Icon: Droplet, image: "/manus-storage/mamu-tanker-road_c810cb93.webp", imageAlt: "Fuel tanker on a Nigerian road in an editorial scene" },
  { kicker: "03 / Energy scope", title: "Oil & gas", text: "A corporate channel for wider oil-and-gas enquiries and service discussions.", Icon: Waypoints },
  { kicker: "04 / Local presence", title: "Zaria operation", text: "A Kaduna-rooted business positioned close to the movement it supports.", Icon: MapPin },
  { kicker: "05 / Direct channel", title: "Business enquiry", text: "A clear way to begin a conversation with the Mamu Oil team.", Icon: Handshake },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};
const segment = (value: number, enterStart: number, enterEnd: number, exitStart: number, exitEnd: number) => {
  const enter = smoothstep(enterStart, enterEnd, value);
  const exit = smoothstep(exitStart, exitEnd, value);
  return { enter, exit, active: enter * (1 - exit) };
};

export default function Home() {
  const cinemaRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const targetScroll = useRef(0);
  const smoothScroll = useRef(0);
  const pointer = useRef({ targetX: 0, targetY: 0, x: 0, y: 0 });
  const animationFrame = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [barrelActive, setBarrelActive] = useState(false);
  const [activeCapability, setActiveCapability] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 2100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cinema = cinemaRef.current;
    const stage = stageRef.current;
    if (!cinema || !stage) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let initialized = false;

    const requestTick = () => {
      if (!animationFrame.current) animationFrame.current = window.requestAnimationFrame(update);
    };

    const update = () => {
      animationFrame.current = 0;
      const maxScroll = Math.max(1, cinema.offsetHeight - window.innerHeight);
      const scrolled = clamp(-cinema.getBoundingClientRect().top, 0, maxScroll);
      targetScroll.current = scrolled;
      smoothScroll.current = !initialized || reducedMotion.matches
        ? scrolled
        : smoothScroll.current + (scrolled - smoothScroll.current) * 0.13;
      initialized = true;
      if (Math.abs(smoothScroll.current - scrolled) < 0.08) smoothScroll.current = scrolled;

      const motion = reducedMotion.matches ? 0 : 1;
      pointer.current.x += (pointer.current.targetX - pointer.current.x) * (reducedMotion.matches ? 1 : 0.12);
      pointer.current.y += (pointer.current.targetY - pointer.current.y) * (reducedMotion.matches ? 1 : 0.12);

      const scroll = smoothScroll.current;
      const progress = clamp(scroll / maxScroll);
      const supply = segment(scroll, 460, 860, 1360, 1640);
      const operations = segment(scroll, 1560, 1960, 2580, 2820);
      const capabilitiesEnter = smoothstep(2780, 3440, scroll);
      const capabilityPower = Math.pow(capabilitiesEnter, 1.42);

      stage.style.setProperty("--scroll-progress", progress.toFixed(4));
      stage.style.setProperty("--pointer-x", `${(pointer.current.x * motion).toFixed(4)}`);
      stage.style.setProperty("--pointer-y", `${(pointer.current.y * motion).toFixed(4)}`);
      stage.style.setProperty("--intro-opacity", `${(1 - smoothstep(60, 620, scroll)).toFixed(4)}`);
      stage.style.setProperty("--intro-y", `${smoothstep(60, 620, scroll) * -12}vh`);
      stage.style.setProperty("--barrel-opacity", `${(1 - smoothstep(1180, 1660, scroll)).toFixed(4)}`);
      stage.style.setProperty("--barrel-y", `${progress * -8 - supply.exit * 30}vh`);
      stage.style.setProperty("--barrel-scale", `${(1 + progress * 0.3 + supply.enter * 0.22).toFixed(4)}`);
      stage.style.setProperty("--macro-opacity", `${supply.active.toFixed(4)}`);
      stage.style.setProperty("--macro-scale", `${(1.06 + supply.enter * 0.08 + supply.exit * 0.08).toFixed(4)}`);
      stage.style.setProperty("--route-opacity", `${operations.active.toFixed(4)}`);
      stage.style.setProperty("--route-scale", `${(1.02 + operations.enter * 0.11).toFixed(4)}`);
      stage.style.setProperty("--supply-opacity", `${supply.active.toFixed(4)}`);
      stage.style.setProperty("--supply-y", `${(1 - supply.enter) * 4 - supply.exit * 8}vh`);
      stage.style.setProperty("--operations-opacity", `${operations.active.toFixed(4)}`);
      stage.style.setProperty("--operations-y", `${(1 - operations.enter) * 4 - operations.exit * 8}vh`);
      stage.style.setProperty("--capabilities-opacity", `${capabilityPower.toFixed(4)}`);
      stage.style.setProperty("--capabilities-x", `${(1 - capabilityPower) * 115}vw`);
      stage.style.setProperty("--scene-shade", `${(supply.active * 0.55 + operations.active * 0.4).toFixed(4)}`);

      if (
        Math.abs(smoothScroll.current - targetScroll.current) > 0.08 ||
        Math.abs(pointer.current.x - pointer.current.targetX) > 0.001 ||
        Math.abs(pointer.current.y - pointer.current.targetY) > 0.001
      ) requestTick();
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.current.targetX = event.clientX / window.innerWidth - 0.5;
      pointer.current.targetY = event.clientY / window.innerHeight - 0.5;
      requestTick();
    };
    const onScroll = () => requestTick();
    const onMotionChange = () => { initialized = false; requestTick(); };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    reducedMotion.addEventListener("change", onMotionChange);
    requestTick();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      reducedMotion.removeEventListener("change", onMotionChange);
      if (animationFrame.current) window.cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  const moveCapability = (direction: number) => {
    setActiveCapability((current) => (current + direction + capabilities.length) % capabilities.length);
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
    window.open(`https://wa.me/2348100737315?text=${encodeURIComponent(enquiry)}`, "_blank", "noopener,noreferrer");
    setEnquirySubmitted(true);
  };

  return (
    <div className="mamu-cinematic-site">
      <div className={`oil-loader ${loading ? "" : "is-leaving"}`} role="status" aria-live="polite" aria-label="Preparing Mamu Oil experience">
        <div className="loader-field"><span className="loader-thread" /><span className="loader-pool" /><span className="loader-drop" /></div>
        <div className="loader-copy"><img src="/manus-storage/mamu-mark_cf6cfd10.png" alt="" /><span>Loading the current</span><b>01 / 01</b></div>
        <button type="button" onClick={() => setLoading(false)}>Skip intro <ArrowUpRight size={14} /></button>
      </div>
      <main id="origin">
        <section ref={cinemaRef} className="cinema-scroll" aria-label="Mamu Oil cinematic company story">
          <div ref={stageRef} className="cinema-stage">
            <div className="cinema-world">
              <img className="scene-image scene-image--hero" src="/manus-storage/mamu-hero-refinery_0e61d36e.jpg" alt="" />
              <div className="scene-grain" aria-hidden="true" />
              <div className="scene-amber-thread scene-amber-thread--one" aria-hidden="true" />
              <div className="scene-amber-thread scene-amber-thread--two" aria-hidden="true" />
              <div className="scene-vignette" aria-hidden="true" />
            </div>

            <header className="cinema-header" aria-label="Primary navigation">
              <a className="cinema-brand" href="#origin" aria-label="Mamu Oil home">
                <img src="/manus-storage/mamu-mark_cf6cfd10.png" alt="Mamu Oil monogram" />
                <span><strong>MAMU</strong><i>OIL</i></span>
              </a>
              <nav className="cinema-nav" aria-label="Main menu">
                {navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
              </nav>
              <a className="cinema-contact-link" href="#contact">Talk to Mamu <ArrowUpRight size={14} /></a>
              <button className="cinema-menu" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <nav className={`cinema-mobile-nav ${menuOpen ? "is-open" : ""}`} aria-label="Mobile navigation">
                {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
                <a href="#contact" onClick={() => setMenuOpen(false)}>Talk to Mamu <ArrowUpRight size={15} /></a>
              </nav>
            </header>

            <div className="cinema-title-group">
              <p className="cinema-kicker"><span /> Zaria, Kaduna <b>/</b> Nigeria</p>
              <h1>MAMU<span>OIL</span></h1>
              <p className="cinema-subtitle">Energy in motion.</p>
            </div>

            <aside className="operator-rail" aria-label="Mamu Oil operational profile">
              <div className="operator-rail-head"><img src="/manus-storage/mamu-mark_cf6cfd10.png" alt="" /><span>OP / 01</span></div>
              <div className="operator-rail-line" aria-hidden="true"><i /></div>
              <p>Operator signal</p>
              <strong>Zaria, Kaduna</strong>
              <span>Fuel / Kerosene / Oil &amp; Gas</span>
            </aside>

            <section className="cinema-intro" aria-label="Mamu Oil overview">
              <p>Fuel, kerosene and oil &amp; gas supply from a Zaria-rooted operation — carried with clear service and purposeful movement.</p>
              <div className="cinema-tags" aria-label="Mamu Oil highlights"><span>Fuel supply</span><span>Kerosene</span><span>Oil &amp; Gas</span></div>
            </section>

            <div className="cinema-barrel" aria-label="Interactive three-dimensional oil barrel. Drag to inspect.">
              <Suspense fallback={<div className="barrel-loading" aria-hidden="true"><span /></div>}>
                <BarrelScene onExplore={() => setBarrelActive(true)} />
              </Suspense>
              <div className="mobile-barrel-fallback" aria-hidden="true"><span /><i /><b /></div>
              <div className={`barrel-readout ${barrelActive ? "is-active" : ""}`}><Orbit size={13} /> {barrelActive ? "Barrel mode active" : "Drag to explore"}</div>
            </div>

            <div className="scene-macro" aria-hidden="true"><img src="/manus-storage/mamu-oil-macro_90e7a115.jpg" alt="" /></div>
            <div className="scene-route" aria-hidden="true"><img src="/manus-storage/mamu-route-operations_ffcc3088.jpg" alt="" /><div className="route-trace"><span /><i /><span /></div></div>
            <div className="scene-route-stamp" aria-hidden="true"><img src="/manus-storage/mamu-mark_cf6cfd10.png" alt="" /><span>Zaria route / 01</span></div>
            <div className="scene-shade" aria-hidden="true" />

            <section id="supply" className="cinema-story cinema-story--supply" aria-label="Supply story">
              <p className="story-kicker">01 / Direct supply</p>
              <h2>A steady current.<br /><em>Built locally.</em></h2>
              <p className="story-copy">Mamu Oil keeps its service focused on what matters: a direct fuel and kerosene supply conversation, handled with confidence from Zaria.</p>
              <dl className="story-facts"><div><dt>Fuel</dt><dd>Direct supply focus</dd></div><div><dt>Local</dt><dd>Zaria, Kaduna</dd></div></dl>
            </section>

            <section id="operations" className="cinema-story cinema-story--operations" aria-label="Operations story">
              <p className="story-kicker">02 / Operations</p>
              <h2>From Zaria.<br /><em>Into movement.</em></h2>
              <p className="story-copy">A Nigerian energy business with a clear local route for fuel, kerosene and oil &amp; gas enquiries — connecting essential supply to the activity it serves.</p>
              <a className="story-button" href="#contact"><span>↗</span><span>Talk supply with Mamu</span></a>
            </section>

            <section className="capability-slider" aria-label="Mamu Oil capabilities">
              <div className="capability-heading"><p>03 / Capability cards</p><span>Swipe the current</span></div>
              <div className="capability-window">
                <div className="capability-track" style={{ transform: `translateX(calc(-${activeCapability} * (min(74vw, 26rem) + 1.1rem)))` }}>
                  {capabilities.map(({ kicker, title, text, Icon, image, imageAlt }, index) => (
                    <article className={`capability-card ${image ? "capability-card--photo" : ""} ${index === activeCapability ? "is-active" : ""}`} key={title} tabIndex={0} onClick={() => setActiveCapability(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveCapability(index); } }}>
                      {image && <img className="capability-photo" src={image} alt={imageAlt} />}
                      <p>{kicker}</p><Icon className="capability-icon" size={36} /><h3>{title}</h3><span>{text}</span>
                    </article>
                  ))}
                </div>
              </div>
              <div className="capability-controls"><button onClick={() => moveCapability(-1)} aria-label="Previous capability"><ChevronLeft size={21} /></button><button onClick={() => moveCapability(1)} aria-label="Next capability"><ChevronRight size={21} /></button></div>
            </section>

            <div className="cinema-scroll-cue">Follow the current <ArrowDown size={15} /></div>
          </div>
        </section>

        <section id="contact" className="after-cinema-contact" aria-labelledby="contact-title">
          <div className="after-contact-thread" aria-hidden="true" />
          <div className="after-contact-top"><span>Contact / Mamu Oil</span><span>mamuoil.com</span></div>
          <div className="after-contact-content"><h2 id="contact-title">Begin at<br /><em>the source.</em></h2><div className="contact-command"><div className="contact-command-intro"><p>Send your requirement directly to Mamu Oil on WhatsApp. Your enquiry is prepared with the details you provide below.</p><a href="https://wa.me/2348100737315?text=Hello%20Mamu%20Oil%2C%20I%20would%20like%20to%20make%20an%20enquiry." target="_blank" rel="noreferrer" className="contact-cta"><MessageCircle size={17} /> WhatsApp direct</a><span className="after-location"><MapPin size={14} /> Zaria, Kaduna, Nigeria</span></div><form className="contact-form" onSubmit={submitEnquiry}><div className="contact-form-top"><span>Enquiry form</span><span>WhatsApp handoff</span></div><label><span>Your name</span><input required name="name" autoComplete="name" placeholder="Full name" /></label><label><span>Email address</span><input required type="email" name="email" autoComplete="email" placeholder="name@company.com" /></label><label><span>Phone number</span><input type="tel" name="phone" autoComplete="tel" placeholder="Optional" /></label><label><span>Enquiry type</span><select required name="service" defaultValue=""><option value="" disabled>Select a requirement</option><option>Fuel supply</option><option>Kerosene supply</option><option>Oil &amp; gas enquiry</option><option>Business partnership</option><option>General enquiry</option></select></label><label className="contact-form-message"><span>Tell us what you need</span><textarea required name="message" rows={4} placeholder="Share the requirement, quantity, location, or business context." /></label><button className="contact-submit" type="submit"><Send size={15} /> Send via WhatsApp</button>{enquirySubmitted && <p className="form-status" role="status">Your WhatsApp enquiry is ready to send in the newly opened window.</p>}</form></div></div>
          <img className="after-contact-mark" src="/manus-storage/mamu-mark_cf6cfd10.png" alt="" />
        </section>
      </main>
      <footer className="cinema-footer"><span>© {new Date().getFullYear()} Mamu Oil. Zaria, Kaduna.</span><a href="#origin">Back to origin <ArrowUpRight size={14} /></a></footer>
    </div>
  );
}
