


// Function to get the course based on Id
export const getCourse = async (req, res) => {
  try {
    // Getting course Id from query
    const { id: courseId } = req.params

    // Now making the API call
    const requestURL = process.env.COURSE_REQUEST_URL + courseId + ".json"
    // Sending the data
    fetch(requestURL).then(
      response => response.json()
    ).then(
      data => {
        res.status(201).json(data)
      }
    )
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}