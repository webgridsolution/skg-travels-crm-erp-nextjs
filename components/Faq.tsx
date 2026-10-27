"use client";
import { useState } from "react";
import { FAQS } from "@/lib/data";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="wrap block faq">
      <h2>Frequently Asked Questions</h2>
      {FAQS.map(([q, a], i) => (
        <div className="card q" key={q}>
          <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            <span><i className="qn">{String(i + 1).padStart(2, "0")}</i>Q{i + 1} {q}</span><span className="pm">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p>{a}</p>}
        </div>
      ))}
    </section>
  );
}