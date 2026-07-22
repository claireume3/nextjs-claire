// What a "reveal travel dates" token can unlock. Each key here is a scope
// a token can be issued for (see scripts/issue-travel-token.mjs) — a token
// only unlocks the sections whose key is in its own scope, so one token
// can show just the dates while another shows dates + itinerary, etc.
//
// Edit the label/body below with your real info.
export const TRAVEL_SECTIONS = {
  dates: {
    label: "Upcoming Dates",
    body: "Add your upcoming travel dates here — e.g. \"Tokyo — Aug 12–18\", \"Singapore — Sept 3–10\".",
  },
  itinerary: {
    label: "Itinerary",
    body: "Add more detailed day-by-day itinerary info here.",
  },
  contact: {
    label: "On-Location Contact",
    body: "Add any location-specific contact details here.",
  },
};
