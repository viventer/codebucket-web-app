const GUEST_NEWSLETTER_KEY = "cb_guest_newsletter";

export function readGuestNewsletterSubscribed(): boolean {
  try {
    return localStorage.getItem(GUEST_NEWSLETTER_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeGuestNewsletterSubscribed(): void {
  try {
    localStorage.setItem(GUEST_NEWSLETTER_KEY, "1");
  } catch {
    // localStorage unavailable (e.g. private browsing with storage blocked)
  }
}
