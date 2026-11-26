// Firebase web settings. These aren't secret; they ship with the site.
// Set to null for demo mode (trains live only in this browser; good for trying the app and for tests).
// Database rules live in ../firebase (deploy from there with `firebase deploy --only firestore:rules --project nest-nourish-ahzl4`).
// Tests switch to demo mode with ?demo in the address.
export const firebaseConfig = new URLSearchParams(location.search).has("demo") ? null : {
  apiKey: "AIzaSyARoGw_IQOyZe02kcDInL-ftrHfkH6yqZc",
  authDomain: "nest-nourish-ahzl4.firebaseapp.com",
  projectId: "nest-nourish-ahzl4",
  storageBucket: "nest-nourish-ahzl4.firebasestorage.app",
  messagingSenderId: "351565291472",
  appId: "1:351565291472:web:740f9c60172e292a18e3d5",
};
