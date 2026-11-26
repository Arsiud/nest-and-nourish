// Where food trains are kept. Two backends with the same shape:
//   live: Firebase (Firestore, realtime), used when firebase-config.js has settings
//   demo: this browser only (localStorage, live across tabs), for trying the app and for tests
//
// A train:
//   trains/{id}               { mom, ownerUid, start, end, slots: {breakfast, lunch, dinner}, times: {…},
//                               address, notes, household, prefs: {diet, goals, avoid}, closed: [day or day_slot], created }
//   trains/{id}/dishes/{id}   { name, desc, slots: [slot], libraryId?, goals?, created }
//   trains/{id}/signups/{day_slot}  { uid, name, dishId, dishName, note, created }   one helper per meal
//   trains/{id}/organizers/{uid}    { name, mom? }   can change the train; mom: true marks the mom
//   trains/{id}/notices/{id}        { uid, key, dishName, by, byMom, message, created }   "your meal was removed", for that helper
//   trains/{id}/private/invite      { key }   the co-organizer invite secret, organizers only
//   trains/{id}/joins/{uid}         { key }   the key a co-organizer joined with (checked by the rules)
//   users/{uid}               { trains: [id] }   trains you organize, for any device
//
// Organizers sign in (Google or email + password). Helpers only need the link: they get a quiet
// anonymous sign-in so they can change or cancel their own sign-ups.

import { firebaseConfig } from "./firebase-config.js";

const randomId = (n = 20) => {
  const letters = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => letters[b % letters.length]).join("");
};
export const SLOT_KEY = /^\d{4}-\d{2}-\d{2}_(breakfast|lunch|dinner)$/;

export async function openStore() {
  return firebaseConfig ? liveStore() : demoStore();
}

// ---------- demo: everything in this browser ----------

