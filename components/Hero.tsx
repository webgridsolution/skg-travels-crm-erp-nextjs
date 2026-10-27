
"use client";

import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faUser,
  faLocationDot,
  faFlagCheckered,
  faCalendarDays,
  faUsers,
  faPhone,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const TABS = ["Local", "Outstation", "Rental", "Airport Transfer"];
const RATES = [["Etios", 12], ["Dzire", 12], ["Innova", 16]] as const;

const Field = ({
  icon,
  children,
}: {
  icon: typeof faUser;
  children: React.ReactNode;
}) => (
  <div className="fld">
    <span className="fld-icon">
      <FontAwesomeIcon icon={icon} />
    </span>
    {children}
  </div>
);

export default function Hero() {
  const [tab, setTab] = useState("Rental");

  return (
    <section className="hero2">
      <div className="hero2-in">
        <div className="h-left">
          <span className="pill">
            <FontAwesomeIcon icon={faTag} />
            {" "}Save up to 30% on Outstation Taxi
          </span>

          <h1>Best Car Rental in India</h1>

          <p className="sub">
            Outstation taxi starts from <b>Rs.11/KM</b>. Clean cars,
            verified drivers, 24×7.
          </p>

          <div className="rates">
            {RATES.map(([name, rate]) => (
              <div className="rate" key={name}>
                <small>{name}</small>
                <b>Rs.{rate}</b>
                <small>per KM</small>
              </div>
            ))}
          </div>

          <ul className="ticks">
            <li>
              <FontAwesomeIcon icon={faCheckCircle} />
              No hidden charges
            </li>
            <li>
              <FontAwesomeIcon icon={faCheckCircle} />
              Check taxi rates online
            </li>
          </ul>

          <Image
            className="h-car"
            src="/cars/hero-innova.png"
            alt="Innova taxi"
            width={400}
            height={230}
            priority
          />
        </div>

        <form className="bk" onSubmit={(e) => e.preventDefault()}>
          <h2>Book your taxi</h2>

          <div className="seg" role="tablist">
            {TABS.map((t) => (
              <button
                type="button"
                role="tab"
                aria-selected={tab === t}
                key={t}
                className={tab === t ? "on" : ""}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <Field icon={faUser}>
            <input type="text" placeholder="Your name" />
          </Field>

          <Field icon={faLocationDot}>
            <input type="text" placeholder="Pickup location" />
          </Field>

          <Field icon={faFlagCheckered}>
            <input type="text" placeholder="Drop location" />
          </Field>

          <div className="two">
            <Field icon={faCalendarDays}>
              <input type="date" aria-label="Travel date" />
            </Field>

            <Field icon={faUsers}>
              <select defaultValue="" aria-label="Passengers">
                <option value="" disabled>
                  Passengers
                </option>
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field icon={faPhone}>
            <input
              type="tel"
              placeholder="10 digit mobile no"
              inputMode="numeric"
              maxLength={10}
            />
          </Field>

          <button type="submit" className="btn btn-green btn-full">
            Check {tab} Taxi Rates
          </button>
        </form>
      </div>
    </section>
  );
}
