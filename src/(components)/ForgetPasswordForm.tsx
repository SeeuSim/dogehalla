import React, { useState } from 'react'

interface FormData {
  email: string
}

const ForgotPasswordForm = () => {
  // Use the useState hook to manage the form data
  const [formData, setFormData] = useState<FormData>({
    email: '',
  })

  // Function to handle the form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Send a request to the server to reset the user's password
    fetch('/forgot-password', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Show a success message to the user
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
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={formData.email}
        onChange={(event) =>
          setFormData({ ...formData, email: event.target.value })
        }
      />
      <button type="submit">Reset Password</button>
    </form>
  )
}

export default ForgotPasswordForm
