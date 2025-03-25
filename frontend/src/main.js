import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Import the functions you need from the SDKs you need
import { initializeApp, } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBF8mSxEAlX3Ho2Q0kDWO2n7TMp_TgWrac",
  authDomain: "pos-app-bda40.firebaseapp.com",
  projectId: "pos-app-bda40",
  storageBucket: "pos-app-bda40.firebasestorage.app",
  messagingSenderId: "85541569152",
  appId: "1:85541569152:web:eeeb7e8a62038a0b3d5c65"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const app = createApp(App);

app.use(router);

app.mount("#app");
