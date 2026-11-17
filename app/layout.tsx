import type { Metadata } from "next";
import "./site.css";
import "./ambient.css";

export const metadata: Metadata = {
  title: "Ranjula Ilukpitiya · Full-Stack Software Engineer",
  description:
    "Portfolio of Ranjula Ilukpitiya, a full-stack software engineer in Sri Lanka building web products with Next.js, React, TypeScript, NestJS and Supabase. Co-founder of M99 Labs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
