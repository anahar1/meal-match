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
const app = initializeApp(firebaseConfig);
export const firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});


export const addUser = async (userName, restaurants, desirabilities) => {
  const collectionRef = collection(firestore, "Invites");
  const lastDoc = await getDocs(collectionRef);
  const lastDocId = lastDoc.docs[lastDoc.docs.length - 1].id;

  const nextDocId = parseInt(lastDocId) + 1;
  const docRef = doc(firestore, "Invites", nextDocId.toString());
  const data = { userName, restaurants, desirabilities };

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
      const { restaurants, desirabilities, userName } = data;
      return { restaurants, desirabilities, userName };
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

  const collectionRef = collection(firestore, "Users");
  const docRef = doc(collectionRef, userName);

  try {
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      // Document exists, update it
      await updateDoc(docRef, {
        selectedRestaurant: selectedRestaurant,
        timestamp: timestamp,
      });
      console.log("Document updated successfully");
    } else {
      // Document does not exist, create a new one
      const data = { userName, selectedRestaurant, timestamp };
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
      const { selectedRestaurant, timestamp } = data;
      return { selectedRestaurant, timestamp };
    } else {
      console.log("Document does not exist");
      return false;
    }
  } catch (error) {
    console.log("Error getting document:", error);
    return false;
  }
};
