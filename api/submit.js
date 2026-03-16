"use strict";

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// ─── Google Sheets ────────────────────────────────────────────────────────────
async function appendToSheet(data) {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey  = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId     = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !sheetId) {
    console.warn("[Sheets] Missing env vars:", { clientEmail: !!clientEmail, privateKey: !!privateKey, sheetId: !!sheetId });
    return false;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

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

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:J",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    console.log("[Sheets] Row appended — updated range:", result.data.updates?.updatedRange);
    return true;
  } catch (e) {
    console.error("[Sheets] Error:", e.message);
    return false;
  }
}


// ─── Google Sheets — Diagnostic Results ──────────────────────────────────────
async function appendDiagnosticToSheet(data) {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey  = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId     = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !sheetId) {
    console.warn("[Sheets-Diag] Missing env vars — skipping");
    return false;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Parse answers from JSON string if needed
    let answers = data.diagnosticAnswers || {};
    if (typeof answers === "string") {
      try { answers = JSON.parse(answers); } catch(e) { answers = {}; }
    }

    const row = [
      new Date().toISOString(),
      data.email          || "",
      data.diagnosticScore !== undefined ? data.diagnosticScore : "",
      data.diagnosticLabel || "",
      answers.q1 || "", // Call logging behaviour
      answers.q2 || "", // Stage automation
      answers.q3 || "", // Pipeline review style
      answers.q4 || "", // Playbook location
      answers.q5 || "", // Forecast method
    ];

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Diagnostics!A:I",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    console.log("[Sheets-Diag] Diagnostic row appended:", result.data.updates?.updatedRange);
    return true;
  } catch (e) {
    console.error("[Sheets-Diag] Error:", e.message);
    return false;
  }
}

// ─── Teams Webhook ────────────────────────────────────────────────────────────
async function notifyTeams(data) {
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[Teams] TEAMS_WEBHOOK_URL not set — skipping");
    return false;
  }

  try {
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
            { type: "TextBlock", size: "Large", weight: "Bolder",
              text: isSubscribe ? "New Newsletter Subscriber" : "New Consultation Request" },
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
          actions: [{ type: "Action.OpenUrl", title: "Reply by Email", url: `mailto:${data.email}` }],
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
  } catch (e) {
    console.error("[Teams] Error:", e.message);
    return false;
  }
}

// ─── Gmail ────────────────────────────────────────────────────────────────────
function makeTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.warn("[Gmail] Missing env vars:", { user: !!user, pass: !!pass });
    return null;
  }
  return nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user, pass },
  });
}

async function sendTeamEmail(data) {
  const transport = makeTransport();
  if (!transport) return false;

  const notifyEmail = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER;
  const isSubscribe = data.formType === "subscribe";

  try {
    await transport.sendMail({
      from: `"Action Insights" <${process.env.GMAIL_USER}>`,
      to: notifyEmail,
      subject: isSubscribe
        ? `New subscriber: ${data.email}`
        : `New consultation — ${data.firstName} ${data.lastName}, ${data.company}`,
      html: isSubscribe
        ? `<h2 style="color:#C4420A">New Subscriber</h2><p><strong>Email:</strong> ${data.email}</p>`
        : `<div style="font-family:Arial,sans-serif;max-width:600px">
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
            <p style="margin-top:20px"><a href="mailto:${data.email}" style="background:#C4420A;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none">Reply to ${data.firstName}</a></p>
           </div>`,
    });
    console.log("[Gmail] Team email sent to", notifyEmail);
    return true;
  } catch (e) {
    console.error("[Gmail] Team email error:", e.message);
    return false;
  }
}

async function sendAutoReply(data) {
  if (!data.email || data.email.includes("example.com")) return false;
  const transport = makeTransport();
  if (!transport) return false;

  const isSubscribe = data.formType === "subscribe";
  const domain = process.env.SITE_URL || "https://your-site.vercel.app";

  try {
    await transport.sendMail({
      from: `"Action Insights" <${process.env.GMAIL_USER}>`,
      to: data.email,
      replyTo: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
      subject: isSubscribe ? "You're subscribed to Action Insights" : `We'll be in touch, ${data.firstName}`,
      html: isSubscribe
        ? `<div style="font-family:Georgia,serif;max-width:560px;line-height:1.7">
            <h2>You're in.</h2>
            <p>Thanks for subscribing. New articles land in your inbox as they're published.</p>
            <ul style="font-family:Arial,sans-serif;font-size:14px">
              <li><a href="${domain}/article-1" style="color:#C4420A">Are you using Salesforce as a CRUD app?</a></li>
              <li><a href="${domain}/article-2" style="color:#C4420A">Are your playbooks working?</a></li>
              <li><a href="${domain}/article-3" style="color:#C4420A">Should you rebuild or recommit?</a></li>
            </ul>
            <p style="color:#888;font-size:13px">— The Action Insights team</p>
           </div>`
        : `<div style="font-family:Georgia,serif;max-width:560px;line-height:1.7">
            <h2>Got it, ${data.firstName}.</h2>
            <p>We'll be in touch within one business day to schedule your 30-minute session.</p>
            <p>On the call: an honest read on platform vs adoption problem, and 2–3 specific next steps regardless of whether we work together.</p>
            <ul style="font-family:Arial,sans-serif;font-size:14px">
              <li><a href="${domain}/article-1" style="color:#C4420A">Are you using Salesforce as a CRUD app?</a></li>
              <li><a href="${domain}/article-2" style="color:#C4420A">Are your playbooks working?</a></li>
              <li><a href="${domain}/article-3" style="color:#C4420A">Should you rebuild or recommit?</a></li>
            </ul>
            <p style="color:#888;font-size:13px">— The Action Insights team<br><a href="https://actioncrm.io" style="color:#C4420A">actioncrm.io</a></p>
           </div>`,
    });
    console.log("[Gmail] Auto-reply sent to", data.email);
    return true;
  } catch (e) {
    console.error("[Gmail] Auto-reply error:", e.message);
    return false;
  }
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
    return res.status(400).json({ error: "Invalid JSON" });
  }

  if (!data || !data.email) return res.status(400).json({ error: "Email is required" });

  console.log("[Handler] Submission — type:", data.formType, "| email:", data.email);

  const results = { sheet: false, diagnostic: false, email: false, autoReply: false, teams: false };
  const isDiagnostic = data.formType === "diagnostic";

  const settled = await Promise.allSettled([
    (isDiagnostic
      ? appendDiagnosticToSheet(data)
      : appendToSheet(data)
    ).then(ok => { isDiagnostic ? (results.diagnostic = !!ok) : (results.sheet = !!ok); }),
    sendTeamEmail(data).then(ok => { results.email     = !!ok; }),
    sendAutoReply(data).then(ok => { results.autoReply = !!ok; }),
    notifyTeams(data).then(ok   => { results.teams     = !!ok; }),
  ]);

  settled.forEach((s, i) => {
    if (s.status === "rejected") {
      console.error(`[Handler] ${["sheet","email","autoReply","teams"][i]} threw:`, s.reason?.message);
    }
  });

  console.log("[Handler] Final results:", JSON.stringify(results));
  return res.status(200).json({ success: true, results });
};
