import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

// Handling the user signup
export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body

  try {
    // Ensuring password length
    if (password.trim().length < 7) {
      return res.status(400).json({ message: "Password must be at least 7 characters" })
    }

    // Ensuring all fields are filled
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      return res.status(400).json({ message: "All fields must be non-empty." })
    }

    // Ensuring passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." })
    }

    // Checking if email already exists
    const user = await User.findOne({ email })
    if (user) {
      res.status(400).json({ message: "Email already exists." })
    }

    // Encrypting password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    })

    if (newUser) {
      // Generating the token
      generateToken(newUser._id, res)
      // And saving the user to the DB
      await newUser.save()
      res.status(201).json({
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }

  } catch (err) {
    console.log("Error in signup controller", err.message)
    res.status(500).json("Internal Error")
  }
}

// Handling the login of the user
export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // Checking if user exists in the db
    const user = await User.findOne({ email })

    // If they don't exist.
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Now checking if the passwords match
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // If all is correct, we generate the token for the user
    generateToken(user._id, res)

    // Sending back the user details
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

// Handling logout of the user
export const logout = (req, res) => {
  // Remove the token from the user and have it expire immediately
  try {
    // Removing cookie and expiring immediately
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "Logged out successfully." })
    // Handling errors
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const checkAuth = (req, res) => {
  // Sending user back to the client
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("Error in checkAuth controller.", error.message)
    res.status(500).json({ message: "Internal Server Error." })
  }
}
