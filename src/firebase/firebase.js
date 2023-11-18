import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZSSeMQjgNm7Z_FRYm19ASpPCWQ-nj3h0",
  authDomain: "customgpt-a0f32.firebaseapp.com",
  projectId: "customgpt-a0f32",
  storageBucket: "customgpt-a0f32.appspot.com",
  messagingSenderId: "396212482879",
  appId: "1:396212482879:web:c6ac4b3f77b0ca2c06598a",
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
