import * as firebase from 'firebase';

// Firebase
const config = {
  apiKey: 'AIzaSyAU5gP7Dk_GGcbmK_rsh8wA6vWtUS-k9yE',
  authDomain: 'mispuntos-c034e.firebaseapp.com',
  databaseURL: 'https://mispuntos-c034e.firebaseio.com',
  projectId: 'mispuntos-c034e',
  storageBucket: 'mispuntos-c034e.appspot.com',
  messagingSenderId: '107096907282',
};

const fbApp = firebase.initializeApp( config );
const db = fbApp.database();
const auth = fbApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = fbApp.storage().ref();

export { db, provider, auth, storage };
