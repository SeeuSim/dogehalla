//Server-side code
import express from 'express'
import bodyParser from 'body-parser'

const app = express()

// Use body-parser to parse form data
app.use(bodyParser.json())

interface SignUpFormData {
  username: string
  password: string
  rememberMe: boolean
}

// Set up a route to handle the sign up form submission
app.post('/signup', (req, res) => {
  // Get the user data from the form submission
  const formData = req.body as SignUpFormData

  // Validate the user data
  if (!formData.username || !formData.password) {
    // Send an error response if the data is invalid
    return res.status(400).json({ error: 'Username and password are required.' })
  }

  //TODO: Save the user to your database 

  // Set a cookie to store the user's information if they choose "remember me"
  if (formData.rememberMe) {
    //TODO: Set the cookie with an expiration date
  }

  // Send a response to the client
  res.json({ success: true })
})

// Set up a route to handle the forget password form submission
app.post('/forgot-password', (req, res) => {
  // Get the email address from the form submission
  const { email } = req.body

  // Validate the email address
  if (!email) {
    // Send an error response if the email address is not provided
    return res.status(400).json({ error: 'An email address is required.' })
  }

  //TODO: Generate a reset password token and send it to the user

  // Send a response to the client
  res.json({ success: true })
})
