"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { fleet } from "../data";

const FILTERS = ["All", "Hatchback", "Sedan", "SUV", "Tempo"];

export default function Fleet() {
  const [filter, setFilter] = useState("All");
  const [km, setKm] = useState(100);
  const [selected, setSelected] = useState(fleet[0].id);

  const list = useMemo(
    () => (filter === "All" ? fleet : fleet.filter((f) => f.type === filter)),
    [filter]
  );
  const chosen = fleet.find((f) => f.id === selected) || fleet[0];
  const estimate = (chosen.rate * (Number(km) || 0)).toLocaleString("en-IN");

  return (
    <section id="fares" className="mt-fleet">
      <header className="mt-section-head">
        <span className="mt-eyebrow">Our Fleet</span>
        <h2>Outstation Taxi Fare in Mumbai</h2>
        <p>Best Taxi Fare in Mumbai</p>
      </header>

      <div className="mt-filters" role="tablist" aria-label="Filter vehicles">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={`mt-chip ${filter === f ? "is-active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-fleet-list">
        {list.map((car) => (
          <article
            key={car.id}
            className={`mt-car ${selected === car.id ? "is-selected" : ""}`}
            onClick={() => setSelected(car.id)}
          >
            <div className="mt-car-img">
              <Image src={car.img} alt={car.name} width={220} height={130} />
            </div>
            <div className="mt-car-info">
              <span className="mt-tag">{car.type}</span>
              <h3>{car.name}</h3>
              <p>{car.seats}</p>
              <small>Driver Charges, Toll &amp; Parking Charges are Additional</small>
            </div>
            <div className="mt-car-price">
              <strong>
                Rs.{car.rate} <span>per KM</span>
              </strong>
              <a href="#quote" className="mt-btn mt-btn-sm">
                Book Now
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-estimator">
        <div>
          <h3>Estimate your fare</h3>
          <p>Select a vehicle above, then drag to set your distance.</p>
        </div>
        <div className="mt-est-body">
          <label htmlFor="mt-km">
            <span>{chosen.name}</span>
            <b>{km} km</b>
          </label>
          <input
            id="mt-km"
            type="range"
            min="10"
            max="1500"
            step="10"
            value={km}
            onChange={(e) => setKm(e.target.value)}
          />
          <div className="mt-est-total">
            Approx. <strong>Rs. {estimate}</strong>
            <small> + driver charges, toll &amp; parking</small>
          </div>
        </div>
      </div>
    </section>
  );
}
