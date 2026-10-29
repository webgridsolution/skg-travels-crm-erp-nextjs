import type { Metadata } from "next";

// Global styles first (header/footer depend on these), same as the blog page
import "@/app/cms-public.css";
import "@/app/site.css";
// CSS module last so its classes win where they overlap
import styles from "./about.module.css";

import Link from "next/link";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Fleet from "@/components/services/Fleet";
import EnquiryForm from "@/components/services/EnquiryForm";
import {
  BookingSteps,
  Faq,
  ServiceTabs,
} from "@/components/about/about-interactive";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--f-display",
});

const body = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--f-body",
});

export const metadata: Metadata = {
  title: "About SKG Travels | Cheapest Outstation Cab Service in Mumbai",
  description:
    "Hire affordable local taxis, airport cabs and outstation cars in Mumbai with SKG Travels. Enjoy comfortable vehicles, professional drivers and 24x7 booking support.",
};

const PHONE = "+91 750-6222-999";
const PHONE_LINK = "+917506222999";
const EMAIL = "skgtravels123@gmail.com";
const WHATSAPP = `https://wa.me/${PHONE_LINK}`;

const BENEFITS = [
  {
    t: "Convenience and flexibility",
    d: "Choose your destination, pickup time and stops. Travel at your own pace instead of following a fixed bus or tour schedule.",
  },
  {
    t: "Comfortable, private travel",
    d: "Enjoy a comfortable journey in a well-maintained vehicle, ideal for families, couples, business travellers and groups.",
  },
  {
    t: "Cost-effective for groups",
    d: "Share the cost of a single vehicle with friends or family and enjoy the convenience of travelling together.",
  },
  {
    t: "Explore offbeat destinations",
    d: "Visit scenic locations, small towns and destinations that may be difficult to reach using public transport.",
  },
  {
    t: "Save time and reduce stress",
    d: "Plan your departure and return according to your schedule, with convenient pickup and drop-off arrangements.",
  },
];

const PLACES = [
  {
    n: "Gateway of India",
    d: "Explore Mumbai's famous waterfront landmark and the surrounding heritage district.",
  },
  {
    n: "Marine Drive",
    d: "Enjoy the scenic coastal promenade and beautiful sunset views.",
  },
  {
    n: "Chhatrapati Shivaji Maharaj Terminus",
    d: "Discover Mumbai's historic railway station and remarkable architecture.",
  },
  {
    n: "Colaba Markets",
    d: "Explore lively shopping streets, local stores and popular eateries.",
  },
  {
    n: "Elephanta Caves",
    d: "Plan a visit to the historic rock-cut caves and the nearby ferry departure point.",
  },
];

const FAQS = [
  {
    q: "Which places can I explore after booking a taxi in Mumbai?",
    a: "You can visit Gateway of India, Marine Drive, Chhatrapati Shivaji Maharaj Terminus and Colaba. You can also arrange a separate ferry visit to Elephanta Caves or book an outstation cab.",
  },
  {
    q: "How do I hire the best cab service in Mumbai?",
    a: "Choose your destination, travel date and vehicle requirements. Compare the quoted fares and inclusions, then contact SKG Travels through the website, phone or WhatsApp to enquire about your booking.",
  },
  {
    q: "Which is a reliable cab booking company in Mumbai?",
    a: "SKG Travels offers local cab bookings, airport transfers and outstation travel with professional drivers, a range of vehicles and booking assistance.",
  },
  {
    q: "What are the advantages of booking with SKG Travels?",
    a: "Benefits include convenient pickups, flexible trip planning, vehicle choices, advance enquiries and booking support. Confirm the final fare and applicable trip charges before travelling.",
  },
  {
    q: "Can I book a cab for short trips inside Mumbai?",
    a: "Yes. You can enquire about local journeys, sightseeing, point-to-point transfers and airport pickups within Mumbai.",
  },
  {
    q: "Which cars are available for outstation trips?",
    a: "Vehicle availability depends on your travel date, passenger count and luggage requirements. Contact SKG Travels to enquire about a suitable hatchback, sedan, SUV or larger vehicle.",
  },
  {
    q: "How can I book an outstation taxi from Mumbai?",
    a: "Enter your pickup location, destination, travel date and passenger requirements in the enquiry form. Submit your enquiry and confirm the fare, vehicle and booking arrangements with the team.",
  },
];

