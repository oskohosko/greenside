import { create } from "zustand"
import { toast } from "react-hot-toast"
import firebaseManager from "../lib/firebase"

export const useRoundStore = create((set, get) => ({
  // Lists of rounds, holes and scores
  rounds: [],
  // Holes with user score data included (firebase)
  roundHoles: [],
  scores: [],
  // Our selected round will dictate holes and scores
  selectedRound: null,
  selectedCourse: null,
  // Holes with location and par data (aws)
  courseHoles: [],
  // Flags for loading skeletons
  isRoundsLoading: false,
  isScoreLoading: false,
  isHolesLoading: false,

  // Function to get the rounds from our Firebase
  getRounds: async () => {
    // Setting our loading flag
    set({ isRoundsLoading: true })
    try {
      // Calling firebase manager and populating rounds list
      const roundData = await firebaseManager.getAllRounds()
      set({ rounds: roundData })
    } catch (error) {
      toast.error("Error when getting rounds:", error)
    } finally {
      set({ isRoundsLoading: false })
    }
  },
  setSelectedRound: async (selectedRound) => {
    // Updating our selected round
    set({ selectedRound })
    console.log(selectedRound)
    set({ isHolesLoading: true })
    // Loading the holes now
    try {
      // Getting the hole location and par data from the round
      const requestURL = import.meta.env.VITE_COURSE_REQUEST_URL + selectedRound.courseId + ".json"
      // Saving data as the selectedCourse
      fetch(requestURL).then(
        response => response.json()
      ).then(
        data => {
          set({ selectedCourse: data })
          console.log(data)
        }
      )
      // Now let's see if it worked


      // Getting the hole data for the round from the user
      const holeData = await firebaseManager.getHolesForRound(selectedRound.id)
      set({ holes: holeData })
      console.log(holeData)
    } catch (error) {
      toast.error(`Error getting holes for round: ${selectedRound}: ${error}`)
    } finally {
      set({ isHolesLoading: false })
    }
  }
})
)