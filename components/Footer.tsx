
import Link from "next/link";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Cities", href: "/cities" },
  { label: "Travel Blog", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const travelServices = [
  "Mumbai Local Cabs",
  "Outstation Taxi",
  "Airport Transfers",
  "One-Way Trips",
  "Round-Trip Travel",
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 3H4a1 1 0 0 0-1 1c0 9.39 7.61 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 3a14 14 0 0 1-7-7l3-2-2-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-top-line" />

      {/* Animated travel route */}
      <div className="foot-route" aria-hidden="true">
        <span className="route-dot" />
        <span className="route-line" />
        <span className="route-plane">🚗</span>
        <span className="route-line route-line-right" />
        <span className="route-dot" />
      </div>

      <div className="wrap fgrid">
        {/* Brand */}
        <div className="foot-brand">
          <Link href="/" className="logo light foot-logo">
            <span className="foot-logo-icon">✦</span>
            SKG<span>Travels</span>
          </Link>

          <p className="foot-description">
            Every journey deserves comfort. Discover reliable cab services
            for local travel, airport transfers and outstation trips with
            professional drivers and dedicated support.
          </p>

          <div className="foot-trust">
            <span className="trust-check">✓</span>
            Comfort in every kilometre
          </div>

          <Link href="/contact" className="foot-cta">
            Plan Your Journey <ArrowIcon />
          </Link>
        </div>

        {/* Explore */}
        <div className="foot-column">
          <h5>Explore</h5>
          <span className="foot-heading-line" />

          <div className="foot-links">
            {exploreLinks.map((item) => (
              <Link key={item.label} href={item.href}>
                <ArrowIcon />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="foot-column">
          <h5>Travel With Us</h5>
          <span className="foot-heading-line" />

          <div className="foot-links">
            {travelServices.map((service) => (
              <Link
                key={service}
                href={`/contact?service=${encodeURIComponent(service)}`}
              >
                <ArrowIcon />
                <span>{service}</span>
              </Link>
            ))}
          </div>

          <div className="foot-mini-card">
            <span className="foot-mini-icon">✦</span>
            <div>
              <strong>Your next trip starts here.</strong>
              <p>Let’s make the journey memorable.</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="foot-column foot-contact">
          <h5>Get in Touch</h5>
          <span className="foot-heading-line" />

          <div className="foot-contact-item">
            <span className="foot-contact-icon">
              <LocationIcon />
            </span>
            <div>
              <strong>Our Office</strong>
              <p>
                Office No. 110, 1st Floor, Evershine Mall,
                Link Road, Malad (W), Mumbai 400 064.
              </p>
            </div>
          </div>

          <a className="foot-contact-item" href="tel:+917506222999">
            <span className="foot-contact-icon">
              <PhoneIcon />
            </span>
            <div>
              <strong>Call Us</strong>
              <p>+91 750-6222-999</p>
            </div>
          </a>

          <a
            className="foot-contact-item"
            href="mailto:skgtravels123@gmail.com"
          >
            <span className="foot-contact-icon">
              <MailIcon />
            </span>
            <div>
              <strong>Email Us</strong>
              <p>skgtravels123@gmail.com</p>
            </div>
          </a>

          <div className="foot-availability">
            <span className="availability-dot" />
            Here for your travel enquiries
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="foot-bottom">
        <div className="wrap foot-bottom-inner">
          <p>
            © {new Date().getFullYear()} SKG Travels.
            <span> All rights reserved.</span>
          </p>

          <p className="foot-bottom-tagline">
            Made for the journey. <span>♥</span>
          </p>

          <Link href="/privacy-policy" className="foot-bottom-link">
            Privacy &amp; Safety
          </Link>
        </div>
      </div>
    </footer>
  );
}
