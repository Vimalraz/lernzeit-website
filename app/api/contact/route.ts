import { NextResponse } from "next/server";
import { sendEmail, type ContactMessage } from "@/lib/email";

export async function POST(request: Request) {
  let body: Partial<ContactMessage>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name ?? "").toString().trim().slice(0, 200);
  const email = (body.email ?? "").toString().trim().slice(0, 200);
  const message = (body.message ?? "").toString().trim().slice(0, 5000);
  const organisation = (body.organisation ?? "").toString().trim().slice(0, 200);
  const kind = body.kind === "bulk" ? "bulk" : "contact";

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please fill in your name, a valid email and a message." },
      { status: 400 },
    );
  }

  try {
    await sendEmail({ kind, name, email, organisation, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form delivery error:", err);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please email us directly." },
      { status: 502 },
    );
  }
}
