// In a new file called SignUpForm.tsx
import React, { useState } from 'react'

interface FormData {
  username: string
  password: string
  rememberMe: boolean
}

const SignUpForm = () => {
  // Use the useState hook to manage the form data
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    rememberMe: false,
  })

  // Function to handle the form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Send a request to the server to sign up the user
    fetch('/signup', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Redirect the user to another page or show a success message
        } else {
          // Show an error message to the user
        }
      })
      .catch((error) => {
        // Handle any errors that occur
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={formData.username}
        onChange={(event) =>
          setFormData({ ...formData, username: event.target.value })
        }
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={formData.password}
        onChange={(event) =>
          setFormData({ ...formData, password: event.target.value })
        }
      />
      <label htmlFor="rememberMe">
        <input
          type="checkbox"
          id="rememberMe"
          checked={formData.rememberMe}
          onChange={(event) =>
            setFormData({ ...formData, rememberMe: event.target.checked })
          }
        />
        Remember me
      </label>
      <button type="submit">Sign Up</button>
    </form>
  )
}

export default SignUpForm
