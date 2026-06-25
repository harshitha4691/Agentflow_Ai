import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Temporary public sandbox project configurations
const firebaseConfig = {
  apiKey: "AIzaSyAs7W8XpX-example-apiKey-string",
  authDomain: "agentflow-ai-demo.firebaseapp.com",
  projectId: "agentflow-ai-demo",
  storageBucket: "agentflow-ai-demo.appspot.com",
  messagingSenderId: "1048455486518",
  appId: "1:1048455486518:web:abcdef123456"
};

// Initialize Firebase app instance safely for Next.js SSR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();