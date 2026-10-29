import type { Metadata } from "next";
import ComingSoon from "@/components/coming_soon/ComingSoon";

export const metadata: Metadata = {
  title: "Hotels | Coming Soon | SKG Travels",
  description:
    "Hotel booking with SKG Travels is coming soon. Meanwhile, book local and outstation cabs in Mumbai.",
};

export default function HotelsPage() {
  return (
    <ComingSoon
      name="Hotels"
      icon="hotel"
      title="Hotel booking is coming soon"
      description="We are working on a simple way to find and book stays along with your cab. This feature will be available soon."
      highlights={[
        "Stays near popular routes",
        "Cab and hotel together",
        "Clear pricing",
      ]}
    />
  );
}