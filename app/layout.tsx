import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Ranjula Ilukpitiya — Designer & Developer", description: "Portfolio of Ranjula Ilukpitiya, designer, developer, and founder of M99Labs." };
export default function RootLayout({ children }: LayoutProps<"/">) { return <html lang="en"><body>{children}</body></html>; }
