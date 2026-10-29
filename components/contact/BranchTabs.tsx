"use client";

import { useState } from "react";
import styles from "@/app/contact/contact.module.css";

const BRANCHES = [
  {
    city: "Mumbai",
    title: "Head Office, Mumbai",
    address:
      "Office No. 170, 1st Floor, Evershine Mall, Link Road, Chincholi Bunder, Malad (W), Mumbai 400 064.",
  },
  {
    city: "Pune",
    title: "Pune",
    address: "Add your Pune office address here.",
  },
  {
    city: "Gujarat",
    title: "Gujarat",
    address: "Add your Gujarat office address here.",
  },
  {
    city: "Nashik",
    title: "Nashik",
    address: "Add your Nashik office address here.",
  },
];

export default function BranchTabs() {
  const [active, setActive] = useState(0);
  const branch = BRANCHES[active];

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="Office locations">
        {BRANCHES.map((b, i) => (
          <button
            key={b.city}
            type="button"
            role="tab"
            id={`tab-${b.city}`}
            aria-selected={i === active}
            aria-controls="branch-panel"
            className={`${styles.tab} ${i === active ? styles.tabActive : ""}`}
            onClick={() => setActive(i)}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            {b.city}
          </button>
        ))}
      </div>

      <div
        id="branch-panel"
        role="tabpanel"
        aria-labelledby={`tab-${branch.city}`}
        className={styles.branchBox}
      >
        <h3>{branch.title}</h3>
        <p>{branch.address}</p>
      </div>
    </div>
  );
}
