import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA7Nq3SPluZDvGH1QbXJz-bsH6obPpOHbA",
  authDomain: "power-bad5e.firebaseapp.com",
  projectId: "power-bad5e",
  storageBucket: "power-bad5e.appspot.com",
  messagingSenderId: "316203173181",
  appId: "1:316203173181:web:546294903d872937473154"
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const auth = firebase.auth();

export default firebase;