function demoStore() {
  const DB_KEY = "nn.demo";
  const read = () => { try { return JSON.parse(localStorage.getItem(DB_KEY)) || { trains: {}, users: {} }; } catch { return { trains: {}, users: {} }; } };
  const listeners = new Set();
  const write = (change) => {
    const db = read();
    change(db);
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    listeners.forEach((l) => l());
  };
  addEventListener("storage", (e) => { if (e.key === DB_KEY) listeners.forEach((l) => l()); });

  // Each tab is its own person (sessionStorage), so two tabs can act as mom and a helper.
  let me = JSON.parse(sessionStorage.getItem("nn.demoUser") || "null");
  const authListeners = new Set();
  const setMe = (u) => { me = u; sessionStorage.setItem("nn.demoUser", JSON.stringify(u)); authListeners.forEach((l) => l(me)); };

  const train = (db, id) => { const t = db.trains[id]; if (!t) throw new Error("This food train no longer exists."); return t; };
  const isOrg = (db, id) => !!me && !!db.trains[id]?.organizers?.[me.uid];
  const mustOrg = (db, id) => { if (!isOrg(db, id)) throw new Error("Only organizers can do that."); };

  return {
    mode: "demo",
    me: () => me,
    onAuth(cb) { authListeners.add(cb); cb(me); return () => authListeners.delete(cb); },
    async signInGoogle() { throw new Error("Google sign-in works once the app is connected to Firebase."); },
    async signInEmail(email, password, create, name) {
      if (!email || password.length < 6) throw new Error("Enter an email and a password of at least 6 characters.");
      setMe({ uid: me?.uid || randomId(), name: name || me?.name || email.split("@")[0], email, anon: false });
    },
    async signOut() { setMe(null); },
    async ensureHelper() { if (!me) setMe({ uid: randomId(), anon: true }); return me; },

    async createTrain(data) {
      if (!me || me.anon) throw new Error("Sign in first.");
      const id = randomId();
      write((db) => {
        db.trains[id] = { ...data, ownerUid: me.uid, created: Date.now(), dishes: {}, signups: {},
          organizers: { [me.uid]: { name: data.organizerName || me.name || "", ...(data.organizerMom ? { mom: true } : {}) } },
          notices: {}, private: { key: randomId(12) } };
        delete db.trains[id].organizerName; delete db.trains[id].organizerMom;
        (db.users[me.uid] ||= { trains: [] }).trains.push(id);
      });
      return id;
    },
    watch(id, cb) {
      const send = () => {
        const t = read().trains[id];
        if (!t) return cb({ missing: true });
        const { dishes, signups, organizers, notices = {}, private: _, ...info } = t;
        cb({ train: info, dishes: Object.entries(dishes).map(([k, v]) => ({ id: k, ...v })),
          signups: Object.entries(signups).map(([k, v]) => ({ id: k, ...v })),
          organizers: Object.entries(organizers).map(([k, v]) => ({ uid: k, name: v.name, mom: !!v.mom })),
          notices: Object.entries(notices).filter(([, v]) => v.uid === me?.uid).map(([k, v]) => ({ id: k, ...v })) });
      };
      listeners.add(send);
      send();
      return () => listeners.delete(send);
    },
    async updateTrain(id, patch) { write((db) => { mustOrg(db, id); Object.assign(train(db, id), patch); }); },
    async saveDish(id, dish) {
      const dishId = dish.id || randomId();
      write((db) => { mustOrg(db, id); const { id: _, ...d } = dish; train(db, id).dishes[dishId] = { created: Date.now(), ...d }; });
      return dishId;
    },
    async deleteDish(id, dishId) { write((db) => { mustOrg(db, id); delete train(db, id).dishes[dishId]; }); },
    async claim(id, key, data) {
      if (!SLOT_KEY.test(key)) throw new Error("That isn't a meal on the calendar.");
      write((db) => {
        const t = train(db, id), had = t.signups[key];
        if (had && had.uid !== me.uid) throw new Error("Someone just signed up for this meal. Pick another one.");
        if (!t.dishes[data.dishId]) throw new Error("That dish was just taken off the menu.");
        t.signups[key] = { ...data, uid: me.uid, created: had?.created || Date.now() };
      });
    },
    async unclaim(id, key) {
      write((db) => {
        const t = train(db, id), s = t.signups[key];
        if (s && s.uid !== me?.uid && !isOrg(db, id)) throw new Error("Only the helper or an organizer can cancel this.");
        delete t.signups[key];
      });
    },
    // An organizer removes someone's sign-up and leaves them a note.
    async removeSignup(id, key, notice) {
      write((db) => {
        mustOrg(db, id);
        const t = train(db, id), s = t.signups[key];
        if (!s) return;
        if (s.uid !== me.uid) (t.notices ||= {})[randomId()] = { ...notice, uid: s.uid, key, dishName: s.dishName, created: Date.now() };
        delete t.signups[key];
      });
    },
    async dismissNotice(id, noticeId) { write((db) => { delete train(db, id).notices?.[noticeId]; }); },
    async setMom(id, mom) { write((db) => { mustOrg(db, id); const o = train(db, id).organizers[me.uid]; if (mom) o.mom = true; else delete o.mom; }); },
    async inviteKey(id) { const db = read(); mustOrg(db, id); return train(db, id).private.key; },
    async joinOrganizers(id, key, name, mom) {
      write((db) => {
        const t = train(db, id);
        if (!me || me.anon) throw new Error("Sign in first.");
        if (t.private.key !== key) throw new Error("This invite link isn't valid any more. Ask for a new one.");
        t.organizers[me.uid] = { name: name || me.name || "", ...(mom ? { mom: true } : {}) };
        const u = (db.users[me.uid] ||= { trains: [] });
        if (!u.trains.includes(id)) u.trains.push(id);
      });
    },
    async newInviteKey(id) { write((db) => { mustOrg(db, id); train(db, id).private.key = randomId(12); }); },
    async removeOrganizer(id, uid) {
      write((db) => { mustOrg(db, id); if (uid === train(db, id).ownerUid) throw new Error("The train's creator can't be removed."); delete train(db, id).organizers[uid]; });
    },
    async myTrains() {
      const db = read();
      return (me && db.users[me.uid]?.trains || []).filter((id) => db.trains[id]).map((id) => ({ id, ...pick(db.trains[id]) }));
    },
    async trainSummary(id) { const t = read().trains[id]; return t && pick(t); },
    async deleteTrain(id) {
      write((db) => { if (train(db, id).ownerUid !== me?.uid) throw new Error("Only the train's creator can delete it."); delete db.trains[id]; Object.values(db.users).forEach((u) => { u.trains = u.trains.filter((t) => t !== id); }); });
    },
  };
}
const pick = (t) => ({ mom: t.mom, start: t.start, end: t.end });

// ---------- live: Firebase ----------

