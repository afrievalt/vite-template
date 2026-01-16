// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCwBaIiU27Nya8oy74UWtEzoimINaQVz9I',
  authDomain: 'fir-deploy-test-defe8.firebaseapp.com',
  databaseURL: 'https://fir-deploy-test-defe8.firebaseio.com',
  projectId: 'fir-deploy-test-defe8',
  storageBucket: 'fir-deploy-test-defe8.firebasestorage.app',
  messagingSenderId: '517470912893',
  appId: '1:517470912893:web:8b0f40825635a9929e8c14',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
