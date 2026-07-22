// What a "reveal travel dates" token can unlock. Each key here is a scope
// a token can be issued for (see scripts/issue-travel-token.mjs) — a token
// only unlocks the sections whose key is in its own scope, so you can send
// one applicant a token that only reveals UK dates, and another a token
// that reveals US + HK, without touching any code.
//
// Keys match the same location codes already used for the "Locations
// you're interested in" pills in the travel form (US/UK/SG/HK). Edit the
// body text below with your real dates — use "\n" for a line break to
// put each city on its own line (rendered with whitespace-pre-line).
export const TRAVEL_SECTIONS = {
  us: {
    label: "US Dates",
    body: "New York — Aug 12–18\nSan Francisco — Aug 18–19",
  },
  uk: {
    label: "UK Dates",
    body: "2027, TBD",
  },
  sg: {
    label: "SG Dates",
    body: "Rest of August",
  },
  hk: {
    label: "HK Dates",
    body: "Aug 8-12",
  },
};
