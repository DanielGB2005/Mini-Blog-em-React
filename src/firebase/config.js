import { initializeApp } from "firebase/app";

import {getFirestore} from "firebase/firestore"; // importando método necessário

const firebaseConfig = {
  apiKey: "AIzaSyC1BCml9tMsvb4gKh5bYa76IUgGZ3B8brU",
  authDomain: "miniblog-c8c9a.firebaseapp.com",
  projectId: "miniblog-c8c9a",
  storageBucket: "miniblog-c8c9a.appspot.com",
  messagingSenderId: "85182527123",
  appId: "1:85182527123:web:8af1dbaec50b148c78ff66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore BD
const db = getFirestore(app);

export {db};