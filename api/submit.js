// api/submit.js  — CommonJS (required for Vercel serverless reliability)
"use strict";

const nodemailer = require("nodemailer");
const { createSign } = require("crypto");

// ─── Google Sheets ────────────────────────────────────────────────────────────
async function appendToSheet(data) {
  const email   = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey  = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !rawKey || !sheetId) {
    console.warn("[Sheets] Missing env vars — skipping. Have:",
      { email: !!email, rawKey: !!rawKey, sheetId: !!sheetId });
    return false;
  }

  const privateKey = rawKey.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);

  const header  = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  })).toString("base64url");

  const sign = createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const sig = sign.sign(privateKey, "base64url");
  const jwt = `${header}.${payload}.${sig}`;

  const tokenBody = `grant_type=urn%3Aietf%3Aparams%3Aoauth2%3Agrant-type%3Ajwt-bearer&assertion=${encodeURIComponent(jwt)}`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: tokenBody,
  });

  const tokenJson = await tokenRes.json();
  if (!tokenJson.access_token) {
    console.error("[Sheets] Token exchange failed:", JSON.stringify(tokenJson));
    return false;
  }

  const row = [
    new Date().toISOString(),
    data.firstName  || "",
    data.lastName   || "",
    data.email      || "",
    data.company    || "",
    data.role       || "",
    data.teamSize   || "",
    data.crm        || "",
    data.challenge  || "",
    data.formType   || "",
  ];

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:J/append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenJson.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    }
  );

  if (!appendRes.ok) {
    const errText = await appendRes.text();
    console.error("[Sheets] Append failed:", appendRes.status, errText);
    return false;
  }

  console.log("[Sheets] Row appended successfully");
  return true;
}

// ─── Teams Webhook ────────────────────────────────────────────────────────────
async function notifyTeams(data) {
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[Teams] TEAMS_WEBHOOK_URL not set — skipping");
    return false;
  }

  const isSubscribe = data.formType === "subscribe";
  const card = {
    type: "message",
    attachments: [{
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
            text: isSubscribe ? "New Newsletter Subscriber" : "New Consultation Request",
          },
          {
            type: "FactSet",
            facts: isSubscribe
              ? [{ title: "Email", value: data.email }]
              : [
                  { title: "Name",      value: `${data.firstName} ${data.lastName}` },
                  { title: "Email",     value: data.email },
                  { title: "Company",   value: data.company  || "—" },
                  { title: "Role",      value: data.role     || "—" },
                  { title: "Team Size", value: data.teamSize || "—" },
                  { title: "CRM",       value: data.crm      || "—" },
                ],
          },
          ...(data.challenge ? [
            { type: "TextBlock", text: "Challenge:", weight: "Bolder", spacing: "Medium" },
            { type: "TextBlock", text: data.challenge, wrap: true },
          ] : []),
        ],
        actions: [{
          type: "Action.OpenUrl",
          title: "Reply by Email",
          url: `mailto:${data.email}`,
        }],
      },
    }],
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(card),
  });

  if (!res.ok) {
    console.error("[Teams] Webhook failed:", res.status, await res.text());
    return false;
  }

  console.log("[Teams] Notification sent");
  return true;
}

// ─── Gmail ────────────────────────────────────────────────────────────────────
function makeTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.warn("[Gmail] Missing env vars — skipping. Have:",
      { user: !!user, pass: !!pass });
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

async function sendTeamEmail(data) {
  const transport = makeTransport();
  if (!transport) return false;

  const notifyEmail = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER;
  const isSubscribe = data.formType === "subscribe";

  const subject = isSubscribe
    ? `New subscriber: ${data.email}`
    : `New consultation request — ${data.firstName} ${data.lastName}, ${data.company}`;

  const html = isSubscribe
    ? `<div style="font-family:Arial,sans-serif;color:#1A1814">
        <h2 style="color:#C4420A">New Newsletter Subscriber</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p style="color:#888;font-size:13px">${new Date().toISOString()}</p>
      </div>`
    : `<div style="font-family:Arial,sans-serif;color:#1A1814;max-width:600px">
        <h2 style="color:#C4420A">New Consultation Request</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px;color:#666;width:130px">Name</td><td style="padding:8px"><strong>${data.firstName} ${data.lastName}</strong></td></tr>
          <tr style="background:#f7f5f0"><td style="padding:8px;color:#666">Email</td><td style="padding:8px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding:8px;color:#666">Company</td><td style="padding:8px">${data.company || "—"}</td></tr>
          <tr style="background:#f7f5f0"><td style="padding:8px;color:#666">Role</td><td style="padding:8px">${data.role || "—"}</td></tr>
          <tr><td style="padding:8px;color:#666">Team Size</td><td style="padding:8px">${data.teamSize || "—"}</td></tr>
          <tr style="background:#f7f5f0"><td style="padding:8px;color:#666">CRM</td><td style="padding:8px">${data.crm || "—"}</td></tr>
          ${data.challenge ? `<tr><td style="padding:8px;color:#666;vertical-align:top">Challenge</td><td style="padding:8px">${data.challenge}</td></tr>` : ""}
        </table>
        <p style="margin-top:20px">
          <a href="mailto:${data.email}" style="background:#C4420A;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;font-size:14px">Reply to ${data.firstName}</a>
        </p>
        <p style="color:#888;font-size:12px;margin-top:16px">${new Date().toISOString()}</p>
      </div>`;

  await transport.sendMail({
    from: `"Action Insights" <${process.env.GMAIL_USER}>`,
    to: notifyEmail,
    subject,
    html,
  });

  console.log("[Gmail] Team email sent to", notifyEmail);
  return true;
}

