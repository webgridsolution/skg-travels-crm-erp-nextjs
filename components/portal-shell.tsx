"use client";
import Link from "next/link";
import Image from 'next/image';
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "./icon";
import {
  faGaugeHigh,
  faAddressBook,
  faBullseye,
  faFileInvoice,
  faCalendarCheck,
  faRoute,
  faFileInvoiceDollar,
  faMoneyBillTransfer,
  faReceipt,
  faCarSide,
  faIdCard,
  faBuilding,
  faScrewdriverWrench,
  faScaleBalanced,
  faChartPie,
  faUsersGear,
  faUserShield,
  faLocationDot,
  faShieldHalved,
  faSliders,
  faBars,
  faBell,
  faMagnifyingGlass,
  faArrowRightFromBracket,
  faXmark,
  faSun,
  faMoon,
  faGlobe,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import type { SessionUser } from "@/lib/server/auth";
const navGroups = [
  {
    name: "Workspace",
    items: [["/dashboard", "Dashboard", "dashboard.view", faGaugeHigh]],
  },
  {
    name: "Operations",
    items: [
      ["/customers", "Customers", "customers.view", faAddressBook],
      ["/enquiries", "Enquiries", "enquiries.view", faBullseye],
      ["/quotations", "Quotations", "quotations.view", faFileInvoice],
      ["/bookings", "Bookings", "bookings.view", faCalendarCheck],
      ["/trips", "Trips", "trips.view", faRoute],
      ["/fleet", "Fleet", "vehicles.view", faCarSide],
      ["/drivers", "Drivers", "drivers.view", faIdCard],
      ["/maintenance", "Maintenance", "maintenance.view", faScrewdriverWrench],
      ["/rates", "Rental rates", "rates.view", faScaleBalanced],
    ],
  },
  {
    name: "Finance",
    items: [
      ["/invoices", "Invoices", "invoices.view", faFileInvoiceDollar],
      ["/payments", "Payments & refunds", "payments.view", faMoneyBillTransfer],
      ["/expenses", "Expenses", "expenses.view", faReceipt],
      ["/vendors", "Vendors", "vendors.view", faBuilding],
      ["/accounting", "Trial balance", "accounting.view", faScaleBalanced],
      ["/reports", "Reports", "reports.view", faChartPie],
    ],
  },
  {
    name: "Administration",
    items: [
      ["/staff", "Staff profiles", "staff.view", faUsersGear],
      ["/users", "Users & access", "users.view", faUserShield],
      ["/branches", "Branches", "branches.view", faLocationDot],
      ["/roles", "Roles & access", "roles.view", faShieldHalved],
      ["/settings", "Company settings", "settings.view", faSliders],
    ],
  },
  {
    name: "Website CMS",
    items: [
      ["/area-seo-pages", "Area SEO Pages", "area_seo.view", faGlobe],
      ["/route-seo-pages", "Route SEO Pages", "route_seo.view", faRoute],
      ["/blog-articles", "Blog Articles", "blog.view", faNewspaper],
    ],
  },
] as const;
export function PortalShell({
  user,
  children,
  demo,
}: {
  user: SessionUser;
  children: React.ReactNode;
  demo: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };
  const allowed = (permission: string) =>
    user.roles.includes("Super Admin") ||
    user.permissions.includes("*") ||
    user.permissions.includes(permission);
  return (
    <div className={dark ? "app-shell dark" : "app-shell"}>
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="brand-lock">
          <div className="brand-symbol">
            <Image
                src="/images/logo.png"
                alt="SKG Travels Logo"
                width={55}
                height={55}
                priority
                className="brand-logo"
            />
            </div>
          <div>
            <strong>SKG TRAVELS</strong>
            <small>Operations platform</small>
          </div>
          <button
            className="mobile-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <Icon icon={faXmark} />
          </button>
        </div>
        <nav>
          {navGroups.map((group) => {
            const entries = group.items.filter((item) => allowed(item[2]));
            if (!entries.length) return null;
            return (
              <div className="nav-group" key={group.name}>
                <div className="nav-label">{group.name}</div>
                {entries.map(([href, label, , icon]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`nav-link ${path === href || path.startsWith(`${href}/`) ? "active" : ""}`}
                  >
                    <Icon icon={icon} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>
        {/* <div className="sidebar-bottom"><div className="branch-chip"><span className="online-dot"/> Patna · Begusarai</div><small>Single-company workspace</small></div> */}
      </aside>
      {open && (
        <button
          className="scrim"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Icon icon={faBars} />
            </button>
            <span className="breadcrumb">
              SKG Travels <b>/</b>{" "}
              <strong>
                {path.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ") ||
                  "Dashboard"}
              </strong>
            </span>
          </div>
          <div className="topbar-right">
            <form className="global-search" action="/search">
              <Icon icon={faMagnifyingGlass} />
              <input
                name="q"
                placeholder="Search bookings, customers…"
                minLength={2}
              />
              <kbd>⌘ K</kbd>
            </form>
            <Link
              href="/notifications"
              className="icon-button notification-button"
              aria-label="Notifications"
            >
              <Icon icon={faBell} />
              <span className="notification-dot" />
            </Link>
            <button
              className="icon-button"
              onClick={() => setDark((v) => !v)}
              aria-label="Toggle theme"
            >
              <Icon icon={dark ? faSun : faMoon} />
            </button>
            <div className="user-menu">
              <div className="avatars">
               <Image
                src="/images/logo.png"
                alt="SKG Travels Logo"
                width={30}
                height={30}
                priority
                className="brand-logo"
            />
              </div>
              <div className="user-info">
                <b>{user.name}</b>
                <small>{user.roles[0] ?? "Team member"}</small>
              </div>
              <button
                className="icon-button logout-button"
                onClick={signOut}
                title="Sign out"
              >
                <Icon icon={faArrowRightFromBracket} />
              </button>
            </div>
          </div>
        </header>
        {demo && (
          <div className="demo-banner">
            <Icon icon={faBell} /> Demo preview mode — configure MySQL to enable
            sign-in, persistence and live transactions.
          </div>
        )}
        <main className="page-content">{children}</main>
        <footer className="footer">
          <span>SKG Travels · CRM & ERP</span>
          <span>Developed by Webgridsolution</span>
        </footer>
      </div>
    </div>
  );
}
