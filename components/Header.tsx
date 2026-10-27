
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTaxi,
  faHotel,
  faTicket,
  faMagnifyingGlass,
  faBars,
  faXmark,
  faPhone,
  faEnvelope,
  faClock,
  faLocationDot,
  faPlane,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { NAV } from "@/lib/data";

const TABS = [
  { label: "Taxi Services", href: "/", icon: faTaxi },
  { label: "Hotel", href: "/hotels", icon: faHotel },
  { label: "Events", href: "/events", icon: faTicket },
];

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [searchType, setSearchType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const query = searchQuery.trim();
    if (!query) return;

    const params = new URLSearchParams({
      q: query,
      type: searchType,
    });

    window.location.href = `/search?${params.toString()}`;
  }

  return (
    <header className="hd">
      {/* Row 1: Contact strip */}
      <div className="hd-top">
        <div className="hd-in">
          <a
            href="https://wa.me/917506222999"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faPhone} />
            <b>+91 750 6222 999</b>
            <small>WhatsApp for Taxi Booking</small>
          </a>

          <a href="mailto:skgtravels123@gmail.com">
            <FontAwesomeIcon icon={faEnvelope} />
            <b>skgtravels123@gmail.com</b>
            <small>Send us your Tour Plan</small>
          </a>

          <span>
            <FontAwesomeIcon icon={faClock} />
            <b>24X7 Open</b>
            <small>365 Days Open</small>
          </span>

          <Link href="/contact" className="btn btn-green btn-sm">
            Contact Now
          </Link>
        </div>
      </div>

      {/* Row 2: Logo, navigation and search */}
      <div className="hd-mid">
        <div className="hd-in">
          <Link
            href="/"
            className="logo"
            onClick={() => setOpen(false)}
          >
            SKG<span>Travels</span>
          </Link>

          <nav className={`menu ${open ? "open" : ""}`}>
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={path === n.href ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <form className="search" onSubmit={handleSearch}>
            <select
              aria-label="Search in"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Routes">Routes</option>
              <option value="Cities">Cities</option>
            </select>

            <input
              type="search"
              placeholder="Search routes, cities..."
              aria-label="Search routes and cities"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button type="submit" aria-label="Search">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>

          <button
            type="button"
            className="burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <FontAwesomeIcon icon={open ? faXmark : faBars} />
          </button>
        </div>
      </div>

      {/* Row 3: Service tabs */}
      <div className="hd-tabs">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={path === t.href ? "on" : ""}
            onClick={() => setOpen(false)}
          >
            <FontAwesomeIcon icon={t.icon} />
            <span>{t.label}</span>
          </Link>
        ))}
      </div>
    </header>
  );
}
