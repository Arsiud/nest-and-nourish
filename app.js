// Nest & Nourish: meal trains for new moms, where mom picks the menu.
//
// Pages (in the address after #):
//   /                 home: start a train, your trains
//   /new              start a food train (organizers sign in)
//   /t/{id}           a train's calendar; /t/{id}/menu, /t/{id}/details
//   /t/{id}/join/{key}  co-organizer invite
//
// Mom (and the organizers she invites) builds the menu: her own dishes and picks from the
// suggestions, each tagged with the meal times it fits. Helpers open the shared link, choose a
// day and meal, and pick a dish offered for that meal time.

import { openStore } from "./store.js";
import { DIETS, GOALS, SLOTS, MEALS, suggest, avoidHits, slotOrder } from "./meals.js";

const store = await openStore();
const app = document.getElementById("app");
const sheet = document.getElementById("sheet");
const toastBox = document.getElementById("toast");

const S = {
  me: store.me(),
  route: null,
  watching: null,      // train id being watched
  unwatch: null,
  data: null,          // { train, dishes, signups, organizers } or { missing } / { error }
  sheet: null,         // { kind, ... } of the open dialog
  showPast: false,
  openOnly: false,
  menuSlot: "all",
  suggestSlot: "all",
  myTrains: null,
};

// ---------- small helpers ----------

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const local = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(`nn.${key}`)) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(`nn.${key}`, JSON.stringify(value)); } catch {} },
};
function toast(message, bad = false) {
  toastBox.textContent = message;
  toastBox.className = bad ? "show bad" : "show";
  // A popover sits above open dialogs; showing it again brings it to the front.
  if (toastBox.showPopover) { try { toastBox.hidePopover(); } catch {} toastBox.showPopover(); }
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { toastBox.className = ""; }, bad ? 5000 : 2600);
}

// Days are "YYYY-MM-DD" in local time.
const dayOf = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const dateOf = (day) => { const [y, m, d] = day.split("-").map(Number); return new Date(y, m - 1, d); };
const today = () => dayOf(new Date());
const addDays = (day, n) => { const d = dateOf(day); d.setDate(d.getDate() + n); return dayOf(d); };
const MAX_DAYS = 90;
function daysOf(train) {
  const out = [];
  for (let d = train.start; d <= train.end && out.length < MAX_DAYS; d = addDays(d, 1)) out.push(d);
  return out;
}
const longDay = (day) => dateOf(day).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
const shortDate = (day) => dateOf(day).toLocaleDateString(undefined, { month: "short", day: "numeric" });
const slotLabel = (id) => SLOTS.find((s) => s.id === id)?.label || id;
const activeSlots = (train) => SLOTS.filter((s) => train.slots?.[s.id]);
const isOrganizer = () => !!S.me && !!S.data?.organizers?.some((o) => o.uid === S.me.uid);
const signedIn = () => !!S.me && !S.me.anon;
const trainLink = (id) => `${location.origin}${location.pathname}#/t/${id}`;
const isClosed = (train, key) => (train.closed || []).includes(key) || (train.closed || []).includes(key.split("_")[0]);

function chips(items, selected, name) {
  return `<div class="chips">${items.map((it) => `<label class="chip"><input type="checkbox" name="${name}" value="${it.id}" ${selected.includes(it.id) ? "checked" : ""}><span>${esc(it.label)}</span></label>`).join("")}</div>`;
}
const slotTags = (slots) => `<span class="slot-tags">${[...slots].sort((a, b) => slotOrder(a) - slotOrder(b)).map((s) => `<span class="tag slot-${s}">${slotLabel(s)}</span>`).join("")}</span>`;
function prefsSummary(prefs = {}) {
  const parts = [
    ...DIETS.filter((d) => prefs.diet?.includes(d.id)).map((d) => d.label),
    ...GOALS.filter((g) => prefs.goals?.includes(g.id)).map((g) => g.label),
  ];
  if (prefs.avoid?.trim()) parts.push(`Avoid: ${prefs.avoid.trim()}`);
  return parts;
}
function dietBanner(train) {
  const diet = DIETS.filter((d) => train.prefs?.diet?.includes(d.id)).map((d) => d.label);
  const avoid = train.prefs?.avoid?.trim();
  if (!diet.length && !avoid) return "";
  return `<div class="banner warn"><strong>Please note:</strong> ${esc([...diet, avoid && `avoid ${avoid}`].filter(Boolean).join(" · "))}</div>`;
}

// ---------- routing ----------

function parseRoute() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  if (parts[0] === "t" && parts[1]) {
    if (parts[2] === "join") return { view: "join", id: parts[1], key: parts[3] || "" };
    return { view: "train", id: parts[1], tab: ["menu", "details"].includes(parts[2]) ? parts[2] : "calendar" };
  }
  if (parts[0] === "new") return { view: "new" };
  return { view: "home" };
}
const go = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };

async function route() {
  S.route = parseRoute();
  if (sheet.open) sheet.close();
  const id = S.route.view === "train" || S.route.view === "join" ? S.route.id : null;
  if (id !== S.watching) {
    S.unwatch?.();
    S.unwatch = null;
    S.data = null;
    S.watching = id;
    S.showPast = false;
    if (id) {
      render();
      try { if (!S.me) await store.ensureHelper(); }
      catch (e) { S.data = { error: e }; return render(); }
      if (S.watching !== id) return;
      S.unwatch = store.watch(id, (data) => {
        S.data = data;
        if (data.train) remember(id, data.train);
        render();
        if (S.sheet?.kind === "suggest") renderSuggest();
        if (S.justCreated === id && data.train && isOrganizer()) { S.justCreated = null; prefsSheet(true); }
      });
    }
  }
  if (S.route.view === "home") loadMyTrains();
  render();
  scrollTo(0, 0);
}
addEventListener("hashchange", route);

