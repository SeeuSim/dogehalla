import React from 'react';

function ForgotPasswordForm() {
  return (
    <form>
      <label>
        Email:
        <input type="email" name="email" />
      </label>
      <br />
      <input type="submit" value="Send Password Reset Email" />
    </form>
  );
}