import { create } from "zustand"
import { toast } from "react-hot-toast"
import { axiosInstance } from "../lib/axios.js"
import firebaseManager from "../lib/firebase"
import { haversineDistance } from "../utils/utils.js"

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
  isShotsLoading: false,
  isInsightsLoading: false,
  longestDrive: { distance: 0, hole: null },
  bestApproach: { ratio: Infinity, distance: 0, prevDistance: 0, hole: null },

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
    set({ isShotsLoading: true })
    // Getting the selected round
    const { selectedRound, shots } = get()
    // Id for getting the shots, num for hashing
    const holeId = hole.id
    const holeNum = hole.holeNum

    try {
      const shotData = await firebaseManager.getShotsOnHole(selectedRound.id, holeId)
      shotData.sort((a, b) => a.time - b.time)
      // Using a map so we don't generate shots for holes we already have data for.
      set({ shots: shots.set(holeNum, shotData) })
    } catch (error) {
      toast.error(`Error getting shots for hole: ${holeNum}`)
      console.error(error)
    } finally {
      set({ isShotsLoading: false })
    }
  },
  getInsights: async () => {
    // Getting the selected round
    const { selectedRound, roundHoles, getShotsForHole, shots } = get()
    set({ isInsightsLoading: true })

    try {
      // Getting shots for each hole
      for (let hole of roundHoles) {
        // Getting the shots for the hole
        if (!shots.get(hole.holeNum)) {
          await getShotsForHole(hole)
        }
      }
    } catch (error) {
      toast.error(`Error getting insights for round: ${selectedRound.id}: ${error}`)
      console.error(error)
    } finally {
      // Once shots have loaded, we can get the insights
      const { shots, longestDrive, bestApproach } = get()
      // Going through each hole
      for (let i = 1; i < roundHoles.length + 1; i++) {
        // And going through each shot for the hole
        const holeShots = shots.get(i)

        if (holeShots) {
          for (let j = 1; j < holeShots.length; j++) {
            const prevShot = holeShots[j - 1]
            const currentShot = holeShots[j]
            const nextShot = holeShots[j + 1]

            // Firstly getting longest drive
            // Getting distance from previous shot
            const distanceFromPrevious = Math.round(
              haversineDistance(
                { latitude: prevShot.userLat, longitude: prevShot.userLong },
                { latitude: currentShot.userLat, longitude: currentShot.userLong }
              )
            )
            // console.log("Hole: ", i)
            // console.log("Current shot: ", currentShot)
            // console.log("Previous shot: ", prevShot)
            // console.log("Distance from previous: ", distanceFromPrevious)
            if (distanceFromPrevious > longestDrive.distance) {

              longestDrive.distance = distanceFromPrevious
              longestDrive.hole = i
            }
            // Then getting best approach
            // Getting distanceToPin for next shot and current shot
            if (nextShot) {
              const distanceToPin = currentShot.distanceToPin
              const nextDistanceToPin = nextShot.distanceToPin
              const ratio = nextDistanceToPin / distanceToPin
              // If the ratio is better than the current best, we set it
              if (ratio < bestApproach.ratio) {
                bestApproach.ratio = ratio
                bestApproach.distance = nextDistanceToPin
                bestApproach.prevDistance = distanceToPin
                bestApproach.hole = i
              }
            }
          }
        }
      }
      set({ longestDrive, bestApproach })
      set({ isInsightsLoading: false })
      console.log("Longest Drive: ", longestDrive)
      console.log("Best Approach: ", bestApproach)
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