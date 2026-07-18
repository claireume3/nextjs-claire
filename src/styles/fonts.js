import {
  Bodoni_Moda,
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
  Italiana,
  Roboto,
  WindSong,
} from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Thin, high-contrast display serif used for captions/headings site-wide.
export const italiana = Italiana({
  variable: "--font-italiana",
  weight: "400",
  subsets: ["latin"],
});

// Elegant serif used for body copy site-wide.
export const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

// Light-weight display serif used only for the large hero caption
// (Bodoni Moda's lightest cut is 400 — it has nothing lighter).
export const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  weight: "400",
  subsets: ["latin"],
});

// Upright (non-slanted) decorative script used for accent letters within the hero caption.
export const windSong = WindSong({
  variable: "--font-windsong",
  weight: "400",
  subsets: ["latin"],
});

// Used for sub caption labels (e.g. "Keywords").
export const roboto = Roboto({
  variable: "--font-roboto",
  weight: "500",
  subsets: ["latin"],
});

export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${italiana.variable} ${cormorantGaramond.variable} ${bodoniModa.variable} ${windSong.variable} ${roboto.variable}`;
