"use client";

import { useState } from "react";
import { faqs } from "@/lib/data";

export default function Faq() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section className="mt-faq" id="faq">
      <header className="mt-section-head">
        <span className="mt-eyebrow">Support</span>
        <h2>Frequently Asked Questions</h2>
      </header>
      <div className="mt-faq-list">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className={`mt-faq-item ${isOpen ? "is-open" : ""}`}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="mt-faq-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-faq-q">
                    Q{i + 1}: {f.q}
                  </span>
                  <span className="mt-faq-toggle" aria-hidden="true">+</span>
                </button>
              </h3>
              <div id={`faq-${i}`} className="mt-faq-panel" role="region">
                <div>
                  <p>{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
