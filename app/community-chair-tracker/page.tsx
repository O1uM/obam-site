import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Chair Tracker — obam.ai",
  description:
    "Haughville Hotties — a shared inventory tracker for community tables and chairs. Borrow, transfer, return.",
};

export default function CommunityChairTrackerPage() {
  return (
    <iframe
      src="/community-chair-tracker.html"
      title="Community Chair Tracker"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        zIndex: 1,
      }}
    />
  );
}