export default function AboutPage() {
  return (
    <div className={`skg ${styles.page} ${display.variable} ${body.variable}`}>
      <Header />

      <main>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={`${styles.wrap} ${styles.heroGrid}`}>
            <div className={styles.heroText}>
              <p className={styles.crumb}>
                <Link href="/">Home</Link> / About SKG Travels
              </p>

              <h1>Hire the Cheapest Outstation Cab Service in Mumbai</h1>

              <p className={styles.lead}>
                Discover convenient local taxi services, airport transfers and
                outstation journeys with SKG Travels. Choose a suitable vehicle,
                plan your route and travel with professional booking support.
              </p>

              <div className={styles.cta}>
                <Link href="/contact" className={styles.btnPrimary}>
                  Get a Free Quote
                </Link>

                <a
                  href={WHATSAPP}
                  className={styles.btnGhost}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            <div className={styles.route} aria-hidden="true">
              <svg viewBox="0 0 480 420" fill="none">
                <path
                  className={styles.road}
                  d="M60 360 C140 330 90 240 200 220 S330 200 300 120 S400 60 420 50"
                />
                <path
                  className={styles.roadDash}
                  d="M60 360 C140 330 90 240 200 220 S330 200 300 120 S400 60 420 50"
                />
                <g className={styles.pin}>
                  <circle cx="60" cy="360" r="11" />
                  <circle cx="60" cy="360" r="4" fill="#fff" />
                </g>
                <g className={styles.pinEnd}>
                  <circle cx="420" cy="50" r="11" />
                  <circle cx="420" cy="50" r="4" fill="#fff" />
                </g>
                <circle className={styles.stop} cx="200" cy="220" r="6" />
                <circle className={styles.stop} cx="300" cy="120" r="6" />
              </svg>

              <span className={`${styles.tag} ${styles.t1}`}>Mumbai</span>
              <span className={`${styles.tag} ${styles.t2}`}>Your route</span>
              <span className={`${styles.tag} ${styles.t3}`}>
                Your destination
              </span>
            </div>
          </div>

          <div className={styles.wrap}>
            <dl className={styles.facts}>
              <div>
                <dt>24×7</dt>
                <dd>Booking assistance</dd>
              </div>
              <div>
                <dt>365 Days</dt>
                <dd>Enquiries throughout the year</dd>
              </div>
              <div>
                <dt>3 Steps</dt>
                <dd>Simple enquiry process</dd>
              </div>
              <div>
                <dt>Mumbai</dt>
                <dd>Local and outstation travel</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* MAIN CONTENT AND RIGHT SIDEBAR */}
        <section className={styles.section}>
          <div className={`${styles.wrap} ${styles.contentLayout}`}>
            <div className={styles.mainContent}>
              {/* INTRODUCTION */}
              <section className={styles.prose}>
                <h2>Top Car Rental Agencies in Mumbai – SKG Travels</h2>

                <p>
                  SKG Travels aims to make everyday travel and outstation
                  journeys convenient and affordable. Whether you need a taxi
                  for a city visit, an airport transfer or a longer holiday,
                  you can enquire about suitable vehicles and trip arrangements.
                </p>

                <p>
                  Before booking a cab, decide on your destination, journey
                  duration and pickup requirements. Compare available taxi
                  services, check the quoted fare and confirm the applicable
                  charges. You can contact SKG Travels online or by phone to
                  discuss your travel plans.
                </p>

                <h2>Outstation Cabs in Mumbai for Your Next Trip</h2>

                <p>
                  Start planning your next trip with SKG Travels. Our outstation
                  cab service helps travellers arrange journeys from Mumbai to
                  destinations across Maharashtra and beyond, subject to vehicle
                  and route availability.
                </p>

                <p>
                  Whether you are planning a short getaway, a family holiday,
                  a business visit or a longer road trip, share your passenger
                  count, luggage requirements and destination to enquire about
                  a suitable car. Confirm the final fare, tolls, parking,
                  driver allowance and other applicable charges before booking.
                </p>

                <h2>The Benefits of Outstation Car Rental in Mumbai</h2>

                <p>
                  Choosing a rental car for your Mumbai journey offers
                  flexibility, privacy and convenient travel planning. You can
                  organise pickup and drop-off locations around your itinerary
                  and travel with your family, friends or colleagues.
                </p>
              </section>

              {/* BENEFITS */}
              <section className={styles.benefitSection}>
                <h2>Why Choose an Outstation Cab?</h2>

                <ol className={styles.benefitList}>
                  {BENEFITS.map((benefit) => (
                    <li key={benefit.t}>
                      <h3>{benefit.t}</h3>
                      <p>{benefit.d}</p>
                    </li>
                  ))}
                </ol>
              </section>

              {/* SERVICES */}
              <section className={styles.sectionInner}>
                <h2>One Cab Service, Three Ways to Travel</h2>
                <ServiceTabs />
              </section>

              {/* FLEET */}
              <section className={styles.sectionInner}>
                <h2>Choose a Suitable Vehicle for Your Journey</h2>
                <p className={styles.sub}>
                  Tell us how many people are travelling and how much luggage
                  you have so the team can help you enquire about a suitable vehicle.
                </p>
                <div className={styles.fleetBox}>
                  <Fleet />
                </div>
              </section>

              {/* BOOKING PROCESS */}
             <section className={`${styles.sectionInner} ${styles.stepsSection}`}>
              <h2>The Process of Taxi Booking with SKG Travels</h2>
              <p className={styles.sub}>
                Follow these simple steps to submit your travel enquiry.
              </p>
              <BookingSteps />
            </section>

              {/* PLACES */}
              <section className={styles.sectionInner}>
                <h2>Mumbai and Its Famous Places</h2>

                <p>
                  Mumbai is known for its waterfront, historic buildings,
                  shopping districts and vibrant local culture. Plan your
                  sightseeing route and enquire about a cab for convenient
                  travel between locations.
                </p>

                <ul className={styles.places}>
                  {PLACES.map((place) => (
                    <li key={place.n}>
                      <h3>{place.n}</h3>
                      <p>{place.d}</p>
                    </li>
                  ))}
                </ul>

                <p>
                  You can enquire through the website, call the booking team
                  or contact SKG Travels on WhatsApp. Confirm vehicle
                  availability and your booking details before starting
                  your journey.
                </p>
              </section>

              {/* FAQ */}
              <section className={styles.sectionInner}>
                <h2>Frequently Asked Questions</h2>
                <Faq items={FAQS} />
              </section>
            </div>

            {/* RIGHT SIDEBAR FORM */}
            <aside className={styles.sidebar}>
              <div className={styles.bookingCard} id="book">
                <span className={styles.bookingEyebrow}>Start Your Journey</span>

                <h2>Get a Free Quote</h2>

                <p>Share your trip details and we&apos;ll get back to you.</p>

                <EnquiryForm />
              </div>

              <div className={styles.helpCard}>
                <h3>Need Expert Help?</h3>
                <p>We would be happy to help you!</p>

                <a href={`tel:${PHONE_LINK}`}>{PHONE}</a>

                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>

                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </div>

              <div className={styles.offerCard}>
                <span>Limited-Time Offer</span>
                <h3>Outstation Car Rental</h3>
                <p>
                  Planning your next journey? Enquire about available cars and
                  fares for your travel dates.
                </p>

                <a href="#book" className={styles.btnPrimary}>
                  Book Now
                </a>
              </div>
            </aside>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.contact}>
              <div>
                <h2>Planning a Trip? Tell Us Where.</h2>
                <p>
                  Share your route and travel date to enquire about pricing
                  and vehicle availability.
                </p>

                <div className={styles.cta}>
                  <a href={`tel:${PHONE_LINK}`} className={styles.btnAmber}>
                    Call {PHONE}
                  </a>

                  <Link href="/contact" className={styles.btnOutline}>
                    Send an Enquiry
                  </Link>
                </div>
              </div>

              <address>
                <p>SKG Travels – Mumbai, Maharashtra</p>
                <p>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </p>
                <p>Booking enquiries available throughout the year.</p>
              </address>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}