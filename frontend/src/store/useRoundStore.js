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
  shots: new Map(),
  // Holes with location and par data (aws)
  courseHoles: [],
  // Our selected round will dictate holes and scores
  selectedRound: null,
  selectedCourse: null,
  selectedHole: null,
  // Flags for loading skeletons
  isRoundsLoading: false,
  isScoreLoading: false,
  isHolesLoading: false,

  // Function to get the rounds from our Firebase
  getAllRounds: async () => {
    // Setting our loading flag
    set({ isRoundsLoading: true })
    try {
      // Calling firebase manager and populating rounds list
      const roundsData = await firebaseManager.getAllRounds()
      set({ rounds: roundsData })
    } catch (error) {
      toast.error("Error when getting rounds:", error)
    } finally {
      set({ isRoundsLoading: false })
    }
  },
  getRound: async (roundId) => {
    const { setSelectedRound } = get()
    try {
      // Getting round data from firebase
      const roundData = await firebaseManager.getRoundById(roundId)
      // And setting selected round with this one
      await setSelectedRound(roundData)
    } catch (error) {
      toast.error(`Error getting round: ${roundId}: ${error}`)
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

      // Getting the hole data for the round from the user
      const holeData = await firebaseManager.getHolesForRound(selectedRound.id)
      // Sorting by hole number
      holeData.sort((a, b) => a.holeNum - b.holeNum)
      set({ roundHoles: holeData })
      // console.log(holeData)

    } catch (error) {
      toast.error(`Error getting holes for round: ${selectedRound}: ${error}`)
    } finally {
      set({ isHolesLoading: false, isScoreLoading: false })
    }
  },
  getShotsForHole: async (hole) => {
    // Getting the selected round
    const { selectedRound, shots } = get()
    // Id for getting the shots, num for hashing
    const holeId = hole.id
    const holeNum = hole.holeNum

    try {
      const shotData = await firebaseManager.getShotsOnHole(selectedRound.id, holeId)
      // Using a map so we don't generate shots for holes we already have data for.
      set({ shots: shots.set(holeNum, shotData) })
    } catch (error) {
      toast.error(`Error getting shots for hole: ${holeNum}`)
      console.error(error)
    }
  },
  resetShots: () => {
    set({ shots: new Map() })
  },
  // Updates the user's selected hole
  setSelectedHole: (hole) => {
    set({ selectedHole: hole })
  }
})
)