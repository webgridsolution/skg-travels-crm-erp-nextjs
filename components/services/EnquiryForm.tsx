"use client";

import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";

type FormState = {
  name: string;
  phone: string;
  from: string;
  to: string;
  date: string;
  message: string;
};
type Errors = Partial<Record<keyof FormState, string>>;
type Status = "idle" | "sending" | "done" | "error";

const initial: FormState = { name: "", phone: "", from: "", to: "", date: "", message: "" };

export default function EnquiryForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10 digit mobile number";
    if (!form.from.trim()) e.from = "Pickup location is required";
    if (!form.to.trim()) e.to = "Destination is required";
    if (!form.date) e.date = "Select a travel date";
    return e;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("sending");
    try {
      // TODO: replace with your endpoint
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      setForm(initial);
    } catch {
      setStatus("error");
    }
  };

  const field = (
    name: Exclude<keyof FormState, "message">,
    label: string,
    type = "text",
    extra: InputHTMLAttributes<HTMLInputElement> = {}
  ) => (
    <div className={`mt-field ${errors[name] ? "has-error" : ""}`}>
      <label htmlFor={`mt-${name}`}>{label}</label>
      <input
        id={`mt-${name}`}
        name={name}
        type={type}
        value={form[name]}
        onChange={onChange}
        placeholder={label}
        {...extra}
      />
      {errors[name] && <span className="mt-err">{errors[name]}</span>}
    </div>
  );

  if (status === "done") {
    return (
      <div className="mt-success">
        <div className="mt-success-icon">✓</div>
        <h4>Enquiry received!</h4>
        <p>Our team will call you back shortly.</p>
        <button type="button" className="mt-btn" onClick={() => setStatus("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {field("name", "Your name", "text", { autoComplete: "name" })}
      {field("phone", "10 digit mobile number", "tel", { maxLength: 10, inputMode: "numeric", autoComplete: "tel" })}
      {field("from", "Pickup from")}
      {field("to", "Travelling to")}
      {field("date", "Travel date", "date", { min: new Date().toISOString().split("T")[0] })}
      <div className="mt-field">
        <label htmlFor="mt-message">Tell us about your trip</label>
        <textarea
          id="mt-message"
          name="message"
          rows={3}
          value={form.message}
          onChange={onChange}
          placeholder="Tell us about your trip"
        />
      </div>
      {status === "error" && (
        <p className="mt-err mt-err-block">Something went wrong. Please try again or call us.</p>
      )}
      <button type="submit" className="mt-btn mt-btn-block" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
