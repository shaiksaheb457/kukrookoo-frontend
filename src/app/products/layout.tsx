import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Fresh Chicken & Masala",
  description: "Browse live broiler chicken, country chicken, fresh broiler meat & our signature masala — all farm-fresh.",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}