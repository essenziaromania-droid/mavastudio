/**
 * Recenziile clienților. Secțiunea „Ce spun clienții” apare pe site doar când lista nu e goală.
 *
 * Exemplu de recenzie:
 *   {
 *     name: "Ana Popescu",
 *     role: "Fondatoare",
 *     company: "Firma Exemplu",
 *     quote: "Textul recenziei, în cuvintele clientului.",
 *     quoteEn: "Traducerea în engleză (opțional).",
 *     photo: "/images/recenzii/ana.jpg", // opțional, pus în public/images/recenzii/
 *   },
 */
export type Testimonial = { name: string; role?: string; company?: string; quote: string; quoteEn?: string; photo?: string };

export const TESTIMONIALS: Testimonial[] = [];
