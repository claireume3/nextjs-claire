import { Resend } from "resend";
import { NextResponse } from "next/server";

const NOTIFY_EMAIL = process.env.BOOKING_NOTIFICATION_EMAIL || "claireuesakabooking@protonmail.com";
const REQUIRED_FIELDS = ["firstName", "lastName", "contactMethod", "contactValue"];

function buildBookingEmail(data) {
  return {
    subject: `New booking request from ${data.firstName} ${data.lastName}`,
    text: [
      `Name: ${data.firstName} ${data.lastName}`,
      `Nationality: ${data.nationality || "-"}`,
      `Age: ${data.age || "-"}`,
      `LinkedIn: ${data.linkedin || "-"}`,
      "",
      `Service type: ${data.serviceType || "-"}`,
      `Duration: ${data.duration || "-"}`,
      `Date: ${data.date || "-"}`,
      `Time: ${data.time || "-"}`,
      "",
      `Contact method: ${data.contactMethod || "-"}`,
      `Contact value: ${data.contactValue || "-"}`,
      "",
      `Self introduction: ${data.selfIntro || "-"}`,
      `Wish: ${data.wish || "-"}`,
    ].join("\n"),
  };
}

function buildTravelInterestEmail(data) {
  return {
    subject: `Travel dates interest from ${data.firstName} ${data.lastName}`,
    text: [
      `Name: ${data.firstName} ${data.lastName}`,
      `Contact method: ${data.contactMethod || "-"}`,
      `Contact value: ${data.contactValue || "-"}`,
      `Locations of interest: ${(data.locations || []).join(", ") || "-"}`,
      "",
      `Screening information: ${data.screening || "-"}`,
    ].join("\n"),
  };
}

export async function POST(request) {
  const data = await request.json();

  const missing = REQUIRED_FIELDS.filter((field) => !data[field]);
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing: ${missing.join(", ")}` }, { status: 400 });
  }

  const { subject, text } =
    data.formType === "travel-interest" ? buildTravelInterestEmail(data) : buildBookingEmail(data);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Booking Form <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      replyTo: data.contactMethod === "Email" ? data.contactValue : undefined,
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Booking email failed", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
