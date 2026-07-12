/**
 * Email adapter for contact/bulk-enquiry forms.
 * Set FORMSPREE_ENDPOINT (https://formspree.io — free tier) to deliver messages;
 * without it, submissions are logged to the server console so local testing works.
 * Swappable later for Resend/SMTP without touching the form or API route.
 */
export type ContactMessage = {
  kind: "contact" | "bulk";
  name: string;
  email: string;
  organisation?: string;
  message: string;
};

export async function sendEmail(msg: ContactMessage): Promise<void> {
  const endpoint = process.env.FORMSPREE_ENDPOINT;
  if (!endpoint) {
    console.log("[Lernzeit contact] (no FORMSPREE_ENDPOINT set — logging only)", msg);
    return;
  }
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      subject: `Lernzeit ${msg.kind === "bulk" ? "bulk enquiry" : "contact"} from ${msg.name}`,
      ...msg,
    }),
  });
  if (!res.ok) throw new Error(`Email delivery failed (${res.status})`);
}
