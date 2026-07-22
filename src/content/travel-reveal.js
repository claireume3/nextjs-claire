// What a "reveal travel dates" token can unlock. Each key here is a scope
// a token can be issued for (see scripts/issue-travel-token.mjs) — a token
// only unlocks the sections whose key is in its own scope, so you can send
// one applicant a token that only reveals UK dates, and another a token
// that reveals US + HK, without touching any code.
//
// Keys match the same location codes already used for the "Locations
// you're interested in" pills in the travel form (US/UK/SG/HK). Edit the
// body text below with your real dates.
export const TRAVEL_SECTIONS = {
  us: {
    label: "US Dates",
    body: "Add your upcoming US travel dates here — e.g. \"New York — Aug 12–18\".",
  },
  uk: {
    label: "UK Dates",
    body: "Add your upcoming UK travel dates here — e.g. \"London — Sept 3–10\".",
  },
  sg: {
    label: "SG Dates",
    body: "Add your upcoming Singapore travel dates here.",
  },
  hk: {
    label: "HK Dates",
    body: "Add your upcoming Hong Kong travel dates here.",
  },
};
