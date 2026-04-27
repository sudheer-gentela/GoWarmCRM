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

  // Log key format to help debug
  const keyPreview = privateKey ? privateKey.substring(0, 40).replace(/\n/g, "\\n") : "empty";
  console.log("[Sheets] Key preview:", keyPreview);

  try {
    // Sanitise key — handles escaped \n, literal newlines, and both PKCS8 + RSA formats
    const cleanKey = privateKey
      .replace(/\\n/g, "\n")   // escaped \n → real newline
      .replace(/\r/g, "")        // strip carriage returns
      .trim();

    const jwt = new google.auth.JWT({
      email: clientEmail,
      key: cleanKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    await jwt.authorize();
    const sheets = google.sheets({ version: "v4", auth: jwt });

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
    const cleanKey2 = privateKey
      .replace(/\\n/g, "\n")
      .replace(/\r/g, "")
      .trim();

    const jwt2 = new google.auth.JWT({
      email: clientEmail,
      key: cleanKey2,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    await jwt2.authorize();
    const sheets = google.sheets({ version: "v4", auth: jwt2 });

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
      from: `"GoWarmCRM" <${process.env.GMAIL_USER}>`,
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
  const domain = process.env.SITE_URL || "https://gowarmcrm.com/blog";

  try {
    await transport.sendMail({
      from: `"GoWarmCRM" <${process.env.GMAIL_USER}>`,
      to: data.email,
      replyTo: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
      subject: isSubscribe ? "You're subscribed to GoWarmCRM Insights" : `We'll be in touch, ${data.firstName}`,
      html: isSubscribe
        ? `<div style="font-family:Georgia,serif;max-width:560px;line-height:1.7">
            <h2>You're in.</h2>
            <p>Thanks for subscribing. New articles land in your inbox as they're published.</p>
            <ul style="font-family:Arial,sans-serif;font-size:14px">
              <li><a href="https://gowarmcrm.com/blog/is-your-crm-a-crud-app" style="color:#C4420A">Are you using Salesforce as a CRUD app?</a></li>
              <li><a href="https://gowarmcrm.com/blog/are-your-sales-playbooks-working" style="color:#C4420A">Are your playbooks working?</a></li>
              <li><a href="https://gowarmcrm.com/blog/crm-rebuild-or-recommit" style="color:#C4420A">Should you rebuild or recommit?</a></li>
            </ul>
            <p style="color:#888;font-size:13px">— The GoWarmCRM team<br><a href="https://gowarmcrm.com" style="color:#C4420A">gowarmcrm.com</a></p>
           </div>`
        : `<div style="font-family:Georgia,serif;max-width:560px;line-height:1.8;color:#1A1814">
            <p style="font-size:15px;color:#9B978F;margin:0 0 24px">GoWarmCRM · Demo Confirmation</p>
            <h2 style="font-family:Georgia,serif;font-size:24px;font-weight:700;color:#1A1814;margin:0 0 16px">You're booked in, ${data.firstName}.</h2>
            <p style="font-size:16px;color:#3D3A34;margin:0 0 16px">Thank you for reaching out — we're looking forward to showing you what GoWarmCRM can do.</p>
            <p style="font-size:16px;color:#3D3A34;margin:0 0 16px">On the call, we'll walk through a live demo tailored to your pipeline — showing you exactly how the action engine diagnoses deals, fires playbook triggers, and surfaces the next move for your team.</p>
            <p style="font-size:16px;color:#3D3A34;margin:0 0 24px">If you have specific requirements, use cases, or scenarios you'd like us to cover, we'd love to hear them in advance. Drop us a note at <a href="mailto:demo@gowarmcrm.com" style="color:#C4420A;text-decoration:none">demo@gowarmcrm.com</a> and we'll make sure the session is as relevant as possible.</p>
            <div style="background:#F3F1EC;border-left:4px solid #C4420A;padding:16px 20px;margin:0 0 28px;border-radius:0 6px 6px 0">
              <p style="font-size:14px;color:#6B6760;margin:0 0 4px;font-family:Arial,sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:1px">What to expect</p>
              <p style="font-size:15px;color:#3D3A34;margin:0 0 12px;font-family:Arial,sans-serif">30 minutes · Live demo · No slides, no pitch deck · Honest answers to your questions</p>
              <a href="https://calendar.app.google/VKeU3Q7mKpkwzZxX8" style="display:inline-block;background:#C4420A;color:#fff;padding:12px 24px;border-radius:4px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none">Book your demo slot →</a>
            </div>
            <p style="font-size:14px;color:#9B978F;margin:0 0 8px;font-family:Arial,sans-serif">In the meantime, these might be worth a read:</p>
            <ul style="font-family:Arial,sans-serif;font-size:14px;color:#3D3A34;padding-left:20px;margin:0 0 28px">
              <li style="margin-bottom:8px"><a href="https://gowarmcrm.com/blog/pipeline-deals-going-dark" style="color:#C4420A;text-decoration:none">Why your best deals go dark — and how to catch them</a></li>
              <li style="margin-bottom:8px"><a href="https://gowarmcrm.com/blog/are-your-sales-playbooks-working" style="color:#C4420A;text-decoration:none">Are your sales playbooks actually working?</a></li>
              <li style="margin-bottom:8px"><a href="https://gowarmcrm.com/blog/per-user-ai-settings-crm" style="color:#C4420A;text-decoration:none">Per-user AI settings: why one prompt doesn't fit your whole team</a></li>
            </ul>
            <p style="font-size:15px;color:#3D3A34;margin:0 0 4px">See you on the call.</p>
            <p style="font-size:15px;color:#3D3A34;margin:0 0 32px">— The GoWarmCRM team</p>
            <p style="font-size:12px;color:#9B978F;font-family:Arial,sans-serif;border-top:1px solid #E0DDD6;padding-top:16px;margin:0">
              <a href="https://gowarmcrm.com" style="color:#C4420A;text-decoration:none">gowarmcrm.com</a> &nbsp;·&nbsp;
              Questions? <a href="mailto:demo@gowarmcrm.com" style="color:#C4420A;text-decoration:none">demo@gowarmcrm.com</a>
            </p>
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
    // Skip email, auto-reply and Teams for diagnostics — no valid email address
    ...(isDiagnostic ? [] : [
      sendTeamEmail(data).then(ok => { results.email     = !!ok; }),
      sendAutoReply(data).then(ok => { results.autoReply = !!ok; }),
      notifyTeams(data).then(ok   => { results.teams     = !!ok; }),
    ]),
  ]);

  settled.forEach((s, i) => {
    if (s.status === "rejected") {
      console.error(`[Handler] ${["sheet","email","autoReply","teams"][i]} threw:`, s.reason?.message);
    }
  });

  console.log("[Handler] Final results:", JSON.stringify(results));
  return res.status(200).json({ success: true, results });
};
