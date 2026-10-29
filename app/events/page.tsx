import type { Metadata } from "next";
import ComingSoon from "@/components/coming_soon/ComingSoon";

export const metadata: Metadata = {
  title: "Events | Coming Soon | SKG Travels",
  description:
    "Event transport and bookings with SKG Travels are coming soon. Meanwhile, book local and outstation cabs in Mumbai.",
};

export default function EventsPage() {
  return (
    <ComingSoon
      name="Events"
      icon="events"
      title="Events are coming soon"
      description="Soon you will be able to find events and arrange group travel for them with SKG Travels. This feature will be available soon."
      highlights={[
        "Weddings and group trips",
        "Event pickups and drops",
        "Group vehicles",
      ]}
    />
  );
}