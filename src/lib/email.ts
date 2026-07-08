import { Resend } from "resend";
import type { Charter, CharterEnquiry } from "@/db/schema";

const FROM = "Fish Tripper <noreply@hookline.app>";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendCharterEnquiryToOperator(
  charter: Charter,
  enquiry: CharterEnquiry
) {
  const resend = getResend();
  if (!resend) return;

  const dateRange = `${enquiry.preferredDateFrom} → ${enquiry.preferredDateTo}`;

  await resend.emails.send({
    from: FROM,
    to: charter.operatorEmail,
    subject: `New Enquiry: ${charter.name} — ${enquiry.guestName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#C99A3E;margin-bottom:4px">New Charter Enquiry</h2>
        <p style="color:#555;margin-top:0">via Fish Tripper</p>
        <hr style="border:1px solid #eee;margin:16px 0"/>

        <h3 style="margin-bottom:8px">${charter.name}</h3>

        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#888;width:140px">Guest name</td><td style="padding:6px 0;font-weight:600">${enquiry.guestName}</td></tr>
          <tr><td style="padding:6px 0;color:#888">Email</td><td style="padding:6px 0"><a href="mailto:${enquiry.guestEmail}">${enquiry.guestEmail}</a></td></tr>
          ${enquiry.guestPhone ? `<tr><td style="padding:6px 0;color:#888">Phone</td><td style="padding:6px 0">${enquiry.guestPhone}</td></tr>` : ""}
          <tr><td style="padding:6px 0;color:#888">Preferred dates</td><td style="padding:6px 0">${dateRange}</td></tr>
          <tr><td style="padding:6px 0;color:#888">Guests</td><td style="padding:6px 0">${enquiry.guestCount}</td></tr>
          ${enquiry.skillLevel ? `<tr><td style="padding:6px 0;color:#888">Skill level</td><td style="padding:6px 0">${enquiry.skillLevel}</td></tr>` : ""}
        </table>

        ${enquiry.message ? `
        <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-top:16px">
          <p style="color:#888;margin:0 0 8px">Message from guest:</p>
          <p style="margin:0;line-height:1.6">${enquiry.message}</p>
        </div>
        ` : ""}

        <p style="margin-top:24px;color:#888;font-size:13px">
          Reply directly to <a href="mailto:${enquiry.guestEmail}">${enquiry.guestEmail}</a> to respond to this enquiry.
        </p>
      </div>
    `,
  });
}

export async function sendCharterEnquiryConfirmation(
  charter: Charter,
  enquiry: CharterEnquiry
) {
  const resend = getResend();
  if (!resend) return;

  const dateRange = `${enquiry.preferredDateFrom} to ${enquiry.preferredDateTo}`;

  await resend.emails.send({
    from: FROM,
    to: enquiry.guestEmail,
    subject: `Enquiry received — ${charter.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#C99A3E;margin-bottom:4px">Enquiry Received</h2>
        <p style="color:#555;margin-top:0">Hi ${enquiry.guestName}, your enquiry has been sent to ${charter.operatorName}.</p>
        <hr style="border:1px solid #eee;margin:16px 0"/>

        <h3 style="margin-bottom:8px">${charter.name}</h3>
        <p style="color:#555">Operator: <strong>${charter.operatorName}</strong></p>
        <p style="color:#555">Preferred dates: <strong>${dateRange}</strong></p>
        <p style="color:#555">Group size: <strong>${enquiry.guestCount} ${enquiry.guestCount === 1 ? "angler" : "anglers"}</strong></p>

        <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin-top:16px">
          <p style="margin:0;color:#166534">
            ${charter.operatorName} will be in touch shortly to confirm availability and provide full trip details.
            You can also reach them directly at <a href="tel:${charter.operatorPhone}">${charter.operatorPhone}</a>.
          </p>
        </div>

        <p style="margin-top:24px;color:#888;font-size:13px">
          Sent via Fish Tripper — your fishing trip planner.
        </p>
      </div>
    `,
  });
}
