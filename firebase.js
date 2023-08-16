
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDzjSWaRxNLa0Ic-46OUAhq-WL5PTt1ByA",
  authDomain: "gacapps-3d2fe.firebaseapp.com",
  projectId: "gacapps-3d2fe",
  storageBucket: "gacapps-3d2fe.appspot.com",
  messagingSenderId: "853067749548",
  appId: "1:853067749548:web:4545bf1761b1c495e66709",
  measurementId: "G-2Q1ZERS17C"
};


const app = initializeApp(firebaseConfig);


export default app;