// Trains opened on this device, so helpers can find them again.
function remember(id, train) {
  const seen = local.get("visited", []).filter((t) => t.id !== id);
  seen.unshift({ id, mom: train.mom, start: train.start, end: train.end });
  local.set("visited", seen.slice(0, 20));
}
async function loadMyTrains() {
  try { S.myTrains = await store.myTrains(); } catch { S.myTrains = []; }
  if (S.route.view === "home") render();
}

store.onAuth((me) => {
  const was = S.me?.uid;
  S.me = me;
  if (S.route && was !== me?.uid) { if (S.route.view === "home") loadMyTrains(); render(); }
});

// ---------- rendering ----------

function render() {
  const r = S.route;
  if (!r) return;
  document.body.dataset.view = r.view;
  if (r.view === "home") app.innerHTML = homeView();
  else if (r.view === "new") app.innerHTML = signedIn() ? newView() : signInView("Organizers sign in, so only you and the people you invite can change the menu.");
  else if (r.view === "join") app.innerHTML = joinView();
  else app.innerHTML = trainView();
}

const demoNote = () => store.mode === "demo"
  ? `<div class="banner">Demo mode: food trains are saved only in this browser. Each browser tab acts as a different person.</div>` : "";
function accountLine() {
  if (!signedIn()) return "";
  return `<p class="account">Signed in as ${esc(S.me.name || S.me.email)} · <button class="link" data-action="sign-out">Sign out</button></p>`;
}

function homeView() {
  const mine = S.myTrains || [];
  const seen = local.get("visited", []).filter((t) => !mine.some((m) => m.id === t.id));
  const item = (t, label) => `<a class="train-link" href="#/t/${esc(t.id)}"><strong>${esc(t.mom)}</strong><span>${esc(shortDate(t.start))} – ${esc(shortDate(t.end))}${label ? ` · ${label}` : ""}</span></a>`;
  return `
    ${demoNote()}
    <section class="hero">
      <img src="logo.jpg" alt="" class="hero-icon">
      <h1>Nest &amp; Nourish</h1>
      <p>Meal trains for new moms, where she picks the menu.</p>
      <button class="primary big" data-action="go-new">Start a food train</button>
    </section>
    ${mine.length || seen.length ? `<section class="card"><h2>Your food trains</h2>
      ${mine.map((t) => item(t, "organizer")).join("")}${seen.map((t) => item(t, "")).join("")}</section>` : ""}
    <section class="card how">
      <h2>How it works</h2>
      <ol>
        <li><strong>She sets the menu.</strong> Mom adds the meals she'd love, or picks from suggestions that fit her diet and goals, like high protein or dairy-free.</li>
        <li><strong>Each dish has its meal times.</strong> An egg scramble shows up for breakfast, a lasagna for dinner. She can change any of them.</li>
        <li><strong>Friends sign up.</strong> Share one link. Helpers pick a day and meal, choose a dish from her menu, and everyone sees the calendar update live.</li>
      </ol>
    </section>
    ${accountLine()}`;
}

function signInView(why) {
  const live = store.mode === "live";
  const create = S.signInMode === "create";
  return `
    ${demoNote()}
    <section class="card narrow">
      <h1>${create ? "Create your account" : "Sign in"}</h1>
      <p class="muted">${esc(why)}</p>
      ${live ? `<button class="google" data-action="sign-in-google">Continue with Google</button><div class="or">or</div>` : ""}
      <form data-form="sign-in" class="stack">
        ${create || !live ? `<label>Your name<input name="name" autocomplete="name" required value="${esc(local.get("name", ""))}"></label>` : ""}
        <label>Email<input name="email" type="email" autocomplete="email" required></label>
        <label>Password<input name="password" type="password" autocomplete="${create ? "new-password" : "current-password"}" minlength="6" required></label>
        <button class="primary">${create ? "Create account" : "Sign in"}</button>
      </form>
      ${live ? `<p class="muted small">${create ? `Have an account? <button class="link" data-action="sign-in-mode" data-mode="signin">Sign in</button>`
        : `New here? <button class="link" data-action="sign-in-mode" data-mode="create">Create an account</button> · <button class="link" data-action="reset-password">Forgot password?</button>`}</p>` : ""}
      <p><a href="#/">‹ Back</a></p>
    </section>`;
}

function newView() {
  const start = today();
  return `
    ${demoNote()}
    <section class="card narrow">
      <h1>Start a food train</h1>
      <form data-form="new-train" class="stack">
        <label>Who is it for?<input name="mom" required maxlength="60" placeholder="Mom's name, e.g. Sarah"></label>
        <label>Your name<input name="organizerName" required maxlength="60" value="${esc(S.me.name || local.get("name", ""))}"></label>
        <div class="row">
          <label>First day<input name="start" type="date" required value="${start}"></label>
          <label>Last day<input name="end" type="date" required value="${addDays(start, 13)}"></label>
        </div>
        <fieldset><legend>Meals she needs</legend>
          ${chips(SLOTS, ["breakfast", "lunch", "dinner"], "slots")}
        </fieldset>
        <button class="primary">Create the food train</button>
      </form>
      <p class="muted small">Next you'll set her preferences and build the menu. You can invite her (or other organizers) to edit it too.</p>
      <p><a href="#/">‹ Back</a></p>
    </section>`;
}

