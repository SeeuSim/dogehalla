import React from 'react';

function SignUpForm() {
  return (
    <form>
      <label>
        Email:
        <input type="email" name="email" />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" />
      </label>
      <br />
      <input type="submit" value="Sign Up" />
    </form>
  );
}