async function liveStore() {
  const V = "https://www.gstatic.com/firebasejs/13.0.0";
  const [{ initializeApp }, A, F] = await Promise.all([
    import(`${V}/firebase-app.js`), import(`${V}/firebase-auth.js`), import(`${V}/firebase-firestore.js`)]);
  const app = initializeApp(firebaseConfig);
  const auth = A.getAuth(app);
  const db = F.getFirestore(app);
  const { doc, collection, getDoc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot, runTransaction, writeBatch, arrayUnion, arrayRemove, query, where } = F;

  let me = null;
  const authListeners = new Set();
  const toMe = (u) => u && { uid: u.uid, name: u.displayName || "", email: u.email || "", anon: u.isAnonymous };
  let ready;
  const first = new Promise((r) => { ready = r; });
  A.onAuthStateChanged(auth, (u) => { me = toMe(u); ready(); authListeners.forEach((l) => l(me)); });
  await first;

  const T = (id, ...rest) => doc(db, "trains", id, ...rest);
  const nice = (e) => {
    const code = e?.code || "";
    if (code.includes("permission-denied")) return new Error("That isn't allowed. If you're an organizer, sign in first.");
    if (code === "auth/invalid-credential" || code === "auth/wrong-password") return new Error("That email and password don't match.");
    if (code === "auth/email-already-in-use") return new Error("There's already an account with that email. Sign in instead.");
    if (code === "auth/weak-password") return new Error("Use a password of at least 6 characters.");
    if (code === "auth/popup-closed-by-user") return new Error("Sign-in was closed before it finished.");
    return e instanceof Error ? e : new Error(String(e));
  };
  const wrap = (fn) => async (...args) => { try { return await fn(...args); } catch (e) { throw nice(e); } };

  // A helper who signs in later keeps their sign-ups when possible (the anonymous account is upgraded).
  async function google() {
    const provider = new A.GoogleAuthProvider();
    if (auth.currentUser?.isAnonymous) {
      try { await A.linkWithPopup(auth.currentUser, provider); }
      catch (e) {
        if (e.code !== "auth/credential-already-in-use") throw e;
        await A.signInWithCredential(auth, A.GoogleAuthProvider.credentialFromError(e));
      }
    } else await A.signInWithPopup(auth, provider);
    signedIn();
  }
  // Upgrading an anonymous helper keeps the same account, so Firebase announces nothing; tell the app ourselves.
  function signedIn() { me = toMe(auth.currentUser); authListeners.forEach((l) => l(me)); }
  async function email(address, password, create, name) {
    if (create) {
      if (auth.currentUser?.isAnonymous) await A.linkWithCredential(auth.currentUser, A.EmailAuthProvider.credential(address, password));
      else await A.createUserWithEmailAndPassword(auth, address, password);
      if (name) await A.updateProfile(auth.currentUser, { displayName: name });
    } else await A.signInWithEmailAndPassword(auth, address, password);
    signedIn();
  }

  return {
    mode: "live",
    me: () => me,
    onAuth(cb) { authListeners.add(cb); cb(me); return () => authListeners.delete(cb); },
    signInGoogle: wrap(google),
    signInEmail: wrap(email),
    resetPassword: wrap((address) => A.sendPasswordResetEmail(auth, address)),
    signOut: wrap(() => A.signOut(auth)),
    ensureHelper: wrap(async () => { if (!auth.currentUser) await A.signInAnonymously(auth); me = toMe(auth.currentUser); return me; }),

    createTrain: wrap(async (data) => {
      const id = doc(collection(db, "trains")).id;
      const { organizerName, organizerMom, ...info } = data;
      await setDoc(T(id), { ...info, ownerUid: me.uid, created: Date.now() });
      await setDoc(T(id, "organizers", me.uid), { name: organizerName || me.name || "", ...(organizerMom ? { mom: true } : {}) });
      await setDoc(T(id, "private", "invite"), { key: randomId(12) });
      await setDoc(doc(db, "users", me.uid), { trains: arrayUnion(id) }, { merge: true });
      return id;
    }),
    watch(id, cb) {
      const state = { train: null, dishes: [], signups: [], organizers: [], notices: [] };
      const have = new Set();
      let gone = false;   // once the train is deleted, later updates to its lists mustn't bring it back on screen
      const send = (part) => { have.add(part); if (gone) cb({ missing: true }); else if (have.size === 4) cb({ ...state }); };
      const fail = (e) => cb({ error: nice(e) });
      const list = (name, part, map) => onSnapshot(collection(db, "trains", id, name),
        (s) => { state[part] = s.docs.map(map); send(part); }, fail);
      const unsubs = [
        onSnapshot(T(id), (s) => { gone = !s.exists(); if (gone) return cb({ missing: true }); state.train = s.data(); send("train"); }, fail),
        list("dishes", "dishes", (d) => ({ id: d.id, ...d.data() })),
        list("signups", "signups", (d) => ({ id: d.id, ...d.data() })),
        list("organizers", "organizers", (d) => ({ uid: d.id, name: d.data().name, mom: !!d.data().mom })),
        // Notes for this helper about meals an organizer removed (the rules only let them read their own).
        ...(me ? [onSnapshot(query(collection(db, "trains", id, "notices"), where("uid", "==", me.uid)),
          (s) => { state.notices = s.docs.map((d) => ({ id: d.id, ...d.data() })); if (have.size === 4 && !gone) cb({ ...state }); }, () => {})] : []),
      ];
      return () => unsubs.forEach((u) => u());
    },
    updateTrain: wrap((id, patch) => updateDoc(T(id), patch)),
    saveDish: wrap(async (id, dish) => {
      const { id: dishId, ...d } = dish;
      const ref = dishId ? T(id, "dishes", dishId) : doc(collection(db, "trains", id, "dishes"));
      await setDoc(ref, dishId ? d : { ...d, created: Date.now() }, { merge: true });
      return ref.id;
    }),
    deleteDish: wrap((id, dishId) => deleteDoc(T(id, "dishes", dishId))),
    claim: wrap((id, key, data) => runTransaction(db, async (tx) => {
      const ref = T(id, "signups", key);
      const had = await tx.get(ref);
      if (had.exists() && had.data().uid !== me.uid) throw new Error("Someone just signed up for this meal. Pick another one.");
      tx.set(ref, { ...data, uid: me.uid, created: had.exists() ? had.data().created : Date.now() });
    })),
    unclaim: wrap((id, key) => deleteDoc(T(id, "signups", key))),
    removeSignup: wrap(async (id, key, notice) => {
      const ref = T(id, "signups", key);
      const s = await getDoc(ref);
      if (!s.exists()) return;
      const batch = writeBatch(db);
      if (s.data().uid !== me.uid) batch.set(doc(collection(db, "trains", id, "notices")), { ...notice, uid: s.data().uid, key, dishName: s.data().dishName, created: Date.now() });
      batch.delete(ref);
      await batch.commit();
    }),
    dismissNotice: wrap((id, noticeId) => deleteDoc(T(id, "notices", noticeId))),
    setMom: wrap((id, mom) => updateDoc(T(id, "organizers", me.uid), { mom: !!mom })),
    inviteKey: wrap(async (id) => (await getDoc(T(id, "private", "invite"))).data().key),
    newInviteKey: wrap((id) => setDoc(T(id, "private", "invite"), { key: randomId(12) })),
    joinOrganizers: wrap(async (id, key, name, mom) => {
      const batch = writeBatch(db);
      batch.set(T(id, "joins", me.uid), { key });
      batch.set(T(id, "organizers", me.uid), { name: name || me.name || "", ...(mom ? { mom: true } : {}) });
      try { await batch.commit(); }
      catch (e) { if (String(e.code).includes("permission-denied")) throw new Error("This invite link isn't valid any more. Ask for a new one."); throw e; }
      await setDoc(doc(db, "users", me.uid), { trains: arrayUnion(id) }, { merge: true });
    }),
    removeOrganizer: wrap((id, uid) => deleteDoc(T(id, "organizers", uid))),
    myTrains: wrap(async () => {
      if (!me || me.anon) return [];
      const u = await getDoc(doc(db, "users", me.uid));
      const ids = u.exists() ? u.data().trains || [] : [];
      const found = await Promise.all(ids.map((id) => getDoc(T(id)).then((s) => s.exists() && { id, ...pick(s.data()) }, () => null)));
      return found.filter(Boolean);
    }),
    trainSummary: async (id) => { try { const s = await getDoc(T(id)); return s.exists() ? pick(s.data()) : null; } catch { return null; } },
    // Firestore doesn't delete sub-collections with their train, so clear them first.
    deleteTrain: wrap(async (id) => {
      for (const name of ["signups", "notices", "dishes", "joins", "organizers", "private"]) {
        const docs = (await getDocs(collection(db, "trains", id, name))).docs;
        const mine = name === "organizers" ? docs.filter((d) => d.id !== me.uid) : docs;
        for (let i = 0; i < mine.length; i += 400) {
          const batch = writeBatch(db);
          mine.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
          await batch.commit();
        }
      }
      await deleteDoc(T(id));
      await deleteDoc(T(id, "organizers", me.uid));
      await updateDoc(doc(db, "users", me.uid), { trains: arrayRemove(id) });
    }),
  };
}
