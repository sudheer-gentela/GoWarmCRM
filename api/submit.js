// api/submit.js
// Vercel Serverless Function — handles all form submissions
// Sends Gmail notification + auto-reply, logs to Google Sheets, pings Teams

import nodemailer from "nodemailer";

// ─── Google Sheets helper ───────────────────────────────────────────────────
async function appendToSheet(data) {
  const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } =
    process.env;

  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    console.warn("Google Sheets env vars missing — skipping sheet log");
    return;
  }

  // Build a JWT for Google Sheets API (no extra library needed)
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const claim = Buffer.from(
    JSON.stringify({
      iss: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })
  ).toString("base64url");

  // Sign with private key using Web Crypto (available in Vercel Edge/Node runtime)
  const privateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

  let token;
  try {
    const { createSign } = await import("crypto");
    const sign = createSign("RSA-SHA256");
    sign.update(`${header}.${claim}`);
    const sig = sign.sign(privateKey, "base64url");
    const jwt = `${header}.${claim}.${sig}`;

    // Exchange JWT for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth2:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });
    const tokenData = await tokenRes.json();
    token = tokenData.access_token;
  } catch (e) {
    console.error("Google auth error:", e.message);
    return;
  }

  if (!token) return;

  // Append row to sheet
  const row = [
    new Date().toISOString(),
    data.firstName,
    data.lastName,
    data.email,
    data.company,
    data.role,
    data.teamSize,
    data.crm,
    data.challenge,
    data.formType, // 'consultation' or 'subscribe'
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Sheet1!A:J:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    }
  );
}

// ─── Teams Webhook helper ───────────────────────────────────────────────────
async function notifyTeams(data) {
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("TEAMS_WEBHOOK_URL not set — skipping Teams notification");
    return;
  }

  const isSubscribe = data.formType === "subscribe";

  const card = {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.4",
          body: [
            {
              type: "TextBlock",
              size: "Large",
              weight: "Bolder",
              text: isSubscribe
                ? "📧 New Newsletter Subscriber"
                : "🔔 New Consultation Request",
              color: "Accent",
            },
            {
              type: "FactSet",
              facts: isSubscribe
                ? [
                    { title: "Email", value: data.email },
                    { title: "Time", value: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) },
                  ]
                : [
                    { title: "Name", value: `${data.firstName} ${data.lastName}` },
                    { title: "Email", value: data.email },
                    { title: "Company", value: data.company || "—" },
                    { title: "Role", value: data.role || "—" },
                    { title: "Team Size", value: data.teamSize || "—" },
                    { title: "Current CRM", value: data.crm || "—" },
                    { title: "Time", value: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) },
                  ],
            },
            ...(data.challenge
              ? [
                  {
                    type: "TextBlock",
                    text: "**Their challenge:**",
                    weight: "Bolder",
                    spacing: "Medium",
                  },
                  {
                    type: "TextBlock",
                    text: data.challenge,
                    wrap: true,
                    color: "Default",
                  },
                ]
              : []),
          ],
          actions: [
            {
              type: "Action.OpenUrl",
              title: "Reply by Email",
              url: `mailto:${data.email}`,
            },
          ],
        },
      },
    ],
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(card),
  });
}

// ─── Gmail SMTP helper ──────────────────────────────────────────────────────
function createTransport() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,        // your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not your login password)
    },
  });
}

