export const VerifyEmail = ({ name, link } : { name: string, link: string}) => ({
  subject: "Verify Email Address for DogeTTM",
  body: (
    <div>
      <p>Hello {name}!</p>
      <p>
        Thanks for registering for an account on DogeTTM! Before we get started, <br/>
        we just need to confirm that this is you. Click below to verify your email <br/>
        address: <br/>
        <a href={link}>Verify Email</a>
      </p>
    </div>
  )
});