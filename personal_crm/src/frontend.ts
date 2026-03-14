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
        --input-bg: rgba(255, 255, 255, 0.88);
        --card-hover: rgba(255, 247, 238, 0.95);
        --history-bg: rgba(255, 255, 255, 0.58);
      }

      [data-theme='dark'] {
        color-scheme: dark;
        --bg: #0b0e14;
        --panel: rgba(19, 23, 31, 0.88);
        --text: #f0f2f5;
        --muted: #949eb0;
        --line: rgba(255, 255, 255, 0.08);
        --accent: #4fc3f7; /* Light Blue */
        --accent-deep: #03a9f4;
        --accent-soft: rgba(79, 195, 247, 0.12);
        --sage: #81c784;
        --gold: #ffd54f;
        --danger: #ef5350;
        --shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
        --input-bg: rgba(30, 36, 48, 0.6);
        --card-hover: rgba(30, 36, 48, 0.8);
        --history-bg: rgba(30, 36, 48, 0.4);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: "Avenir Next", "Segoe UI", sans-serif;
        color: var(--text);
        background: var(--bg);
        background-attachment: fixed;
      }

      [data-theme='light'] body {
        background:
          radial-gradient(circle at top left, rgba(201, 146, 46, 0.18), transparent 30%),
          radial-gradient(circle at top right, rgba(95, 118, 97, 0.16), transparent 28%),
          linear-gradient(160deg, #f6f1e9 0%, #efe5d6 48%, #f8f3ec 100%);
      }

      [data-theme='dark'] body {
        background:
          radial-gradient(circle at top left, rgba(79, 195, 247, 0.08), transparent 35%),
          radial-gradient(circle at top right, rgba(3, 169, 244, 0.05), transparent 30%),
          #0b0e14;
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
        margin: 16px 0 20px 0;
        font-family: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif;
        font-size: clamp(2.4rem, 4vw, 4.5rem);
        line-height: 0.96;
        letter-spacing: -0.04em;
        text-transform: uppercase;
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

      .hero-desc {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out, opacity 0.3s ease-out, margin 0.3s ease-out;
        opacity: 0;
        margin: 0;
      }

      .hero-desc.expanded {
        max-height: 200px;
        opacity: 1;
        margin: 18px 0 0;
      }

      .desc-toggle {
        background: none;
        border: none;
        color: var(--accent);
        cursor: pointer;
        font-size: 0.9rem;
        padding: 0;
        margin-top: 12px;
        text-decoration: underline;
        font-weight: 500;
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
        background: var(--input-bg);
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
        background: var(--input-bg);
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
        opacity: 0.5;
        cursor: not-allowed;
      }

      .theme-toggle {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 999px;
        font-size: 0.88rem;
        background: var(--panel);
        color: var(--text);
        border: 1px solid var(--line);
        cursor: pointer;
        transition: background 180ms ease;
        box-shadow: none;
      }

      .theme-toggle:hover {
        background: var(--card-hover);
        transform: none;
        box-shadow: none;
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

      .search-box {
        position: relative;
        flex: 1;
        max-width: 320px;
      }

      .search-box input {
        padding-left: 40px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23626d7f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: 14px center;
      }

      .list {
        display: grid;
        gap: 14px;
      }

      .linkedin-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: #0077b5;
        color: white;
        transition: transform 160ms ease, opacity 160ms ease;
      }

      .linkedin-link:hover {
        transform: scale(1.05);
        opacity: 0.9;
      }

      .linkedin-link svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
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
        border-color: var(--accent);
        background: var(--card-hover);
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
        background: var(--accent-soft);
        color: var(--accent-deep);
      }

      .due-pill.soon {
        background: rgba(201, 146, 46, 0.16);
        color: var(--gold);
      }

      .due-pill.steady {
        background: rgba(95, 118, 97, 0.15);
        color: var(--sage);
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

      .tag-chip {
        background: var(--accent-soft);
        color: var(--accent);
        border: 1px solid var(--accent);
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .tag-chip.removable {
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .tag-chip.removable:hover {
        background: var(--danger);
        color: white;
        border-color: var(--danger);
      }

      .tag-input-wrapper {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }

      .tag-input-wrapper input {
        flex: 1;
      }

      .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;
        min-height: 20px;
      }

      .tag-error {
        color: var(--danger);
        font-size: 12px;
        margin-top: 4px;
        display: none;
      }

      .history-list {
        display: grid;
        gap: 10px;
      }

      .history-item {
        padding: 12px 14px;
        border-radius: 16px;
        background: var(--history-bg);
        border: 1px solid var(--line);
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
      <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
        <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
          <span id="theme-toggle-icon">🌙</span>
          <span id="theme-toggle-text">Dark Mode</span>
        </button>
      </div>
      <section class="hero" style="grid-template-columns: 1fr;">
        <article class="hero-card">
          <span class="hero-badge">ANDREW'S RELATIONSHIP CRM</span>
          <h1>Keep your people warm, not just your pipeline.</h1>
          <button type="button" class="desc-toggle" id="desc-toggle" aria-expanded="false">Show description</button>
          <p class="hero-desc" id="hero-desc">
            A simple, clean workspace for tracking personal and business relationships. Capture who
            they are, how you know them, when you last reached out, and who needs follow-up next.
          </p>
        </article>
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
                  LinkedIn URL
                  <input name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/username" />
                </label>
              </div>

              <div class="field-grid">
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

            </div>

            <div class="section-grid">
              <label>
                Tags (Arbitrary)
                <div class="helper">Enter up to 15 characters per tag. Press Enter to add.</div>
                <div class="tags-container js-form-tags"></div>
                <div class="tag-input-wrapper">
                  <input class="js-new-tag-input" maxlength="15" placeholder="Add a tag..." />
                  <button type="button" class="js-add-tag-btn secondary-btn">Add</button>
                </div>
                <div class="tag-error js-tag-error">Tag must be 15 characters or less</div>
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
              <div class="search-box">
                <input type="text" id="contact-search" placeholder="Search by name, company, email..." aria-label="Search contacts" />
              </div>
              <div style="display: flex; gap: 8px;">
                <button type="button" id="export-csv" class="button-ghost" style="padding: 8px 12px; font-size: 0.82rem;">
                  Export CSV
                </button>
                <button type="button" id="import-csv" class="button-ghost" style="padding: 8px 12px; font-size: 0.82rem;">
                  Import CSV
                </button>
                <input type="file" id="csv-file-input" accept=".csv" style="display: none;" />
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
        searchQuery: "",
        theme: localStorage.getItem('theme') || 'light',
      };

      console.log("CRM Script initializing...");

      const form = document.getElementById("contact-form");
      const submitButton = document.getElementById("submit-button");
      const formStatus = document.getElementById("form-status");
      const contactList = document.getElementById("contact-list");
      const emptyState = document.getElementById("empty-state");
      const detailPanel = document.getElementById("detail-panel");
      const statNodes = document.querySelectorAll("[data-stat]");
      const searchInput = document.getElementById("contact-search");
      const themeToggle = document.getElementById("theme-toggle");
      const themeIcon = document.getElementById("theme-toggle-icon");
      const themeText = document.getElementById("theme-toggle-text");
      const exportButton = document.getElementById("export-csv");
      const importButton = document.getElementById("import-csv");
      const csvFileInput = document.getElementById("csv-file-input");

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

      const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        state.theme = theme;
        localStorage.setItem('theme', theme);
        
        if (theme === 'dark') {
          themeIcon.textContent = '☀️';
          themeText.textContent = 'Light Mode';
        } else {
          themeIcon.textContent = '🌙';
          themeText.textContent = 'Dark Mode';
        }
      };

      // Initial theme apply
      applyTheme(state.theme);

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

      const filteredContacts = () => {
        const query = state.searchQuery.toLowerCase().trim();
        if (!query) {
          return state.contacts;
        }

        return state.contacts.filter((contact) => {
          return (
            contact.fullName.toLowerCase().includes(query) ||
            (contact.company && contact.company.toLowerCase().includes(query)) ||
            (contact.email && contact.email.toLowerCase().includes(query))
          );
        });
      };

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
        const list = filteredContacts();
        contactList.innerHTML = "";
        emptyState.classList.toggle("hidden", state.contacts.length > 0 || state.searchQuery.length > 0);

        if (list.length === 0 && state.searchQuery.length > 0) {
          const emptyResults = document.createElement("div");
          emptyResults.className = "empty-state";
          emptyResults.innerHTML = "<h3>No matches found</h3><p>Try a different search term.</p>";
          contactList.appendChild(emptyResults);
          return;
        }

        list.forEach((contact) => {
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

          (contact.tags || []).forEach((tag) => {
            chips.push('<span class="tag-chip">' + escapeHtml(tag) + "</span>");
          });

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
              escapeHtml(due.tone) +
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
                '<div style="display: flex; align-items: center; gap: 12px;">' +
                  "<h3>" +
                  escapeHtml(contact.fullName) +
                  "</h3>" +
                  (contact.linkedinUrl
                    ? '<a href="' +
                      escapeHtml(contact.linkedinUrl) +
                      '" target="_blank" rel="noopener noreferrer" class="linkedin-link" title="LinkedIn Profile">' +
                      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>' +
                      "</a>"
                    : "") +
                "</div>" +
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
                  '<label>LinkedIn URL<input name="linkedinUrl" type="url" value="' +
                    escapeHtml(contact.linkedinUrl || "") +
                    '" placeholder="https://linkedin.com/in/username" /></label>' +
                "</div>" +
                '<label>Last interaction summary<input name="lastInteractionSummary" maxlength="280" value="' +
                  escapeHtml(contact.lastInteractionSummary || "") +
                  '" /></label>' +
                '<label>Notes<textarea name="notes" maxlength="2000">' +
                  escapeHtml(contact.notes || "") +
                "</textarea></label>" +
                '<label>Tags (Arbitrary) <div class="helper">Enter up to 15 characters per tag. Press Enter to add.</div>' +
                  '<div class="tags-container js-form-tags">' +
                    (contact.tags || []).map(tag => 
                      '<span class="tag-chip removable" data-tag="' + escapeHtml(tag) + '">' + 
                        escapeHtml(tag) + ' &times;</span>'
                    ).join("") +
                  '</div>' +
                  '<div class="tag-input-wrapper">' +
                    '<input class="js-new-tag-input" maxlength="15" placeholder="Add a tag..." />' +
                    '<button type="button" class="js-add-tag-btn secondary-btn">Add</button>' +
                  '</div>' +
                  '<div class="tag-error js-tag-error">Tag must be 15 characters or less</div>' +
                "</label>" +
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
        try {
          const response = await fetch("/api/contacts");
          if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            throw new Error(errBody.message || ("Failed to load contacts (" + response.status + ")"));
          }

          const payload = await response.json();
          state.contacts = payload.items;
          renderStats(payload.summary);
        } catch (error) {
          console.error("Fetch error:", error);
          throw error;
        }

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
          linkedinUrl: String(formData.get("linkedinUrl") || "").trim(),
          connectionTypes: formData.getAll("connectionTypes").map(String),
          tags: Array.from(formNode.querySelectorAll(".js-form-tags .tag-chip")).map(
            (el) => el.dataset.tag || "",
          ).filter(Boolean),
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

        const payload = createPayloadFromForm(form, "create");

        // Deduplication Check
        const existingContact = state.contacts.find(
          (c) => 
            c.firstName.toLowerCase() === payload.firstName.toLowerCase() && 
            c.lastName.toLowerCase() === payload.lastName.toLowerCase()
        );

        if (existingContact) {
          setFormStatus(
            "A contact named " + escapeHtml(payload.firstName + " " + payload.lastName) + 
            " already exists. Please update the existing contact on the board.", 
            "error"
          );
          return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Saving...";

        try {
          const response = await fetch("/api/contacts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.message || "Could not save this contact.");
          }

          const contact = await response.json();
          form.reset();
          const tagsContainer = form.querySelector(".js-form-tags");
          if (tagsContainer) {
            tagsContainer.innerHTML = "";
          }
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

      searchInput.addEventListener("input", (event) => {
        state.searchQuery = event.target.value;
        renderBoard();
      });

      themeToggle.addEventListener("click", () => {
        const nextTheme = state.theme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
      });

      exportButton.addEventListener("click", async () => {
        try {
          const response = await fetch("/api/contacts/export");
          if (!response.ok) throw new Error("Export failed");
          
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "contacts-" + new Date().toISOString().slice(0, 10) + ".csv";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } catch (error) {
          console.error("Export error:", error);
          alert("Failed to export contacts. Check console for details.");
        }
      });

      importButton.addEventListener("click", () => {
        csvFileInput.click();
      });

      csvFileInput.addEventListener("change", async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
          const csv = e.target?.result;
          if (typeof csv !== "string") return;

          try {
            importButton.disabled = true;
            importButton.textContent = "Importing...";
            
            const response = await fetch("/api/contacts/import", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ csv }),
            });

            if (!response.ok) {
              const err = await response.json().catch(() => ({ message: "Server error during import" }));
              throw new Error(err.message || "Failed to import contacts");
            }

            const result = await response.json();
            alert(result.message || "Import complete.");
            
            // Refresh list using the existing helper which handles the { items, summary } wrapper
            await fetchContacts();
          } catch (error) {
            console.error("Import error:", error);
            alert(error.message || "Failed to import contacts. Ensure the CSV format is correct.");
          } finally {
            importButton.disabled = false;
            importButton.textContent = "Import CSV";
            csvFileInput.value = ""; // Clear for next use
          }
        };
        reader.readAsText(file);
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

      // Tag input logic
      document.addEventListener("click", (e) => {
        const t = e.target;
        if (t.classList.contains("js-add-tag-btn")) {
          addTag(t);
        } else if (t.classList.contains("removable") && t.closest(".js-form-tags")) {
          t.remove();
        }
      });

      document.addEventListener("keydown", (e) => {
        const t = e.target;
        if (e.key === "Enter" && t.classList.contains("js-new-tag-input")) {
          e.preventDefault();
          addTag(t);
        }
      });

      function addTag(triggerEl) {
        const form = triggerEl.closest("form");
        if (!form) return;
        
        const input = form.querySelector(".js-new-tag-input");
        const container = form.querySelector(".js-form-tags");
        const error = form.querySelector(".js-tag-error");
        if (!input || !container || !error) return;

        const val = input.value.trim();
        if (!val) return;

        if (val.length > 15) {
          error.style.display = "block";
          return;
        }

        error.style.display = "none";
        
        const existing = Array.from(container.querySelectorAll(".tag-chip")).map(el => el.dataset.tag);
        if (existing.includes(val)) {
          input.value = "";
          return;
        }

        const tag = document.createElement("span");
        tag.className = "tag-chip removable";
        tag.dataset.tag = val;
        tag.innerHTML = escapeHtml(val) + " &times;";
        container.appendChild(tag);
        input.value = "";
      }

      document.addEventListener("click", async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }

        if (target.id === "desc-toggle") {
          const desc = document.getElementById("hero-desc");
          const isExpanded = desc.classList.contains("expanded");
          
          if (isExpanded) {
            desc.classList.remove("expanded");
            target.textContent = "Show description";
            target.setAttribute("aria-expanded", "false");
          } else {
            desc.classList.add("expanded");
            target.textContent = "Hide description";
            target.setAttribute("aria-expanded", "true");
          }
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
