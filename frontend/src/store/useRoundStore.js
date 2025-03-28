import { create } from "zustand"
import { toast } from "react-hot-toast"
import { axiosInstance } from "../lib/axios.js"
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
    set({ isHolesLoading: true, isScoreLoading: true })
    // Loading the holes now
    try {
      // Getting the selected course from our api
      const response = await axiosInstance.get(`/course/${selectedRound.courseId}`)
      // Setting our selected course
      set({ selectedCourse: response.data, courseHoles: response.data.holes })

      console.log(response.data.holes)

      // Getting the hole data for the round from the user
      const holeData = await firebaseManager.getHolesForRound(selectedRound.id)
      // Sorting by hole number
      holeData.sort((a, b) => a.holeNum - b.holeNum)
      set({ roundHoles: holeData })
    } catch (error) {
      toast.error(`Error getting holes for round: ${selectedRound}: ${error}`)
    } finally {
      set({ isHolesLoading: false, isScoreLoading: false })
    }
  }
})
)