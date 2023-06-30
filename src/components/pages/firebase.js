import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
} from "@firebase/firestore";

import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAXVulGTD8vC_ho1uuXtY-EtmWz7hUJAtA",
  authDomain: "lighthall-challenge-4-68155.firebaseapp.com",
  projectId: "lighthall-challenge-4-68155",
  storageBucket: "lighthall-challenge-4-68155.appspot.com",
  messagingSenderId: "818653168225",
  appId: "1:818653168225:web:6a883248ba9fce9de4e020",
  measurementId: "G-3RZRRLL9B5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});
export const auth = getAuth(app);

export const addUser = async (userName, restaurants, desirabilities, cuisine1, cuisine2, location1, location2) => {
  const collectionRef = collection(firestore, "Invites");
  const lastDoc = await getDocs(collectionRef);
  const lastDocId = lastDoc.docs[lastDoc.docs.length - 1].id;

  const nextDocId = parseInt(lastDocId) + 1;
  const docRef = doc(firestore, "Invites", nextDocId.toString());
  const data = { userName, restaurants, desirabilities, cuisine1, cuisine2, location1, location2 };

  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      console.log("Document exists");
    } else {
      await setDoc(docRef, data);
      console.log("Document has been added successfully");
    }
  } catch (error) {
    console.log("Error checking if document exists:", error);
    return false;
  }
  return Promise.resolve(lastDocId);
};

export const getInvite = async (inviteId) => {
  const docRef = doc(firestore, "Invites", inviteId);
  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const { restaurants, desirabilities, userName, cuisine1, cuisine2, location1, location2 } = data;
      return { restaurants, desirabilities, userName, cuisine1, cuisine2, location1, location2 };
    } else {
      console.log("Document does not exist");
      return false;
    }
  } catch (error) {
    console.log("Error getting document:", error);
    return false;
  }
};

export const addSelectedRestaurant = async (userName, selectedRestaurant, timestamp) => {
  if (!userName) {
    console.error("Error adding selected restaurant: userName is empty");
    return false;
  }
  let history = [];
  const collectionRef = collection(firestore, "Users");
  const docRef = doc(collectionRef, userName);

  try {
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      // Document exists, update it
      if(docSnapshot.data().history){
        history = docSnapshot.data().history;
      }
      history.push({
        selectedRestaurant: selectedRestaurant,
        timestamp: timestamp,
      })
      await updateDoc(docRef, {
        selectedRestaurant: selectedRestaurant,
        timestamp: timestamp,
        history: history
      });
      console.log("Document updated successfully");
    } else {
      // Document does not exist, create a new one
      const data = { userName, selectedRestaurant, timestamp, history};
      await setDoc(docRef, data);
      console.log("Document has been added successfully");
    }
  } catch (error) {
    console.log("Error checking if document exists:", error);
    return false;
  }

  return Promise.resolve();
};

export const userMatchedList = async (userName) => {
  const docRef = doc(firestore, "Users", userName);
  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const { selectedRestaurant, timestamp, history } = data;
      return { selectedRestaurant, timestamp, history };
    } else {
      console.log("Document does not exist");
      return false;
    }
  } catch (error) {
    console.log("Error getting document:", error);
    return false;
  }
};