function joinView() {
  const d = S.data;
  if (!d) return `<p class="loading">Loading…</p>`;
  if (d.missing || d.error) return notFound(d);
  if (isOrganizer()) { setTimeout(() => go(`#/t/${S.route.id}/menu`)); return ""; }
  if (!signedIn()) return signInView(`You've been invited to help organize ${d.train.mom}'s food train. Sign in to accept.`);
  return `
    <section class="card narrow">
      <h1>Help organize ${esc(d.train.mom)}'s food train</h1>
      <p>Organizers can change the menu, the dates and the drop-off details.</p>
      <form data-form="join" class="stack">
        <label>Your name<input name="name" required maxlength="60" value="${esc(S.me.name || local.get("name", ""))}"></label>
        <button class="primary">Join as organizer</button>
      </form>
    </section>`;
}

function notFound(d) {
  return `<section class="card narrow"><h1>Food train not found</h1>
    <p>${esc(d.error?.message || "This link may be mistyped, or the train was deleted.")}</p><p><a href="#/">Go home</a></p></section>`;
}

function trainView() {
  const d = S.data;
  if (!d) return `<p class="loading">Loading…</p>`;
  if (d.missing || d.error) return notFound(d);
  const t = d.train, tab = S.route.tab, id = S.route.id;
  const tabLink = (name, label) => `<a href="#/t/${esc(id)}${name === "calendar" ? "" : `/${name}`}" class="${tab === name ? "on" : ""}" ${tab === name ? 'aria-current="page"' : ""}>${label}</a>`;
  return `
    ${demoNote()}
    <header class="train-head">
      <a href="#/" class="home-link" aria-label="Home"><img src="logo.jpg" alt=""></a>
      <div>
        <h1>Food train for ${esc(t.mom)}</h1>
        <p>${esc(shortDate(t.start))} – ${esc(shortDate(t.end))}</p>
      </div>
      <button class="share" data-action="share">Share</button>
    </header>
    <nav class="tabs">${tabLink("calendar", "Calendar")}${tabLink("menu", `Menu <span class="count">${d.dishes.length}</span>`)}${tabLink("details", "Details")}</nav>
    <main>${tab === "menu" ? menuTab() : tab === "details" ? detailsTab() : calendarTab()}</main>`;
}

function calendarTab() {
  const { train: t, signups } = S.data;
  const slots = activeSlots(t);
  const byKey = new Map(signups.map((s) => [s.id, s]));
  const days = daysOf(t);
  const now = today();
  const past = days.filter((d) => d < now);
  const shown = S.showPast ? days : days.filter((d) => d >= now);
  const org = isOrganizer();

  let total = 0, covered = 0;
  for (const day of days) for (const s of slots) {
    const key = `${day}_${s.id}`;
    if (isClosed(t, key)) continue;
    total++;
    if (byKey.has(key)) covered++;
  }

  const rows = shown.map((day) => {
    const dayClosed = (t.closed || []).includes(day);
    const cells = slots.map((s) => {
      const key = `${day}_${s.id}`;
      const su = byKey.get(key);
      const closed = isClosed(t, key);
      if (S.openOnly && (su || closed)) return "";
      const time = t.times?.[s.id] ? `<span class="time">${esc(t.times[s.id])}</span>` : "";
      if (closed && !su) return `<div class="slot closed"><span class="slot-name">${s.label}${time}</span><span class="status">Not needed</span>
        ${org && !dayClosed ? `<button class="small" data-action="reopen-slot" data-key="${key}">Reopen</button>` : ""}</div>`;
      if (su) {
        const mine = su.uid === S.me?.uid;
        return `<div class="slot filled ${mine ? "mine" : ""}"><span class="slot-name">${s.label}${time}</span>
          <span class="status"><strong>${esc(su.name)}</strong> is bringing ${esc(su.dishName)}${su.note ? `<em>“${esc(su.note)}”</em>` : ""}</span>
          ${mine || org ? `<button class="small" data-action="signup" data-key="${key}">${mine ? "Change" : "Manage"}</button>` : ""}</div>`;
      }
      return `<div class="slot open"><span class="slot-name">${s.label}${time}</span><span class="status">Open</span>
        <button class="small primary" data-action="signup" data-key="${key}">Sign up</button></div>`;
    }).join("");
    if (S.openOnly && !cells) return "";
    return `<section class="day ${day === now ? "today" : ""} ${dayClosed ? "day-closed" : ""}">
      <header><h3>${esc(longDay(day))}${day === now ? ' <span class="badge">Today</span>' : ""}</h3>
        ${org ? `<button class="link" data-action="toggle-day" data-day="${day}">${dayClosed ? "Reopen day" : "Skip day"}</button>` : ""}</header>
      ${dayClosed && !org && !cells.includes("filled") ? `<p class="muted small">No meals needed this day.</p>` : cells}
    </section>`;
  }).join("");

  const noMenu = !S.data.dishes.length;
  return `
    ${noMenu ? `<div class="banner">${org ? `The menu is empty. <a href="#/t/${esc(S.route.id)}/menu">Build her menu</a> so helpers have dishes to choose from.` : "The menu isn't ready yet. Check back soon!"}</div>` : ""}
    <div class="progress"><div style="width:${total ? Math.round((covered / total) * 100) : 0}%"></div></div>
    <div class="cal-bar"><span><strong>${covered}</strong> of ${total} meals covered</span>
      <label class="toggle"><input type="checkbox" data-action="open-only" ${S.openOnly ? "checked" : ""}> Open meals only</label></div>
    ${past.length && !S.showPast ? `<button class="link past" data-action="show-past">Show ${past.length} past day${past.length > 1 ? "s" : ""}</button>` : ""}
    ${!slots.length ? `<p class="muted">No meal times are turned on. ${org ? "Choose them in Details." : ""}</p>` : rows || `<p class="muted">Every meal is covered. Thank you!</p>`}`;
}

