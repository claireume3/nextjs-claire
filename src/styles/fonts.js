import {
  Bodoni_Moda,
  Geist,
  Geist_Mono,
  Roboto,
  WindSong,
} from "next/font/google";
import localFont from "next/font/local";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Custom display font used for both headings/captions and body paragraphs
// site-wide (replaces the former Italiana + Cormorant Garamond pairing).
export const montage = localFont({
  src: "../fonts/Montage.otf",
  variable: "--font-montage",
  weight: "400",
  style: "normal",
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

export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${montage.variable} ${bodoniModa.variable} ${windSong.variable} ${roboto.variable}`;
