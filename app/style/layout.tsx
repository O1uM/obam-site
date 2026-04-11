import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Olu Mabogunje — Style",
};

export default function StyleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