function menuTab() {
  const { train: t, dishes, signups } = S.data;
  const org = isOrganizer();
  const counts = Object.fromEntries(SLOTS.map((s) => [s.id, dishes.filter((d) => d.slots?.includes(s.id)).length]));
  const list = dishes
    .filter((d) => S.menuSlot === "all" || d.slots?.includes(S.menuSlot))
    .sort((a, b) => slotOrder(a.slots?.[0]) - slotOrder(b.slots?.[0]) || a.name.localeCompare(b.name));
  const prefs = prefsSummary(t.prefs);
  const filter = (id, label, n) => `<button class="chip-btn ${S.menuSlot === id ? "on" : ""}" data-action="menu-slot" data-slot="${id}">${label}${n != null ? ` <span>${n}</span>` : ""}</button>`;
  return `
    ${org ? `<section class="card prefs">
        <div class="prefs-head"><h2>Her preferences</h2><button class="small" data-action="prefs">Edit</button></div>
        ${prefs.length ? `<p>${prefs.map((p) => `<span class="tag">${esc(p)}</span>`).join(" ")}</p>` : `<p class="muted">Add diets, allergies and goals (like high protein) to get meal suggestions that fit.</p>`}
        <div class="actions"><button class="primary" data-action="suggest">Get suggestions</button><button data-action="add-dish">Add a dish</button></div>
      </section>` : dietBanner(t)}
    ${!dishes.length ? `<p class="muted center">${org ? "No dishes yet. Start with suggestions, or add the meals she's craving." : "She hasn't added any dishes yet."}</p>` : `
      <div class="filters">${filter("all", "All", dishes.length)}${SLOTS.filter((s) => t.slots?.[s.id] || counts[s.id]).map((s) => filter(s.id, s.label, counts[s.id])).join("")}</div>
      <ul class="dishes">${list.map((d) => {
        const n = signups.filter((s) => s.dishId === d.id).length;
        return `<li>${org ? `<button class="dish" data-action="edit-dish" data-id="${esc(d.id)}">` : `<div class="dish">`}
          <strong>${esc(d.name)}</strong>${d.desc ? `<span class="desc">${esc(d.desc)}</span>` : ""}
          <span class="meta">${slotTags(d.slots || [])}${n ? `<span class="used">on the calendar ${n}×</span>` : ""}</span>
          ${org ? "</button>" : "</div>"}</li>`;
      }).join("")}</ul>`}`;
}

function detailsTab() {
  const { train: t, organizers, signups } = S.data;
  const org = isOrganizer();
  const slots = activeSlots(t);
  const mine = signups.filter((s) => s.uid === S.me?.uid).sort((a, b) => a.id.localeCompare(b.id));
  const maps = t.address ? `https://maps.apple.com/?q=${encodeURIComponent(t.address)}` : "";
  return `
    ${mine.length ? `<section class="card"><h2>Your sign-ups</h2><ul class="plain">${mine.map((s) => {
      const [day, slot] = s.id.split("_");
      return `<li><strong>${esc(longDay(day))}, ${slotLabel(slot)}:</strong> ${esc(s.dishName)}</li>`;
    }).join("")}</ul></section>` : ""}
    <section class="card">
      <div class="prefs-head"><h2>Drop-off</h2>${org ? `<button class="small" data-action="edit-details">Edit</button>` : ""}</div>
      ${t.address ? `<p class="address">${esc(t.address)}<br><a href="${maps}" target="_blank" rel="noopener">Open in Maps</a></p>` : `<p class="muted">No address yet${org ? "" : ". The organizer will add it"}.</p>`}
      ${slots.some((s) => t.times?.[s.id]) ? `<ul class="plain">${slots.filter((s) => t.times?.[s.id]).map((s) => `<li><strong>${s.label}:</strong> ${esc(t.times[s.id])}</li>`).join("")}</ul>` : ""}
      ${t.household ? `<p><strong>Feeding:</strong> ${esc(t.household)}</p>` : ""}
      ${t.notes ? `<p class="notes">${esc(t.notes)}</p>` : ""}
    </section>
    ${prefsSummary(t.prefs).length ? `<section class="card"><h2>Diet and allergies</h2><p>${prefsSummary(t.prefs).map((p) => `<span class="tag">${esc(p)}</span>`).join(" ")}</p></section>` : ""}
    <section class="card">
      <h2>Organizers</h2>
      <ul class="plain">${organizers.map((o) => `<li>${esc(o.name || "Organizer")}${o.uid === t.ownerUid ? ' <span class="muted small">started the train</span>' : ""}
        ${org && o.uid !== t.ownerUid && o.uid !== S.me.uid ? ` <button class="link" data-action="remove-organizer" data-uid="${esc(o.uid)}">Remove</button>` : ""}</li>`).join("")}</ul>
      ${org ? `<div class="actions"><button data-action="invite">Invite an organizer</button></div>
        <p class="muted small">Send the invite to mom or a close friend so they can edit the menu too. Helpers only need the regular Share link.</p>` : ""}
    </section>
    ${org ? `<section class="card">
      <div class="prefs-head"><h2>Dates and meals</h2><button class="small" data-action="edit-schedule">Edit</button></div>
      <p>${esc(longDay(t.start))} – ${esc(longDay(t.end))}</p>
      <p>${slots.map((s) => `<span class="tag slot-${s.id}">${s.label}</span>`).join(" ") || "No meal times turned on"}</p>
    </section>
    ${t.ownerUid === S.me.uid ? `<p class="center"><button class="link danger" data-action="delete-train">Delete this food train</button></p>` : ""}` : ""}
    ${accountLine()}`;
}

