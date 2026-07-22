import { Geist, Geist_Mono, Roboto, WindSong } from "next/font/google";
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

// Display font for the "Claire Umezawa" wordmark itself — used uniformly
// everywhere the brand name appears (hero caption, footer, /links profile
// circle) instead of a separate base font + accent-letter script pairing.
export const hopelessRomantic = localFont({
  src: "../fonts/HopelessRomanticSociety.otf",
  variable: "--font-hopeless-romantic",
  weight: "400",
  style: "normal",
});

// Decorative script used for accent letters elsewhere (e.g. the homepage's
// "Keywords" line) — unrelated to the brand name itself.
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

export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${montage.variable} ${hopelessRomantic.variable} ${windSong.variable} ${roboto.variable}`;
