// Affiliate configuration — swap placeholder IDs with real ones after registration:
// Booking.com: https://www.booking.com/affiliate-program.en.html
// Skyscanner:  https://www.partners.skyscanner.net/
// Amazon AU:   https://affiliate-program.amazon.com.au/
// Viator:      https://www.viator.com/affiliate-program

export const AFFILIATE_IDS = {
  bookingCom: "YOUR_BOOKING_COM_AID",
  skyscanner: "YOUR_SKYSCANNER_ID",
  amazonAu: "YOUR_AMAZON_TAG-22",
  viator: "YOUR_VIATOR_PID",
};

export function bookingComUrl(location: string) {
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(location)}&aid=${AFFILIATE_IDS.bookingCom}&label=hookline-aus`;
}

export function airbnbUrl(location: string) {
  return `https://www.airbnb.com.au/s/${encodeURIComponent(location)}/homes`;
}

export function skyscannerUrl(destination: string) {
  return `https://www.skyscanner.com.au/transport/flights/any/${encodeURIComponent(destination.toLowerCase().replace(/\s+/g, "-"))}/?associates=${AFFILIATE_IDS.skyscanner}`;
}

export function webjetUrl(destination: string) {
  return `https://www.webjet.com.au/flights/to/${encodeURIComponent(destination)}/`;
}

export function viatorUrl(location: string) {
  return `https://www.viator.com/searchResults/all?text=${encodeURIComponent(location + " fishing")}&pid=${AFFILIATE_IDS.viator}`;
}

export function amazonGearUrl(searchTerm: string) {
  return `https://www.amazon.com.au/s?k=${encodeURIComponent(searchTerm)}&tag=${AFFILIATE_IDS.amazonAu}`;
}

export function gregVinallYoutubeUrl(searchTerm: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent("Greg Vinall " + searchTerm)}`;
}