// ---------- dialogs ----------

function openSheet(kind, html, extra = {}) {
  S.sheet = { kind, ...extra };
  sheet.innerHTML = `<button class="close" data-action="close-sheet" aria-label="Close">✕</button>${html}`;
  if (!sheet.open) sheet.showModal();
  sheet.querySelector("input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea")?.focus();
}
sheet.addEventListener("close", () => { if (!sheet.open) { S.sheet = null; sheet.innerHTML = ""; } });   // a new dialog may already be open
sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });   // tap outside

function confirmSheet(message, ok, danger = true) {
  return new Promise((resolve) => {
    openSheet("confirm", `<p class="confirm">${esc(message)}</p><div class="actions">
      <button data-action="close-sheet">Cancel</button><button class="${danger ? "danger-btn" : "primary"}" data-confirm>${esc(ok)}</button></div>`);
    S.sheet.resolve = resolve;
    sheet.querySelector("[data-confirm]").onclick = () => { S.sheet.resolve = null; sheet.close(); resolve(true); };
    sheet.addEventListener("close", () => resolve(false), { once: true });
  });
}

function signupSheet(key) {
  const { train: t, dishes, signups } = S.data;
  const [day, slot] = key.split("_");
  const su = signups.find((s) => s.id === key);
  const org = isOrganizer();
  const mine = su && su.uid === S.me?.uid;
  const head = `<h2>${slotLabel(slot)} · ${esc(longDay(day))}</h2>${t.times?.[slot] ? `<p class="muted">Drop-off ${esc(t.times[slot])}</p>` : ""}`;

  // Someone else's sign-up: organizers can see and remove it.
  if (su && !mine) {
    return openSheet("signup", `${head}<p><strong>${esc(su.name)}</strong> is bringing ${esc(su.dishName)}.</p>${su.note ? `<p class="notes">${esc(su.note)}</p>` : ""}
      <div class="actions"><button class="danger-btn" data-action="cancel-signup" data-key="${key}">Remove this sign-up</button></div>`);
  }
  const options = dishes.filter((d) => d.slots?.includes(slot) || d.id === su?.dishId).sort((a, b) => a.name.localeCompare(b.name));
  const used = (id) => signups.filter((s) => s.dishId === id && s.id !== key).length;
  openSheet("signup", `
    <form data-form="signup" data-key="${key}" class="stack">
      ${head}
      ${dietBanner(t)}
      ${options.length ? `<fieldset class="dish-pick"><legend>Pick a dish from her menu</legend>
        ${options.map((d) => `<label class="dish-option"><input type="radio" name="dish" value="${esc(d.id)}" required ${su?.dishId === d.id ? "checked" : ""}>
          <span><strong>${esc(d.name)}</strong>${d.desc ? `<span class="desc">${esc(d.desc)}</span>` : ""}${used(d.id) ? `<span class="used">already coming ${used(d.id)}×</span>` : ""}</span></label>`).join("")}
        </fieldset>` : `<p class="muted">She hasn't added any ${slotLabel(slot).toLowerCase()} dishes yet.${org ? ` <a href="#/t/${esc(S.route.id)}/menu">Add some</a>.` : ""}</p>`}
      ${options.length ? `
        <label>Your name<input name="name" required maxlength="60" autocomplete="name" value="${esc(su?.name || local.get("name", "") || S.me?.name || "")}"></label>
        <label>Note for her (optional)<textarea name="note" maxlength="500" rows="2" placeholder="e.g. I'll text when I'm on the way">${esc(su?.note || "")}</textarea></label>
        <div class="actions">${mine ? `<button type="button" class="danger-btn" data-action="cancel-signup" data-key="${key}">Cancel my sign-up</button>` : ""}
          <button class="primary">${mine ? "Save" : "Sign up"}</button></div>` : ""}
      ${org && !su ? `<p class="center"><button type="button" class="link" data-action="close-slot" data-key="${key}">Mark this meal as not needed</button></p>` : ""}
    </form>`);
}

function dishSheet(dish) {
  const t = S.data.train;
  const d = dish || { name: "", desc: "", slots: activeSlots(t).map((s) => s.id) };
  const hits = dish ? avoidHits(dish, t.prefs) : [];
  openSheet("dish", `
    <form data-form="dish" data-id="${esc(dish?.id || "")}" class="stack">
      <h2>${dish ? "Edit dish" : "Add a dish"}</h2>
      ${hits.length ? `<div class="banner warn">This mentions ${esc(hits.join(", "))}, which is on her avoid list.</div>` : ""}
      <label>Dish<input name="name" required maxlength="80" value="${esc(d.name)}" placeholder="e.g. Chicken with grilled potatoes"></label>
      <label>Details for helpers (optional)<textarea name="desc" maxlength="300" rows="2" placeholder="e.g. No onions please. Takeout from Panera is fine too.">${esc(d.desc)}</textarea></label>
      <fieldset><legend>Offer it for</legend>${chips(SLOTS, d.slots || [], "slots")}</fieldset>
      <div class="actions">${dish ? `<button type="button" class="danger-btn" data-action="delete-dish" data-id="${esc(dish.id)}">Remove</button>` : ""}<button class="primary">${dish ? "Save" : "Add to menu"}</button></div>
    </form>`);
}

function prefsSheet(thenSuggest) {
  const p = S.data.train.prefs || {};
  openSheet("prefs", `
    <form data-form="prefs" data-then="${thenSuggest ? "suggest" : ""}" class="stack">
      <h2>Her preferences</h2>
      <fieldset><legend>Diet and allergies</legend>${chips(DIETS, p.diet || [], "diet")}</fieldset>
      <label>Other foods to avoid<input name="avoid" maxlength="200" value="${esc(p.avoid || "")}" placeholder="e.g. onions, mushrooms, spicy"></label>
      <fieldset><legend>What she'd like more of</legend>${chips(GOALS, p.goals || [], "goals")}</fieldset>
      <div class="actions"><button class="primary">${thenSuggest ? "Save and see suggestions" : "Save"}</button></div>
    </form>`);
}

function renderSuggest() {
  const { train: t, dishes } = S.data;
  const added = new Map(dishes.filter((d) => d.libraryId).map((d) => [d.libraryId, d.id]));
  const all = suggest(t.prefs);
  const list = all.filter((m) => S.suggestSlot === "all" || m.slots.includes(S.suggestSlot));
  const based = prefsSummary(t.prefs);
  const goalLabel = (g) => GOALS.find((x) => x.id === g).label;
  const filter = (id, label) => `<button class="chip-btn ${S.suggestSlot === id ? "on" : ""}" data-action="suggest-slot" data-slot="${id}">${label}</button>`;
  const html = `
    <h2>Suggestions</h2>
    <p class="muted small">${based.length ? `Based on ${esc(based.join(" · "))}. ` : ""}<button class="link" data-action="prefs-then-suggest">Change preferences</button></p>
    <div class="actions left"><button class="primary" data-action="add-top">Add top picks</button><span class="muted small">${added.size} added</span></div>
    <div class="filters">${filter("all", "All")}${SLOTS.map((s) => filter(s.id, s.label)).join("")}</div>
    ${list.length ? `<ul class="suggestions">${list.map((m) => `<li class="${added.has(m.id) ? "added" : ""}">
      <div><strong>${esc(m.name)}</strong><span class="desc">${esc(m.desc)}</span>
        <span class="meta">${slotTags(m.slots)}${m.matched.map((g) => `<span class="tag goal">${goalLabel(g)}</span>`).join("")}</span></div>
      <button class="small ${added.has(m.id) ? "" : "primary"}" data-action="suggest-toggle" data-lib="${m.id}" aria-pressed="${added.has(m.id)}">${added.has(m.id) ? "Added ✓" : "Add"}</button>
    </li>`).join("")}</ul>` : `<p class="muted">Nothing in the library fits all of her preferences. Try loosening them, or add her own dishes.</p>`}`;
  if (S.sheet?.kind === "suggest") {
    const scroll = sheet.scrollTop;
    sheet.innerHTML = `<button class="close" data-action="close-sheet" aria-label="Close">✕</button>${html}`;
    sheet.scrollTop = scroll;
  } else openSheet("suggest", html);
}

function detailsSheet() {
  const t = S.data.train;
  openSheet("details", `
    <form data-form="details" class="stack">
      <h2>Drop-off details</h2>
      <label>Address<textarea name="address" rows="2" maxlength="300" placeholder="Street, city">${esc(t.address || "")}</textarea></label>
      <p class="muted small">Anyone with the share link can see this.</p>
      ${activeSlots(t).map((s) => `<label>${s.label} drop-off time<input name="time-${s.id}" maxlength="40" value="${esc(t.times?.[s.id] || "")}" placeholder="${s.id === "breakfast" ? "e.g. 8–9 am" : s.id === "lunch" ? "e.g. 11:30–12:30" : "e.g. 5–6 pm"}"></label>`).join("")}
      <label>Feeding how many?<input name="household" maxlength="80" value="${esc(t.household || "")}" placeholder="e.g. 2 adults, a toddler"></label>
      <label>Notes for helpers<textarea name="notes" rows="3" maxlength="1000" placeholder="e.g. Leave it in the cooler on the porch and text, please don't knock. Disposable containers are best.">${esc(t.notes || "")}</textarea></label>
      <div class="actions"><button class="primary">Save</button></div>
    </form>`);
}

function scheduleSheet() {
  const t = S.data.train;
  openSheet("schedule", `
    <form data-form="schedule" class="stack">
      <h2>Dates and meals</h2>
      <label>Mom's name<input name="mom" required maxlength="60" value="${esc(t.mom)}"></label>
      <div class="row">
        <label>First day<input name="start" type="date" required value="${t.start}"></label>
        <label>Last day<input name="end" type="date" required value="${t.end}"></label>
      </div>
      <fieldset><legend>Meals she needs</legend>${chips(SLOTS, activeSlots(t).map((s) => s.id), "slots")}</fieldset>
      <p class="muted small">Sign-ups already made stay on the calendar.</p>
      <div class="actions"><button class="primary">Save</button></div>
    </form>`);
}

// ---------- actions ----------

const id = () => S.route.id;
async function setClosed(change) {
  const closed = new Set(S.data.train.closed || []);
  change(closed);
  await store.updateTrain(id(), { closed: [...closed].sort() });
}
async function share(url, title) {
  if (navigator.share) {
    try { await navigator.share({ title, url }); return; } catch (e) { if (e.name === "AbortError") return; }
  }
  try { await navigator.clipboard.writeText(url); toast("Link copied"); }
  catch { openSheet("link", `<h2>${esc(title)}</h2><p>Copy this link:</p><input readonly value="${esc(url)}" onfocus="this.select()">`); }
}
function validDates(start, end) {
  if (!start || !end || end < start) throw new Error("The last day must be on or after the first day.");
  if (addDays(start, MAX_DAYS - 1) < end) throw new Error(`A food train can be up to ${MAX_DAYS} days long.`);
}

const actions = {
  "go-new": () => go("#/new"),
  "sign-out": async () => { await store.signOut(); S.myTrains = []; toast("Signed out"); render(); },
  "sign-in-mode": (el) => { S.signInMode = el.dataset.mode; render(); },
  "sign-in-google": async () => { await store.signInGoogle(); afterSignIn(); },
  "reset-password": async () => {
    const email = app.querySelector("[name=email]")?.value.trim();
    if (!email) return toast("Type your email first, then tap Forgot password.", true);
    await store.resetPassword(email);
    toast("Check your email for a reset link.");
  },
  share: () => share(trainLink(id()), `Food train for ${S.data.train.mom}`),
  invite: async () => share(`${trainLink(id())}/join/${await store.inviteKey(id())}`, `Help organize ${S.data.train.mom}'s food train`),
  signup: (el) => signupSheet(el.dataset.key),
  "cancel-signup": async (el) => {
    const su = S.data.signups.find((s) => s.id === el.dataset.key);
    const mine = su?.uid === S.me?.uid;
    if (!await confirmSheet(mine ? "Cancel your sign-up for this meal?" : `Remove ${su?.name}'s sign-up?`, mine ? "Cancel sign-up" : "Remove")) return;
    await store.unclaim(id(), el.dataset.key);
    toast(mine ? "Your sign-up was cancelled" : "Sign-up removed");
  },
  "close-slot": async (el) => { await setClosed((c) => c.add(el.dataset.key)); sheet.close(); },
  "reopen-slot": (el) => setClosed((c) => c.delete(el.dataset.key)),
  "toggle-day": (el) => setClosed((c) => {
    const day = el.dataset.day;
    if (c.has(day)) c.delete(day);
    else { c.add(day); SLOTS.forEach((s) => c.delete(`${day}_${s.id}`)); }
  }),
  "show-past": () => { S.showPast = true; render(); },
  "open-only": (el) => { S.openOnly = el.checked; render(); },
  "menu-slot": (el) => { S.menuSlot = el.dataset.slot; render(); },
  "add-dish": () => dishSheet(null),
  "edit-dish": (el) => dishSheet(S.data.dishes.find((d) => d.id === el.dataset.id)),
  "delete-dish": async (el) => {
    const dish = S.data.dishes.find((d) => d.id === el.dataset.id);
    const n = S.data.signups.filter((s) => s.dishId === dish.id).length;
    if (!await confirmSheet(`Remove ${dish.name} from the menu?${n ? ` Helpers who already signed up to bring it (${n}) stay on the calendar.` : ""}`, "Remove")) return;
    await store.deleteDish(id(), dish.id);
    toast("Removed from the menu");
  },
  prefs: () => prefsSheet(false),
  "prefs-then-suggest": () => prefsSheet(true),
  suggest: () => { S.suggestSlot = "all"; if (!prefsSummary(S.data.train.prefs).length) prefsSheet(true); else renderSuggest(); },
  "suggest-slot": (el) => { S.suggestSlot = el.dataset.slot; renderSuggest(); },
  "suggest-toggle": async (el) => {
    const lib = el.dataset.lib;
    const have = S.data.dishes.find((d) => d.libraryId === lib);
    if (have) await store.deleteDish(id(), have.id);
    else await addFromLibrary(MEALS.find((m) => m.id === lib));
  },
  // A starter menu: the best few for each meal she needs that aren't on the menu yet.
  "add-top": async () => {
    const t = S.data.train;
    const have = new Set(S.data.dishes.map((d) => d.libraryId).filter(Boolean));
    const picks = new Map();
    const all = suggest(t.prefs);
    for (const s of activeSlots(t)) {
      const already = S.data.dishes.filter((d) => d.slots?.includes(s.id)).length;
      const want = Math.max(0, (s.id === "dinner" ? 6 : 4) - already);
      all.filter((m) => m.slots[0] === s.id && !have.has(m.id) && !picks.has(m.id)).slice(0, want).forEach((m) => picks.set(m.id, m));
    }
    if (!picks.size) return toast("Her menu already has plenty for each meal. Add more one at a time.");
    for (const m of picks.values()) await addFromLibrary(m);
    toast(`Added ${picks.size} dish${picks.size > 1 ? "es" : ""}`);
  },
  "edit-details": () => detailsSheet(),
  "edit-schedule": () => scheduleSheet(),
  "remove-organizer": async (el) => {
    const o = S.data.organizers.find((x) => x.uid === el.dataset.uid);
    if (!await confirmSheet(`Remove ${o?.name || "this organizer"}? They won't be able to change the train any more.`, "Remove")) return;
    await store.removeOrganizer(id(), el.dataset.uid);
  },
  "delete-train": async () => {
    if (!await confirmSheet(`Delete ${S.data.train.mom}'s food train, with its menu and every sign-up? This can't be undone.`, "Delete")) return;
    const gone = id();
    S.unwatch?.(); S.unwatch = null; S.watching = null;
    await store.deleteTrain(gone);
    local.set("visited", local.get("visited", []).filter((t) => t.id !== gone));
    toast("Food train deleted");
    go("#/");
  },
  "close-sheet": () => sheet.close(),
};
const addFromLibrary = (m) => store.saveDish(id(), { name: m.name, desc: m.desc, slots: m.slots, libraryId: m.id, goals: m.goals });

function afterSignIn() {
  if (S.me?.name) local.set("name", local.get("name", "") || S.me.name);
  render();
}

const forms = {
  "sign-in": async (f) => {
    const create = store.mode === "demo" || S.signInMode === "create";
    const name = f.name?.value.trim();
    await store.signInEmail(f.email.value.trim(), f.password.value, create, name);
    if (name) local.set("name", name);
    afterSignIn();
  },
  "new-train": async (f) => {
    const fd = new FormData(f);
    const slots = fd.getAll("slots");
    if (!slots.length) throw new Error("Choose at least one meal she needs.");
    validDates(fd.get("start"), fd.get("end"));
    local.set("name", fd.get("organizerName").trim());
    const trainId = await store.createTrain({
      mom: fd.get("mom").trim(), organizerName: fd.get("organizerName").trim(),
      start: fd.get("start"), end: fd.get("end"),
      slots: Object.fromEntries(SLOTS.map((s) => [s.id, slots.includes(s.id)])),
      times: {}, address: "", notes: "", household: "", prefs: { diet: [], goals: [], avoid: "" }, closed: [],
    });
    S.myTrains = null;
    S.justCreated = trainId;   // ask for her preferences once the train has loaded
    go(`#/t/${trainId}/menu`);
  },
  join: async (f) => {
    const name = f.name.value.trim();
    local.set("name", name);
    await store.joinOrganizers(id(), S.route.key, name);
    toast("You're an organizer now");
    go(`#/t/${id()}/menu`);
  },
  signup: async (f) => {
    const dish = S.data.dishes.find((d) => d.id === f.dish.value);
    const name = f.name.value.trim();
    local.set("name", name);
    const was = S.data.signups.some((s) => s.id === f.dataset.key);
    await store.claim(id(), f.dataset.key, { name, dishId: dish.id, dishName: dish.name, note: f.note.value.trim() });
    sheet.close();
    toast(was ? "Saved" : `Thank you, ${name}! You're on the calendar.`);
  },
  dish: async (f) => {
    const fd = new FormData(f);
    const slots = fd.getAll("slots");
    if (!slots.length) throw new Error("Choose at least one meal time for this dish.");
    const dish = { name: fd.get("name").trim(), desc: fd.get("desc").trim(), slots };
    if (f.dataset.id) dish.id = f.dataset.id;
    const hits = avoidHits(dish, S.data.train.prefs);
    await store.saveDish(id(), dish);
    sheet.close();
    toast(hits.length ? `Saved. Heads up: it mentions ${hits.join(", ")}, which is on her avoid list.` : f.dataset.id ? "Saved" : "Added to the menu", hits.length > 0);
  },
  prefs: async (f) => {
    const fd = new FormData(f);
    await store.updateTrain(id(), { prefs: { diet: fd.getAll("diet"), goals: fd.getAll("goals"), avoid: fd.get("avoid").trim() } });
    if (f.dataset.then === "suggest") { S.sheet = null; sheet.close(); S.data.train.prefs = { diet: fd.getAll("diet"), goals: fd.getAll("goals"), avoid: fd.get("avoid").trim() }; renderSuggest(); }
    else { sheet.close(); toast("Preferences saved"); }
  },
  details: async (f) => {
    const fd = new FormData(f);
    const times = { ...(S.data.train.times || {}) };
    activeSlots(S.data.train).forEach((s) => { times[s.id] = fd.get(`time-${s.id}`).trim(); });
    await store.updateTrain(id(), { address: fd.get("address").trim(), household: fd.get("household").trim(), notes: fd.get("notes").trim(), times });
    sheet.close();
    toast("Details saved");
  },
  schedule: async (f) => {
    const fd = new FormData(f);
    const slots = fd.getAll("slots");
    if (!slots.length) throw new Error("Choose at least one meal she needs.");
    validDates(fd.get("start"), fd.get("end"));
    await store.updateTrain(id(), { mom: fd.get("mom").trim(), start: fd.get("start"), end: fd.get("end"), slots: Object.fromEntries(SLOTS.map((s) => [s.id, slots.includes(s.id)])) });
    sheet.close();
    toast("Saved");
  },
};

// One busy action at a time per button; errors show as a toast.
async function run(fn, el) {
  if (el?.dataset.busy) return;
  if (el) el.dataset.busy = "1";
  try { await fn(); }
  catch (e) { console.warn(e); toast(e.message || "Something went wrong.", true); }
  finally { if (el) delete el.dataset.busy; }
}
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el || el.matches("input")) return;
  const fn = actions[el.dataset.action];
  if (fn) { e.preventDefault(); run(() => fn(el), el); }
});
document.addEventListener("change", (e) => {
  const el = e.target.closest("input[data-action]");
  if (el) run(() => actions[el.dataset.action](el));
});
document.addEventListener("submit", (e) => {
  const f = e.target.closest("form[data-form]");
  if (!f) return;
  e.preventDefault();
  const button = f.querySelector("button.primary");
  run(() => forms[f.dataset.form](f), button);
});

if ("serviceWorker" in navigator && location.hostname !== "localhost") navigator.serviceWorker.register("sw.js");
route();
window.nest = { ready: true, store };
