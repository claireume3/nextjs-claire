import { Resend } from "resend";
import { NextResponse } from "next/server";

const NOTIFY_EMAIL = process.env.BOOKING_NOTIFICATION_EMAIL || "claireuesakabooking@protonmail.com";
const BOOKING_REQUIRED_FIELDS = ["firstName", "lastName", "contactMethod", "contactValue"];
const TRAVEL_REQUIRED_FIELDS = ["firstName", "lastName", "email"];

function buildBookingEmail(data, hasMaterial) {
  return {
    subject: `New booking request from ${data.firstName} ${data.lastName}`,
    text: [
      `Name: ${data.firstName} ${data.lastName}`,
      `Nationality: ${data.nationality || "-"}`,
      `Age: ${data.age || "-"}`,
      `LinkedIn: ${data.linkedin || "-"}`,
      "",
      `Where would you like to meet me: ${data.serviceType || "-"}`,
      `Duration: ${data.duration || "-"}`,
      `Date: ${data.date || "-"}`,
      `Time: ${data.time || "-"}`,
      "",
      `Contact method: ${data.contactMethod || "-"}`,
      `Contact value: ${data.contactValue || "-"}`,
      "",
      `Self introduction: ${data.selfIntro || "-"}`,
      `Wish: ${data.wish || "-"}`,
      `Material: ${hasMaterial ? "attached" : "-"}`,
    ].join("\n"),
  };
}

function buildTravelInterestEmail(data, hasIdDocument) {
  return {
    subject: `Travel dates interest from ${data.firstName} ${data.lastName}`,
    text: [
      `Name: ${data.firstName} ${data.lastName}`,
      `Email: ${data.email || "-"}`,
      `LinkedIn or company link: ${data.linkedin || "-"}`,
      `ID: ${hasIdDocument ? "attached" : "-"}`,
      `Locations of interest: ${(data.locations || []).join(", ") || "-"}`,
      "",
      `Brief message: ${data.message || "-"}`,
    ].join("\n"),
  };
}

export async function POST(request) {
  const contentType = request.headers.get("content-type") || "";
  let data;
  let attachment = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    data = Object.fromEntries(formData.entries());
    // Object.fromEntries only keeps the last value for a repeated key —
    // "locations" can have several, so it's read separately here.
    data.locations = formData.getAll("locations");

    const fileField = data.formType === "travel-interest" ? "idDocument" : "material";
    const file = formData.get(fileField);
    if (file instanceof File && file.size > 0) attachment = file;
  } else {
    data = await request.json();
  }

  const requiredFields = data.formType === "travel-interest" ? TRAVEL_REQUIRED_FIELDS : BOOKING_REQUIRED_FIELDS;
  const missing = requiredFields.filter((field) => !data[field]);
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing: ${missing.join(", ")}` }, { status: 400 });
  }

  const { subject, text } =
    data.formType === "travel-interest"
      ? buildTravelInterestEmail(data, Boolean(attachment))
      : buildBookingEmail(data, Boolean(attachment));

  const attachments = attachment
    ? [{ filename: attachment.name, content: Buffer.from(await attachment.arrayBuffer()) }]
    : undefined;

  const replyTo =
    data.formType === "travel-interest"
      ? data.email
      : data.contactMethod === "Email"
        ? data.contactValue
        : undefined;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    // The SDK returns { data, error } instead of throwing on API-level
    // failures (bad sender, unverified domain, invalid key, etc.) — awaiting
    // it without checking `error` silently reports success either way.
    const { data: sent, error } = await resend.emails.send({
      from: "Booking Form <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      replyTo,
      subject,
      text,
      attachments,
    });

    if (error) {
      console.error("Booking email failed", error);
      return NextResponse.json({ error: error.message || "Failed to send" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: sent?.id });
  } catch (error) {
    console.error("Booking email failed", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