async function sendTeamEmail(data) {
  const transporter = createTransport();
  const isSubscribe = data.formType === "subscribe";

  const subject = isSubscribe
    ? `New subscriber: ${data.email}`
    : `New consultation request — ${data.firstName} ${data.lastName}, ${data.company}`;

  const html = isSubscribe
    ? `
      <div style="font-family:Arial,sans-serif;max-width:600px;color:#1A1814">
        <h2 style="color:#C4420A">New Newsletter Subscriber</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p style="color:#6B6760;font-size:13px">Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      </div>`
    : `
      <div style="font-family:Arial,sans-serif;max-width:600px;color:#1A1814">
        <h2 style="color:#C4420A">New Consultation Request</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px;color:#6B6760;width:140px">Name</td><td style="padding:8px"><strong>${data.firstName} ${data.lastName}</strong></td></tr>
          <tr style="background:#F3F1EC"><td style="padding:8px;color:#6B6760">Email</td><td style="padding:8px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding:8px;color:#6B6760">Company</td><td style="padding:8px">${data.company || "—"}</td></tr>
          <tr style="background:#F3F1EC"><td style="padding:8px;color:#6B6760">Role</td><td style="padding:8px">${data.role || "—"}</td></tr>
          <tr><td style="padding:8px;color:#6B6760">Team Size</td><td style="padding:8px">${data.teamSize || "—"}</td></tr>
          <tr style="background:#F3F1EC"><td style="padding:8px;color:#6B6760">Current CRM</td><td style="padding:8px">${data.crm || "—"}</td></tr>
          ${data.challenge ? `<tr><td style="padding:8px;color:#6B6760;vertical-align:top">Their challenge</td><td style="padding:8px">${data.challenge}</td></tr>` : ""}
        </table>
        <p style="color:#6B6760;font-size:13px;margin-top:16px">Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
        <p><a href="mailto:${data.email}" style="background:#C4420A;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;font-size:14px">Reply to ${data.firstName}</a></p>
      </div>`;

  await transporter.sendMail({
    from: `"Action Insights" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,  // your team's email address
    subject,
    html,
  });
}

async function sendAutoReply(data) {
  if (!data.email) return;
  const transporter = createTransport();
  const isSubscribe = data.formType === "subscribe";

  const html = isSubscribe
    ? `
      <div style="font-family:Georgia,serif;max-width:560px;color:#1A1814;line-height:1.7">
        <h2 style="font-size:22px;color:#1A1814">You're in.</h2>
        <p>Thanks for subscribing to Action Insights. New articles land in your inbox as soon as they're published — no fluff, no vendor spin.</p>
        <p>In the meantime, you might find these worth a read:</p>
        <ul style="font-family:Arial,sans-serif;font-size:14px">
          <li><a href="https://go-warm-crm.vercel.app/article-1" style="color:#C4420A">Are you using Salesforce as a CRUD app?</a></li>
          <li><a href="https://go-warm-crm.vercel.app/article-2" style="color:#C4420A">Are your playbooks working or just sitting there?</a></li>
          <li><a href="https://go-warm-crm.vercel.app/article-3" style="color:#C4420A">Should you rebuild or recommit?</a></li>
        </ul>
        <p style="color:#6B6760;font-size:13px;margin-top:24px">— The Action Insights team</p>
      </div>`
    : `
      <div style="font-family:Georgia,serif;max-width:560px;color:#1A1814;line-height:1.7">
        <h2 style="font-size:22px;color:#1A1814">Got it, ${data.firstName}.</h2>
        <p>We'll be in touch within one business day to schedule your 30-minute session.</p>
        <p>A few things to know about the call:</p>
        <ul style="font-family:Arial,sans-serif;font-size:14px;color:#3D3A34">
          <li>We'll ask how your team actually uses the CRM today — no prep needed</li>
          <li>We'll give you an honest read on whether you have a platform problem or an adoption problem</li>
          <li>You'll leave with 2–3 specific things to fix, regardless of whether we work together</li>
        </ul>
        <p>If you want a head start, the three articles below are exactly what we'll be drawing on:</p>
        <ul style="font-family:Arial,sans-serif;font-size:14px">
          <li><a href="https://go-warm-crm.vercel.app/article-1" style="color:#C4420A">Are you using Salesforce as a CRUD app?</a></li>
          <li><a href="https://go-warm-crm.vercel.app/article-2" style="color:#C4420A">Are your playbooks working or just sitting there?</a></li>
          <li><a href="https://go-warm-crm.vercel.app/article-3" style="color:#C4420A">Should you rebuild or recommit?</a></li>
        </ul>
        <p style="color:#6B6760;font-size:13px;margin-top:24px">— The Action Insights team<br>
        <a href="https://actioncrm.io" style="color:#C4420A">actioncrm.io</a></p>
      </div>`;

  await transporter.sendMail({
    from: `"Action Insights" <${process.env.GMAIL_USER}>`,
    to: data.email,
    subject: isSubscribe
      ? "You're subscribed to Action Insights"
      : `Consultation confirmed — we'll be in touch, ${data.firstName}`,
    html,
    replyTo: process.env.NOTIFY_EMAIL,
  });
}

// ─── Main handler ───────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let data;
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  // Basic validation
  if (!data.email) return res.status(400).json({ error: "Email is required" });

  const results = { sheet: false, email: false, autoReply: false, teams: false };

  // Run all four in parallel — failures in one don't block others
  await Promise.allSettled([
    appendToSheet(data).then(() => { results.sheet = true; }).catch(e => console.error("Sheet:", e.message)),
    sendTeamEmail(data).then(() => { results.email = true; }).catch(e => console.error("Team email:", e.message)),
    sendAutoReply(data).then(() => { results.autoReply = true; }).catch(e => console.error("Auto-reply:", e.message)),
    notifyTeams(data).then(() => { results.teams = true; }).catch(e => console.error("Teams:", e.message)),
  ]);

  return res.status(200).json({ success: true, results });
}
