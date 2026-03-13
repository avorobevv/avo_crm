export function renderCrmPage(): string {
  return String.raw`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Relationship CRM</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4efe6;
        --panel: rgba(255, 252, 246, 0.84);
        --text: #1f2430;
        --muted: #626d7f;
        --line: rgba(43, 52, 69, 0.12);
        --accent: #bf5a36;
        --accent-deep: #923e20;
        --accent-soft: rgba(191, 90, 54, 0.12);
        --sage: #5f7661;
        --gold: #c9922e;
        --danger: #a13a31;
        --shadow: 0 24px 80px rgba(58, 44, 28, 0.14);
        --radius-xl: 28px;
        --radius-lg: 20px;
        --radius-md: 14px;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: "Avenir Next", "Segoe UI", sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(201, 146, 46, 0.18), transparent 30%),
          radial-gradient(circle at top right, rgba(95, 118, 97, 0.16), transparent 28%),
          linear-gradient(160deg, #f6f1e9 0%, #efe5d6 48%, #f8f3ec 100%);
      }

      body::before,
      body::after {
        content: "";
        position: fixed;
        border-radius: 999px;
        filter: blur(8px);
        pointer-events: none;
        z-index: 0;
      }

      body::before {
        width: 22rem;
        height: 22rem;
        right: -6rem;
        top: 5rem;
        background: rgba(191, 90, 54, 0.08);
      }

      body::after {
        width: 18rem;
        height: 18rem;
        left: -4rem;
        bottom: 3rem;
        background: rgba(95, 118, 97, 0.12);
      }

      .shell {
        position: relative;
        z-index: 1;
        width: min(1220px, calc(100% - 32px));
        margin: 0 auto;
        padding: 32px 0 56px;
      }

      .hero {
        display: grid;
        grid-template-columns: 1.35fr 0.9fr;
        gap: 20px;
        margin-bottom: 24px;
      }

      .hero-card,
      .panel,
      .stat,
      .contact-card,
      .empty-state {
        background: var(--panel);
        backdrop-filter: blur(14px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: var(--shadow);
      }

      .hero-card,
      .panel,
      .empty-state {
        border-radius: var(--radius-xl);
      }

      .hero-card {
        padding: 30px;
      }

      .hero-card h1 {
        margin: 0;
        font-family: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif;
        font-size: clamp(2.4rem, 4vw, 4.5rem);
        line-height: 0.96;
        letter-spacing: -0.04em;
      }

      .hero-card p {
        max-width: 60ch;
        font-size: 1rem;
        line-height: 1.6;
        color: var(--muted);
        margin: 18px 0 0;
      }

      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: 999px;
        font-size: 0.85rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--accent-deep);
        background: var(--accent-soft);
      }

      .hero-badge::before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: var(--accent);
      }

      .hero-side {
        padding: 24px;
        background:
          linear-gradient(180deg, rgba(255, 250, 241, 0.92), rgba(255, 250, 241, 0.74)),
          linear-gradient(135deg, rgba(95, 118, 97, 0.16), rgba(191, 90, 54, 0.1));
      }

      .hero-side h2,
      .panel h2 {
        margin: 0 0 10px;
        font-size: 1rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .hero-side ul {
        padding-left: 18px;
        margin: 16px 0 0;
        color: var(--muted);
        line-height: 1.7;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      .stat {
        border-radius: var(--radius-lg);
        padding: 18px;
      }

      .stat-label {
        font-size: 0.82rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--muted);
      }

      .stat-value {
        margin-top: 8px;
        font-size: 2rem;
        font-weight: 600;
      }

      .layout {
        display: grid;
        grid-template-columns: minmax(320px, 390px) minmax(0, 1fr);
        gap: 20px;
        align-items: start;
      }

      .workspace {
        display: grid;
        gap: 20px;
      }

      .panel {
        padding: 22px;
      }

      form {
        display: grid;
        gap: 18px;
      }

      .section-grid {
        display: grid;
        gap: 14px;
      }

      .field-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      label {
        display: grid;
        gap: 8px;
        font-size: 0.92rem;
        color: var(--muted);
      }

      .required {
        color: var(--accent-deep);
      }

      input,
      select,
      textarea {
        width: 100%;
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 12px 14px;
        font: inherit;
        color: var(--text);
        background: rgba(255, 255, 255, 0.88);
        transition: border-color 180ms ease, box-shadow 180ms ease;
      }

      textarea {
        min-height: 110px;
        resize: vertical;
      }

      input:focus,
      select:focus,
      textarea:focus {
        outline: none;
        border-color: rgba(191, 90, 54, 0.55);
        box-shadow: 0 0 0 4px rgba(191, 90, 54, 0.12);
      }

      .checkbox-panel {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 14px;
        border-radius: 14px;
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.5);
      }

      .check {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 22px;
        font-size: 0.92rem;
        color: var(--text);
      }

      .check input {
        width: 18px;
        height: 18px;
        min-width: 18px;
        min-height: 18px;
        margin: 0;
        flex: 0 0 18px;
      }

      .check span {
        display: block;
        line-height: 1.2;
      }

      .actions,
      .detail-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .helper {
        font-size: 0.88rem;
        color: var(--muted);
      }

      button {
        border: none;
        border-radius: 999px;
        padding: 13px 18px;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
        color: white;
        background: linear-gradient(135deg, var(--accent), var(--accent-deep));
        box-shadow: 0 14px 26px rgba(146, 62, 32, 0.24);
        transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
      }

      button:hover {
        transform: translateY(-1px);
        box-shadow: 0 18px 34px rgba(146, 62, 32, 0.26);
      }

      button:disabled {
        opacity: 0.72;
        cursor: wait;
      }

      .button-ghost {
        color: var(--text);
        background: rgba(31, 36, 48, 0.06);
        box-shadow: none;
      }

      .button-danger {
        background: linear-gradient(135deg, var(--danger), #7c261f);
        box-shadow: 0 14px 26px rgba(124, 38, 31, 0.22);
      }

      .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
      }

      .toolbar p {
        margin: 0;
        color: var(--muted);
      }

      .list {
        display: grid;
        gap: 14px;
      }

      .contact-card {
        border-radius: 22px;
        padding: 18px;
        cursor: pointer;
        transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
      }

      .contact-card:hover {
        transform: translateY(-1px);
      }

      .contact-card.selected {
        border-color: rgba(191, 90, 54, 0.35);
        background: rgba(255, 247, 238, 0.95);
      }

      .contact-head {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: start;
      }

      .contact-head h3 {
        margin: 0;
        font-size: 1.1rem;
      }

      .contact-meta {
        color: var(--muted);
        font-size: 0.92rem;
        margin-top: 6px;
      }

      .due-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 999px;
        font-size: 0.82rem;
        font-weight: 600;
        white-space: nowrap;
      }

      .due-pill.overdue {
        background: rgba(191, 90, 54, 0.14);
        color: var(--accent-deep);
      }

      .due-pill.soon {
        background: rgba(201, 146, 46, 0.16);
        color: #8a6116;
      }

      .due-pill.steady {
        background: rgba(95, 118, 97, 0.15);
        color: #426046;
      }

      .stack {
        display: grid;
        gap: 12px;
        margin-top: 16px;
      }

      .chips {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 32px;
        padding: 7px 11px;
        border-radius: 999px;
        background: rgba(31, 36, 48, 0.06);
        color: var(--text);
        font-size: 0.82rem;
        white-space: nowrap;
      }

      .metric-chip {
        min-width: 140px;
      }

      .chip.priority-high {
        background: rgba(191, 90, 54, 0.14);
        color: var(--accent-deep);
      }

      .chip.priority-medium {
        background: rgba(201, 146, 46, 0.16);
        color: #8a6116;
      }

      .chip.priority-low {
        background: rgba(95, 118, 97, 0.16);
        color: #426046;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px 14px;
      }

      .detail {
        padding-top: 12px;
        border-top: 1px solid rgba(43, 52, 69, 0.08);
      }

      .detail-label {
        display: block;
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--muted);
      }

      .detail-value {
        display: block;
        margin-top: 6px;
        line-height: 1.5;
      }

      .detail-shell {
        display: grid;
        gap: 18px;
      }

      .detail-header {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 16px;
      }

      .detail-header h3 {
        margin: 0;
        font-size: 1.5rem;
      }

      .detail-subtitle {
        margin-top: 8px;
        color: var(--muted);
      }

      .history-list {
        display: grid;
        gap: 10px;
      }

      .history-item {
        padding: 12px 14px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.58);
        border: 1px solid rgba(43, 52, 69, 0.08);
      }

      .history-item strong {
        display: block;
        font-size: 0.92rem;
      }

      .history-item span {
        display: block;
        margin-top: 4px;
        color: var(--muted);
        line-height: 1.45;
        font-size: 0.88rem;
      }

      .status {
        min-height: 22px;
        margin-top: 6px;
        font-size: 0.9rem;
      }

      .status.error {
        color: #a72d2d;
      }

      .status.success {
        color: #356844;
      }

      .footnote {
        margin-top: 18px;
        font-size: 0.84rem;
        color: var(--muted);
      }

      .empty-state {
        padding: 32px;
        text-align: center;
      }

      .hidden {
        display: none;
      }

      @media (max-width: 980px) {
        .hero,
        .layout {
          grid-template-columns: 1fr;
        }

        .stats {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 700px) {
        .shell {
          width: min(100% - 20px, 100%);
          padding-top: 18px;
        }

        .hero-card,
        .hero-side,
        .panel,
        .empty-state {
          padding: 18px;
        }

        .stats,
        .field-grid,
        .detail-grid,
        .checkbox-panel {
          grid-template-columns: 1fr;
        }

        .contact-head,
        .actions,
        .detail-actions,
        .detail-header,
        .toolbar {
          flex-direction: column;
          align-items: stretch;
        }

        .metric-chip {
          min-width: 0;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        <article class="hero-card">
          <span class="hero-badge">Relationship CRM</span>
          <h1>Keep your people warm, not just your pipeline.</h1>
          <p>
            A simple, clean workspace for tracking personal and business relationships. Capture who
            they are, how you know them, when you last reached out, and who needs follow-up next.
          </p>
        </article>
        <aside class="hero-card hero-side">
          <h2>What this version is built for</h2>
          <ul>
            <li>Quick entry for contacts without heavy CRM overhead</li>
            <li>Focused detail view for editing a person, not just scanning a list</li>
            <li>Interaction history so follow-ups become a timeline instead of one overwritten date</li>
          </ul>
        </aside>
      </section>

      <section class="stats" id="stats">
        <article class="stat">
          <div class="stat-label">Total contacts</div>
          <div class="stat-value" data-stat="total">0</div>
        </article>
        <article class="stat">
          <div class="stat-label">Overdue follow-ups</div>
          <div class="stat-value" data-stat="overdue">0</div>
        </article>
        <article class="stat">
          <div class="stat-label">Due this week</div>
          <div class="stat-value" data-stat="dueThisWeek">0</div>
        </article>
        <article class="stat">
          <div class="stat-label">Birthdays soon</div>
          <div class="stat-value" data-stat="upcomingBirthdays">0</div>
        </article>
      </section>

      <section class="layout">
        <section class="panel">
          <h2>Add Contact</h2>
          <form id="contact-form">
            <div class="section-grid">
              <div class="field-grid">
                <label>
                  First name <span class="required">*</span>
                  <input name="firstName" required maxlength="100" placeholder="Jordan" />
                </label>
                <label>
                  Last name <span class="required">*</span>
                  <input name="lastName" required maxlength="100" placeholder="Lee" />
                </label>
              </div>

              <div class="field-grid">
                <label>
                  Birthdate
                  <input name="birthdate" type="date" />
                </label>
                <label>
                  Location
                  <input name="location" maxlength="120" placeholder="Chicago, IL" />
                </label>
              </div>

              <div class="field-grid">
                <label>
                  Last time I reached out
                  <input name="lastContactedAt" type="date" />
                </label>
                <label>
                  Next time I reach out
                  <input name="nextContactAt" type="date" />
                </label>
              </div>
            </div>

            <div class="section-grid">
              <label>
                How we are connected
                <div class="checkbox-panel">
                  <label class="check"><input type="checkbox" name="connectionTypes" value="friend" /><span>Friend</span></label>
                  <label class="check"><input type="checkbox" name="connectionTypes" value="family friend" /><span>Family friend</span></label>
                  <label class="check"><input type="checkbox" name="connectionTypes" value="networking acquaintance" /><span>Networking</span></label>
                  <label class="check"><input type="checkbox" name="connectionTypes" value="business partner" /><span>Business partner</span></label>
                  <label class="check"><input type="checkbox" name="connectionTypes" value="customer" /><span>Customer</span></label>
                </div>
              </label>
            </div>

            <div class="section-grid">
              <div class="field-grid">
                <label>
                  Company / organization
                  <input name="company" maxlength="120" placeholder="Northwind Studio" />
                </label>
                <label>
                  Role / title
                  <input name="title" maxlength="120" placeholder="Founder" />
                </label>
              </div>

              <div class="field-grid">
                <label>
                  Email
                  <input name="email" type="email" placeholder="name@example.com" />
                </label>
                <label>
                  Phone
                  <input name="phone" maxlength="40" placeholder="(312) 555-0102" />
                </label>
              </div>

              <div class="field-grid">
                <label>
                  Preferred contact method
                  <select name="preferredContactMethod">
                    <option value="">Select one</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="text">Text</option>
                    <option value="social">Social</option>
                    <option value="in-person">In-person</option>
                  </select>
                </label>
                <label>
                  Priority
                  <select name="priority">
                    <option value="">Select one</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </label>
              </div>
            </div>

            <div class="section-grid">
              <label>
                Last interaction summary
                <input
                  name="lastInteractionSummary"
                  maxlength="280"
                  placeholder="Met at the chamber breakfast and discussed a referral intro."
                />
              </label>
              <label>
                Notes
                <textarea
                  name="notes"
                  maxlength="2000"
                  placeholder="Personal details, reminders, open loops, interests, family, client context..."
                ></textarea>
              </label>
            </div>

            <div class="actions">
              <div class="helper">Required only: first and last name. Everything else is optional.</div>
              <button type="submit" id="submit-button">Save contact</button>
            </div>
            <div class="status" id="form-status" aria-live="polite"></div>
            <div class="footnote">Contacts are stored in SQLite, so they persist across server restarts.</div>
          </form>
        </section>

        <section class="workspace">
          <section class="panel" id="detail-panel">
            <h2>Contact Detail</h2>
            <div class="empty-state">
              <h3>No contact selected</h3>
              <p>Select a person from the relationship board to edit their profile, review history, or delete them.</p>
            </div>
          </section>

          <section class="panel">
            <div class="toolbar">
              <div>
                <h2>Relationship Board</h2>
                <p>Contacts are sorted by next follow-up so your warmest next actions stay visible.</p>
              </div>
            </div>
            <div class="list" id="contact-list"></div>
            <div class="empty-state hidden" id="empty-state">
              <h3>No contacts yet</h3>
              <p>Add your first person on the left and the relationship board will populate here.</p>
            </div>
          </section>
        </section>
      </section>
    </main>

    <script>
      const state = {
        contacts: [],
        selectedContactId: null,
        detailMessage: "",
        detailTone: "",
      };

      const form = document.getElementById("contact-form");
      const submitButton = document.getElementById("submit-button");
      const formStatus = document.getElementById("form-status");
      const contactList = document.getElementById("contact-list");
      const emptyState = document.getElementById("empty-state");
      const detailPanel = document.getElementById("detail-panel");
      const statNodes = document.querySelectorAll("[data-stat]");

      const formatDate = (value) => {
        if (!value) {
          return "Not set";
        }

        return new Date(value + "T00:00:00").toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      };

      const todayInputValue = () => new Date().toISOString().slice(0, 10);

      const titleCase = (value) =>
        value
          .split(" ")
          .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
          .join(" ");

      const escapeHtml = (value) =>
        String(value)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#39;");

      const dueState = (nextContactAt) => {
        if (!nextContactAt) {
          return { label: "No follow-up set", tone: "steady" };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const next = new Date(nextContactAt + "T00:00:00");
        const diffDays = Math.round((next - today) / 86400000);

        if (diffDays < 0) {
          return { label: "Overdue follow-up", tone: "overdue" };
        }

        if (diffDays <= 7) {
          return { label: "Due within a week", tone: "soon" };
        }

        return { label: "Follow-up scheduled", tone: "steady" };
      };

      const setFormStatus = (message, tone) => {
        formStatus.textContent = message;
        formStatus.className = tone ? "status " + tone : "status";
      };

      const setDetailStatus = (message, tone) => {
        state.detailMessage = message;
        state.detailTone = tone;
        renderDetail();
      };

      const renderStats = (summary) => {
        statNodes.forEach((node) => {
          const key = node.dataset.stat;
          node.textContent = String(summary[key] ?? 0);
        });
      };

      const selectedContact = () =>
        state.contacts.find((contact) => contact.id === state.selectedContactId) || null;

      const buildConnectionCheckboxes = (selected) => {
        const values = selected || [];
        const options = [
          ["friend", "Friend"],
          ["family friend", "Family friend"],
          ["networking acquaintance", "Networking"],
          ["business partner", "Business partner"],
          ["customer", "Customer"],
        ];

        return options
          .map(([value, label]) => {
            const checked = values.includes(value) ? ' checked="checked"' : "";
            return (
              '<label class="check">' +
              '<input type="checkbox" name="connectionTypes" value="' +
              escapeHtml(value) +
              '"' +
              checked +
              " />" +
              "<span>" +
              escapeHtml(label) +
              "</span>" +
              "</label>"
            );
          })
          .join("");
      };

      const renderBoard = () => {
        contactList.innerHTML = "";
        emptyState.classList.toggle("hidden", state.contacts.length > 0);

        state.contacts.forEach((contact) => {
          const card = document.createElement("article");
          const due = dueState(contact.nextContactAt);
          const metaLine = [contact.title, contact.company].filter(Boolean).join(" at ");
          const chips = [];

          (contact.connectionTypes || []).forEach((type) => {
            chips.push('<span class="chip">' + escapeHtml(titleCase(type)) + "</span>");
          });

          if (contact.preferredContactMethod) {
            chips.push(
              '<span class="chip metric-chip">' +
                escapeHtml(titleCase(contact.preferredContactMethod.replace("-", " "))) +
                "</span>",
            );
          }

          if (contact.priority) {
            chips.push(
              '<span class="chip metric-chip priority-' +
                contact.priority +
                '">' +
                escapeHtml(titleCase(contact.priority)) +
                "</span>",
            );
          }

          card.className =
            "contact-card" + (contact.id === state.selectedContactId ? " selected" : "");
          card.dataset.contactId = contact.id;
          card.innerHTML =
            '<div class="contact-head">' +
              "<div>" +
                "<h3>" +
                escapeHtml(contact.fullName) +
                "</h3>" +
                '<div class="contact-meta">' +
                escapeHtml(metaLine || "Relationship details still taking shape") +
                "</div>" +
              "</div>" +
              '<div class="due-pill ' +
              due.tone +
              '">' +
              escapeHtml(due.label) +
              "</div>" +
            "</div>" +
            '<div class="stack">' +
              '<div class="chips">' +
              (chips.join("") || '<span class="chip">Uncategorized</span>') +
              "</div>" +
              '<div class="detail-grid">' +
                '<div class="detail">' +
                  '<span class="detail-label">Last reached out</span>' +
                  '<span class="detail-value">' +
                  escapeHtml(formatDate(contact.lastContactedAt)) +
                  "</span>" +
                "</div>" +
                '<div class="detail">' +
                  '<span class="detail-label">Next reach-out</span>' +
                  '<span class="detail-value">' +
                  escapeHtml(formatDate(contact.nextContactAt)) +
                  "</span>" +
                "</div>" +
              "</div>" +
            "</div>";

          contactList.appendChild(card);
        });
      };

      const renderDetail = () => {
        const contact = selectedContact();

        if (!contact) {
          detailPanel.innerHTML =
            "<h2>Contact Detail</h2>" +
            '<div class="empty-state">' +
              "<h3>No contact selected</h3>" +
              "<p>Select a person from the relationship board to edit their profile, review history, or delete them.</p>" +
            "</div>";
          return;
        }

        const chips = [];
        (contact.connectionTypes || []).forEach((type) => {
          chips.push('<span class="chip">' + escapeHtml(titleCase(type)) + "</span>");
        });

        if (contact.preferredContactMethod) {
          chips.push(
            '<span class="chip metric-chip">' +
              escapeHtml(titleCase(contact.preferredContactMethod.replace("-", " "))) +
              "</span>",
          );
        }

        if (contact.priority) {
          chips.push(
            '<span class="chip metric-chip priority-' +
              contact.priority +
              '">' +
              escapeHtml(titleCase(contact.priority)) +
              "</span>",
          );
        }

        const historyItems = (contact.interactionHistory || [])
          .map((interaction) => {
            const nextLine = interaction.nextContactAt
              ? interaction.nextContactSource === "suggested"
                ? "Auto-scheduled next touch for " +
                  formatDate(interaction.nextContactAt) +
                  " (" +
                  interaction.suggestedCadenceDays +
                  " days)."
                : "Manually set next touch for " + formatDate(interaction.nextContactAt) + "."
              : "No next touch date was set.";

            return (
              '<div class="history-item">' +
                "<strong>" +
                escapeHtml(formatDate(interaction.interactionDate)) +
                "</strong>" +
                "<span>" +
                escapeHtml(interaction.summary || "Follow-up logged.") +
                "</span>" +
                "<span>" +
                escapeHtml(nextLine) +
                "</span>" +
              "</div>"
            );
          })
          .join("");

        detailPanel.innerHTML =
          "<h2>Contact Detail</h2>" +
          '<div class="detail-shell">' +
            '<div class="detail-header">' +
              "<div>" +
                "<h3>" +
                escapeHtml(contact.fullName) +
                "</h3>" +
                '<div class="detail-subtitle">' +
                escapeHtml([contact.title, contact.company].filter(Boolean).join(" at ") || "Relationship CRM record") +
                "</div>" +
              "</div>" +
              '<div class="detail-actions">' +
                '<button type="button" class="button-danger" id="delete-contact-button" data-contact-id="' +
                  escapeHtml(contact.id) +
                  '">Delete contact</button>' +
              "</div>" +
            "</div>" +
            '<div class="chips">' +
              (chips.join("") || '<span class="chip">Uncategorized</span>') +
            "</div>" +
            '<div class="detail-grid">' +
              '<div class="detail"><span class="detail-label">Last reached out</span><span class="detail-value">' +
                escapeHtml(formatDate(contact.lastContactedAt)) +
              '</span></div>' +
              '<div class="detail"><span class="detail-label">Next reach-out</span><span class="detail-value">' +
                escapeHtml(formatDate(contact.nextContactAt)) +
              '</span></div>' +
              '<div class="detail"><span class="detail-label">Birthdate</span><span class="detail-value">' +
                escapeHtml(formatDate(contact.birthdate)) +
              '</span></div>' +
              '<div class="detail"><span class="detail-label">Location</span><span class="detail-value">' +
                escapeHtml(contact.location || "Not set") +
              '</span></div>' +
            "</div>" +
            '<form id="edit-contact-form" data-contact-id="' +
              escapeHtml(contact.id) +
              '">' +
              '<div class="section-grid">' +
                '<div class="field-grid">' +
                  '<label>First name <span class="required">*</span><input name="firstName" required maxlength="100" value="' +
                    escapeHtml(contact.firstName) +
                    '" /></label>' +
                  '<label>Last name <span class="required">*</span><input name="lastName" required maxlength="100" value="' +
                    escapeHtml(contact.lastName) +
                    '" /></label>' +
                "</div>" +
                '<div class="field-grid">' +
                  '<label>Birthdate<input name="birthdate" type="date" value="' +
                    escapeHtml(contact.birthdate || "") +
                    '" /></label>' +
                  '<label>Location<input name="location" maxlength="120" value="' +
                    escapeHtml(contact.location || "") +
                    '" /></label>' +
                "</div>" +
                '<div class="field-grid">' +
                  '<label>Last time I reached out<input name="lastContactedAt" type="date" value="' +
                    escapeHtml(contact.lastContactedAt || "") +
                    '" /></label>' +
                  '<label>Next time I reach out<input name="nextContactAt" type="date" value="' +
                    escapeHtml(contact.nextContactAt || "") +
                    '" /></label>' +
                "</div>" +
                '<label>How we are connected<div class="checkbox-panel">' +
                  buildConnectionCheckboxes(contact.connectionTypes) +
                "</div></label>" +
                '<div class="field-grid">' +
                  '<label>Company / organization<input name="company" maxlength="120" value="' +
                    escapeHtml(contact.company || "") +
                    '" /></label>' +
                  '<label>Role / title<input name="title" maxlength="120" value="' +
                    escapeHtml(contact.title || "") +
                    '" /></label>' +
                "</div>" +
                '<div class="field-grid">' +
                  '<label>Email<input name="email" type="email" value="' +
                    escapeHtml(contact.email || "") +
                    '" /></label>' +
                  '<label>Phone<input name="phone" maxlength="40" value="' +
                    escapeHtml(contact.phone || "") +
                    '" /></label>' +
                "</div>" +
                '<div class="field-grid">' +
                  '<label>Preferred contact method<select name="preferredContactMethod">' +
                    '<option value="">Select one</option>' +
                    '<option value="email"' +
                      (contact.preferredContactMethod === "email" ? ' selected="selected"' : "") +
                    '>Email</option>' +
                    '<option value="phone"' +
                      (contact.preferredContactMethod === "phone" ? ' selected="selected"' : "") +
                    '>Phone</option>' +
                    '<option value="text"' +
                      (contact.preferredContactMethod === "text" ? ' selected="selected"' : "") +
                    '>Text</option>' +
                    '<option value="social"' +
                      (contact.preferredContactMethod === "social" ? ' selected="selected"' : "") +
                    '>Social</option>' +
                    '<option value="in-person"' +
                      (contact.preferredContactMethod === "in-person" ? ' selected="selected"' : "") +
                    '>In-person</option>' +
                  "</select></label>" +
                  '<label>Priority<select name="priority">' +
                    '<option value="">Select one</option>' +
                    '<option value="high"' +
                      (contact.priority === "high" ? ' selected="selected"' : "") +
                    '>High</option>' +
                    '<option value="medium"' +
                      (contact.priority === "medium" ? ' selected="selected"' : "") +
                    '>Medium</option>' +
                    '<option value="low"' +
                      (contact.priority === "low" ? ' selected="selected"' : "") +
                    '>Low</option>' +
                  "</select></label>" +
                "</div>" +
                '<label>Last interaction summary<input name="lastInteractionSummary" maxlength="280" value="' +
                  escapeHtml(contact.lastInteractionSummary || "") +
                  '" /></label>' +
                '<label>Notes<textarea name="notes" maxlength="2000">' +
                  escapeHtml(contact.notes || "") +
                "</textarea></label>" +
              "</div>" +
              '<div class="actions">' +
                '<div class="helper">Editing here updates the current contact record. Logging a follow-up below adds to history.</div>' +
                '<button type="submit">Save changes</button>' +
              "</div>" +
            "</form>" +
            '<div class="status ' +
              escapeHtml(state.detailTone) +
              '" id="detail-status">' +
              escapeHtml(state.detailMessage || "") +
            "</div>" +
            '<form id="interaction-form" data-contact-id="' +
              escapeHtml(contact.id) +
              '">' +
              '<div class="section-grid">' +
                '<div class="field-grid">' +
                  '<label>Follow-up date<input name="interactionDate" type="date" value="' +
                    todayInputValue() +
                    '" required /></label>' +
                  '<label>Next update date<input name="nextContactAt" type="date" /></label>' +
                "</div>" +
                '<label>Follow-up note<input name="summary" maxlength="280" placeholder="What happened, what matters, what changed?" /></label>' +
              "</div>" +
              '<div class="actions">' +
                '<div class="helper">Leave next update date blank and the CRM will suggest one from connection type and priority.</div>' +
                '<button type="submit">Log follow-up</button>' +
              "</div>" +
            "</form>" +
            '<div class="detail">' +
              '<span class="detail-label">Interaction history</span>' +
              '<div class="history-list">' +
                (historyItems || '<div class="history-item"><strong>No follow-ups logged yet</strong><span>Your follow-up history will start building here.</span></div>') +
              "</div>" +
            "</div>" +
          "</div>";
      };

      const replaceContact = (contact) => {
        const index = state.contacts.findIndex((item) => item.id === contact.id);
        if (index === -1) {
          state.contacts.unshift(contact);
        } else {
          state.contacts[index] = contact;
        }
      };

      const fetchContacts = async (preferredSelectedId) => {
        const response = await fetch("/api/contacts");
        if (!response.ok) {
          throw new Error("Failed to load contacts");
        }

        const payload = await response.json();
        state.contacts = payload.items;
        renderStats(payload.summary);

        const targetId =
          preferredSelectedId ||
          (state.selectedContactId &&
          state.contacts.some((contact) => contact.id === state.selectedContactId)
            ? state.selectedContactId
            : state.contacts[0]?.id || null);

        state.selectedContactId = targetId || null;
        renderBoard();
        renderDetail();
      };

      const fetchContact = async (contactId) => {
        const response = await fetch("/api/contacts/" + encodeURIComponent(contactId));
        if (!response.ok) {
          throw new Error("Failed to load contact detail");
        }

        const contact = await response.json();
        replaceContact(contact);
        state.selectedContactId = contact.id;
        renderBoard();
        renderDetail();
      };

      const createPayloadFromForm = (formNode, mode) => {
        const formData = new FormData(formNode);
        const payload = {
          firstName: String(formData.get("firstName") || "").trim(),
          lastName: String(formData.get("lastName") || "").trim(),
          birthdate: String(formData.get("birthdate") || "").trim(),
          lastContactedAt: String(formData.get("lastContactedAt") || "").trim(),
          nextContactAt: String(formData.get("nextContactAt") || "").trim(),
          company: String(formData.get("company") || "").trim(),
          title: String(formData.get("title") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
          location: String(formData.get("location") || "").trim(),
          preferredContactMethod: String(formData.get("preferredContactMethod") || "").trim(),
          priority: String(formData.get("priority") || "").trim(),
          notes: String(formData.get("notes") || "").trim(),
          lastInteractionSummary: String(formData.get("lastInteractionSummary") || "").trim(),
          connectionTypes: formData.getAll("connectionTypes").map(String),
        };

        Object.keys(payload).forEach((key) => {
          const value = payload[key];

          if (mode === "create") {
            if (value === "" || (Array.isArray(value) && value.length === 0)) {
              delete payload[key];
            }
            return;
          }

          if (Array.isArray(value)) {
            payload[key] = value;
            return;
          }

          if (key === "firstName" || key === "lastName") {
            return;
          }

          payload[key] = value === "" ? null : value;
        });

        return payload;
      };

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        setFormStatus("", "");
        submitButton.disabled = true;
        submitButton.textContent = "Saving...";

        try {
          const response = await fetch("/api/contacts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(createPayloadFromForm(form, "create")),
          });

          if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.message || "Could not save this contact.");
          }

          const contact = await response.json();
          form.reset();
          setFormStatus("Contact saved. The relationship board is up to date.", "success");
          state.detailMessage = "";
          state.detailTone = "";
          await fetchContacts(contact.id);
        } catch (error) {
          setFormStatus(error.message || "Something went wrong while saving.", "error");
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = "Save contact";
        }
      });

      contactList.addEventListener("click", async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }

        const card = target.closest(".contact-card");
        if (!card || !card.dataset.contactId) {
          return;
        }

        state.detailMessage = "";
        state.detailTone = "";
        state.selectedContactId = card.dataset.contactId;
        renderBoard();
        renderDetail();

        try {
          await fetchContact(card.dataset.contactId);
        } catch (error) {
          setDetailStatus(error.message || "Could not load this contact.", "error");
        }
      });

      document.addEventListener("submit", async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLFormElement)) {
          return;
        }

        if (target.id === "edit-contact-form") {
          event.preventDefault();
          const contactId = target.dataset.contactId;
          if (!contactId) {
            return;
          }

          const button = target.querySelector('button[type="submit"]');
          if (button) {
            button.disabled = true;
            button.textContent = "Saving...";
          }

          try {
            const response = await fetch("/api/contacts/" + encodeURIComponent(contactId), {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(createPayloadFromForm(target, "edit")),
            });

            if (!response.ok) {
              const body = await response.json().catch(() => ({}));
              throw new Error(body.message || "Could not update this contact.");
            }

            const contact = await response.json();
            replaceContact(contact);
            state.selectedContactId = contact.id;
            await fetchContacts(contact.id);
            setDetailStatus("Contact updated.", "success");
          } catch (error) {
            setDetailStatus(error.message || "Could not update this contact.", "error");
          } finally {
            if (button) {
              button.disabled = false;
              button.textContent = "Save changes";
            }
          }
        }

        if (target.id === "interaction-form") {
          event.preventDefault();
          const contactId = target.dataset.contactId;
          if (!contactId) {
            return;
          }

          const button = target.querySelector('button[type="submit"]');
          if (button) {
            button.disabled = true;
            button.textContent = "Saving...";
          }

          const formData = new FormData(target);
          const payload = {
            interactionDate: String(formData.get("interactionDate") || "").trim(),
            nextContactAt: String(formData.get("nextContactAt") || "").trim(),
            summary: String(formData.get("summary") || "").trim(),
          };

          Object.keys(payload).forEach((key) => {
            if (payload[key] === "") {
              delete payload[key];
            }
          });

          try {
            const response = await fetch("/api/contacts/" + encodeURIComponent(contactId) + "/interactions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            if (!response.ok) {
              const body = await response.json().catch(() => ({}));
              throw new Error(body.message || "Could not log the follow-up.");
            }

            const result = await response.json();
            replaceContact(result.contact);
            await fetchContacts(contactId);
            setDetailStatus(
              result.interaction.nextContactSource === "suggested"
                ? "Follow-up logged. The next touch date was auto-scheduled."
                : "Follow-up logged and next touch updated.",
              "success",
            );
          } catch (error) {
            setDetailStatus(error.message || "Could not log the follow-up.", "error");
          } finally {
            if (button) {
              button.disabled = false;
              button.textContent = "Log follow-up";
            }
          }
        }
      });

      document.addEventListener("click", async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }

        if (target.id !== "delete-contact-button") {
          return;
        }

        const contactId = target.dataset.contactId;
        if (!contactId) {
          return;
        }

        if (!window.confirm("Delete this contact and all follow-up history?")) {
          return;
        }

        target.setAttribute("disabled", "disabled");

        try {
          const response = await fetch("/api/contacts/" + encodeURIComponent(contactId), {
            method: "DELETE",
          });

          if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.message || "Could not delete this contact.");
          }

          state.selectedContactId = null;
          state.detailMessage = "";
          state.detailTone = "";
          await fetchContacts();
        } catch (error) {
          setDetailStatus(error.message || "Could not delete this contact.", "error");
        } finally {
          target.removeAttribute("disabled");
        }
      });

      fetchContacts().catch(() => {
        setFormStatus("The CRM loaded, but contacts could not be fetched.", "error");
      });
    </script>
  </body>
</html>`;
}
