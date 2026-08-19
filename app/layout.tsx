import "./globals.css";
import { Suspense } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  title: "Common Ground",
  description: "Find your people, wherever you go to school.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,500&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Suspense fallback={<nav className="nav"><span className="nav-brand">Common Ground</span></nav>}>
          <Nav />
        </Suspense>
        {children}
        <Footer />
      </body>
    </html>
  );
}