async function sendAutoReply(data) {
  // Skip test submissions
  if (!data.email || data.email.includes("example.com")) return false;

  const transport = makeTransport();
  if (!transport) return false;

  const isSubscribe = data.formType === "subscribe";
  const domain = process.env.SITE_URL || "https://your-site.vercel.app";

  const html = isSubscribe
    ? `<div style="font-family:Georgia,serif;max-width:560px;color:#1A1814;line-height:1.7">
        <h2 style="font-size:22px">You're in.</h2>
        <p>Thanks for subscribing to Action Insights. New articles land in your inbox as soon as they're published.</p>
        <ul style="font-family:Arial,sans-serif;font-size:14px">
          <li><a href="${domain}/article-1" style="color:#C4420A">Are you using Salesforce as a CRUD app?</a></li>
          <li><a href="${domain}/article-2" style="color:#C4420A">Are your playbooks working or just sitting there?</a></li>
          <li><a href="${domain}/article-3" style="color:#C4420A">Should you rebuild or recommit?</a></li>
        </ul>
        <p style="color:#888;font-size:13px;margin-top:24px">— The Action Insights team</p>
      </div>`
    : `<div style="font-family:Georgia,serif;max-width:560px;color:#1A1814;line-height:1.7">
        <h2 style="font-size:22px">Got it, ${data.firstName}.</h2>
        <p>We'll be in touch within one business day to schedule your 30-minute session.</p>
        <p>On the call we'll give you an honest read on whether you have a platform problem or an adoption problem — and 2–3 specific things to fix regardless of whether we work together.</p>
        <ul style="font-family:Arial,sans-serif;font-size:14px">
          <li><a href="${domain}/article-1" style="color:#C4420A">Are you using Salesforce as a CRUD app?</a></li>
          <li><a href="${domain}/article-2" style="color:#C4420A">Are your playbooks working or just sitting there?</a></li>
          <li><a href="${domain}/article-3" style="color:#C4420A">Should you rebuild or recommit?</a></li>
        </ul>
        <p style="color:#888;font-size:13px;margin-top:24px">— The Action Insights team<br>
        <a href="https://actioncrm.io" style="color:#C4420A">actioncrm.io</a></p>
      </div>`;

  await transport.sendMail({
    from: `"Action Insights" <${process.env.GMAIL_USER}>`,
    to: data.email,
    replyTo: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
    subject: isSubscribe
      ? "You're subscribed to Action Insights"
      : `We'll be in touch, ${data.firstName}`,
    html,
  });

  console.log("[Gmail] Auto-reply sent to", data.email);
  return true;
}

// ─── Main handler ─────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Method not allowed" });

  let data;
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (e) {
    console.error("[Handler] JSON parse error:", e.message);
    return res.status(400).json({ error: "Invalid JSON" });
  }

  if (!data || !data.email) {
    return res.status(400).json({ error: "Email is required" });
  }

  console.log("[Handler] Submission — type:", data.formType, "| email:", data.email);

  const results = { sheet: false, email: false, autoReply: false, teams: false };

  const settled = await Promise.allSettled([
    appendToSheet(data).then(ok => { results.sheet     = !!ok; }),
    sendTeamEmail(data).then(ok => { results.email     = !!ok; }),
    sendAutoReply(data).then(ok => { results.autoReply = !!ok; }),
    notifyTeams(data).then(ok   => { results.teams     = !!ok; }),
  ]);

  settled.forEach((s, i) => {
    if (s.status === "rejected") {
      const label = ["sheet", "email", "autoReply", "teams"][i];
      console.error(`[Handler] ${label} threw:`, s.reason?.message || s.reason);
    }
  });

  console.log("[Handler] Final results:", JSON.stringify(results));
  return res.status(200).json({ success: true, results });
};
