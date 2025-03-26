import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, doc, getDoc, query, where, orderBy } from "firebase/firestore"

// My firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// And initialising the app
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Our firebase manager to handle everything
class FirebaseManager {
  // First method gets all rounds
  async getAllRounds() {
    try {
      const roundsCollection = collection(db, "rounds")
      const roundsSnapshot = await getDocs(roundsCollection)
      return roundsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error("Error fetching rounds:", error)
      throw error
    }
  }

  // This one gets a specific round by its ID
  async getRoundById(roundId) {
    try {
      const roundDoc = doc(db, "rounds", roundId)
      const roundSnapshot = await getDoc(roundDoc)

      if (!roundSnapshot.exists()) {
        throw new Error("Round not found")
      }

      return {
        id: roundSnapshot.id,
        ...roundSnapshot.data()
      }

    } catch (error) {
      console.error(`Error fetching round: ${roundId}`, error)
      throw error
    }
  }

  // This one gets all holes for a given round
  async getHolesForRound(roundId) {
    try {
      const holesCollection = collection(db, "rounds", roundId, "holes")
      const holesSnapshot = await getDocs(holesCollection)

      return holesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error(`Error fetching holes for round: ${roundId}`, error)
    }
  }

  // This one gets a certain hole in a round
  async getHoleById(roundId, holeId) {
    try {
      const holeDoc = doc(db, "rounds", roundId, "holes", holeId)
      const holeSnapshot = await getDoc(holeDoc)

      if (!holeSnapshot.exists()) {
        throw new Error("Hole not found")
      }

      return {
        id: holeSnapshot.id,
        ...holeSnapshot.data()
      }
    } catch (error) {
      console.error(`Error fetching ${holeId} in round ${roundId}:`, error)
      throw error
    }
  }

  // This one fetches all of the shots made on a hole
  async getShotsOnHole(roundId, holeId) {
    try {
      const shotsCollection = collection(db, "rounds", roundId, "holes", holeId, "shots")
      // Sorting the query by the time when the shot was hit
      const shotsQuery = query(shotsCollection, orderBy("timestamp", "asc"))
      const shotsSnapshot = await getDocs(shotsQuery)

      return {
        id: shotsSnapshot.id,
        ...shotsSnapshot.data()
      }

    } catch (error) {
      console.error(`Error fetching shots for hole: ${holeId} in round: ${roundId}:`, error)
      throw error
    }
  }
}

const firebaseManager = new FirebaseManager()

export default firebaseManager

