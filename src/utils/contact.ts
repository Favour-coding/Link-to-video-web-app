/**
 * Contact link helpers.
 * Strings are split and assembled at runtime to reduce spam scraper harvesting.
 */

export function getWhatsAppUrl(): string {
  const protocol = 'https://';
  const domain = 'wa.me/';
  const phone = '2348114116832';
  const query = '?text=Hello%20Favoura%20Tech%2C%20I%20found%20you%20through%20FavouraFetch';
  return `${protocol}${domain}${phone}${query}`;
}

export function getEmailUrl(): string {
  const user = 'favourcoding';
  const host = 'gmail.com';
  const subject = 'FavouraFetch%20enquiry';
  return `mailto:${user}@${host}?subject=${subject}`;
}

export const DISPLAY_WHATSAPP = ['0811', '411', '6832'].join(' ');
export const DISPLAY_EMAIL = ['favourcoding', 'gmail.com'].join('@');
