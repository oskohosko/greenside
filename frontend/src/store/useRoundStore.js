import { create } from "zustand"
import { toast } from "react-hot-toast"
import firebaseManager from "../lib/firebase"


export const useRoundStore = create((set, get) => ({
  // Lists of rounds, holes and scores
  rounds: [],
  holes: [],
  scores: [],
  // Our selected round will dictate holes and scores
  selectedRound: null,

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
  setSelectedRound: (selectedRound) => set({ selectedRound })
})
)