
import Image from "next/image";
import type { ReactNode } from "react";
import { CARS, BENEFITS, WHY, REVIEWS } from "@/lib/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCarSide,
  faUsers,
  faChevronLeft,
  faChevronRight,
  faStar,
  faMobileScreenButton,
  faTag,
  faShieldHalved,
  faClock,
  faHeadset,
  faRoute,
  faCheckCircle,
  faArrowRight,
  faMapMarkerAlt,
  faPhone,
  faGift,
} from "@fortawesome/free-solid-svg-icons";
import { faGooglePlay } from "@fortawesome/free-brands-svg-icons";

const Block = ({
  h,
  children,
}: {
  h: string;
  children: ReactNode;
}) => (
  <section className="wrap block">
    <h2>{h}</h2>
    <p>{children}</p>
  </section>
);

export function Intro() {
  return (
    <>
      <Block h="SKG Travels: Best Car Rental in India">
        SKG Travels, a trusted cab booking company in Mumbai, is committed
        to providing excellent service. We focus on customer satisfaction,
        offer a wide range of vehicles, and work with experienced drivers
        to make every journey comfortable and convenient.
      </Block>

      <Block h="Mumbai: A Dream City">
        Mumbai is a vibrant city filled with culture, iconic landmarks,
        and exciting experiences. SKG Travels helps you explore attractions
        like the Gateway of India and the lively streets of Juhu with
        convenient and comfortable cab services.
      </Block>
    </>
  );
}

export function Fleet() {
  return (
    <section className="wrap block">
      <h2>Outstation Car Rental Mumbai</h2>

      <div className="grid4">
        {CARS.map((c) => (
          <article className="card car" key={c.name}>
            <Image
              src={c.img}
              alt={c.name}
              width={200}
              height={110}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />

            <h3>{c.name}</h3>

            <small>
              <FontAwesomeIcon icon={faUsers} aria-hidden="true" />{" "}
              Seating: {c.seats} Passengers
            </small>

            <strong>Rs. {c.rate} Per KM</strong>

            <a href="/contact" className="btn btn-green btn-sm">
              <FontAwesomeIcon icon={faCarSide} aria-hidden="true" />{" "}
              Book Now
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Articles() {
  return (
    <>
      <Block h="Best Car Rental in India for a Trip">
        Start a smooth and enjoyable journey with SKG Travels. Choose
        a vehicle that suits your needs and enjoy convenient car rental
        services for your next trip.
      </Block>

      <Block h="Online Taxi Booking Mumbai for Outstation Tour">
        Book an online taxi in Mumbai for your outstation trips. Choose
        your preferred vehicle and plan your journey with a simple,
        convenient booking experience.
      </Block>

      <Block h="Hire Car Rental in Mumbai for Local Visit">
        Explore Mumbai with convenient local car rental services.
        Travel to popular attractions, business destinations, shopping
        areas, and other places around the city.
      </Block>

      <Block h="The Process of Online Taxi Booking in Mumbai with SKG Travels">
        Visit our website, enter your pickup and drop-off locations,
        select your preferred vehicle, and provide your travel details
        to arrange your cab booking.
      </Block>
    </>
  );
}

export function Benefits() {
  const benefitIcons = [
    faTag,
    faShieldHalved,
    faClock,
    faHeadset,
    faRoute,
    faCheckCircle,
  ];

  return (
    <section className="wrap block">
      <h2>Top Benefits - Book Outstation Cab with SKG Travels</h2>

      <div className="grid2">
        {BENEFITS.map(([t, d, i], index) => (
          <div className="card feat" key={t}>
            <span className="ico">
              <FontAwesomeIcon
                icon={benefitIcons[index % benefitIcons.length]}
                aria-hidden="true"
              />
            </span>

            <div>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="sand block">
      <div className="wrap">
        <div className="thead">
          <h2>Testimonials</h2>

          <div className="arrows">
            <button type="button" aria-label="Previous testimonials">
              <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
            </button>

            <button type="button" aria-label="Next testimonials">
              <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="grid2">
          {REVIEWS.map((r) => (
            <div className="card" key={r.name}>
              <div
                className="stars"
                aria-label="5 out of 5 stars"
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <h4>{r.title}</h4>
              <p>“{r.text}”</p>
              <b>{r.name}</b>
            </div>
          ))}
        </div>

        <div className="dots" aria-hidden="true">
          <i className="on" />
          <i />
          <i />
          <i />
        </div>
      </div>
    </section>
  );
}

export function AppDownload() {
  return (
    <section className="wrap block">
      <div className="card app">
        <div>
          <h2 className="left">Download App Now!</h2>

          <p>
            Get FLAT 20% OFF + ₹500 OFF (Code: BZCE6K) –
            Download the app and self-book to get ₹250 instant cashback!
          </p>

          <form
            className="getlink"
            action="/api/app-link"
            method="post"
          >
            <input
              type="tel"
              name="phone"
              placeholder="+91 Enter Mobile number"
              aria-label="Enter mobile number"
              pattern="[0-9+\-\s]{10,15}"
              autoComplete="tel"
              required
            />

            <button type="submit" className="btn btn-red">
              <FontAwesomeIcon
                icon={faMobileScreenButton}
                aria-hidden="true"
              />{" "}
              GET APP LINK
            </button>
          </form>
        </div>

        <a
          href="https://play.google.com/store"
          className="gplay"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Find the app on Google Play"
        >
          <FontAwesomeIcon icon={faGooglePlay} aria-hidden="true" />{" "}
          Google Play
        </a>
      </div>
    </section>
  );
}

export function Why() {
  return (
    <section className="mint block">
      <div className="wrap">
        <h2>
          Why Choose SKG Travels - Your Trusted Cab Booking Company in Mumbai?
        </h2>

        <div className="grid2">
          {WHY.map(([t, d]) => (
            <div className="card" key={t}>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          ))}
        </div>

        <p className="quote">
          When it comes to finding a reliable car rental company in Mumbai,
          SKG Travels is your trusted travel partner. With a focus on
          convenient cab services, quality, and competitive pricing, we
          aim to make every journey comfortable and hassle-free.
        </p>
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section className="cta">
      <h2>
        Do Not Waste Your Time! Book Outstation Taxi Now
      </h2>

      <p>
        We offer outstation tour packages designed to suit different
        travel needs and budgets.
      </p>

      <a href="/contact" className="btn btn-green">
        <FontAwesomeIcon icon={faCarSide} aria-hidden="true" />{" "}
        Book Now{" "}
        <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
      </a>
    </section>
  );
}
