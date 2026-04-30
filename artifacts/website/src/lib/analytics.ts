declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type EventParams = {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
};

export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

export const events = {
  ctaClickBoats: () =>
    trackEvent("cta_click", { event_category: "navigation", event_label: "explore_models" }),

  ctaClickInvestors: () =>
    trackEvent("cta_click", { event_category: "navigation", event_label: "investor_relations" }),

  ctaClickReservations: () =>
    trackEvent("cta_click", { event_category: "navigation", event_label: "join_waitlist" }),

  investorRegistrationStart: () =>
    trackEvent("investor_funnel", { event_category: "investor", event_label: "registration_start" }),

  investorNdaAccepted: () =>
    trackEvent("investor_funnel", { event_category: "investor", event_label: "nda_accepted" }),

  investorLoginSuccess: () =>
    trackEvent("investor_funnel", { event_category: "investor", event_label: "portal_login" }),

  waitlistJoined: () =>
    trackEvent("conversion", { event_category: "waitlist", event_label: "waitlist_joined" }),

  contactFormSubmitted: () =>
    trackEvent("conversion", { event_category: "contact", event_label: "contact_form_submitted" }),
} as const;
