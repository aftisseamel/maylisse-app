import { login, signup } from './action'

export default function LoginPage() {
  return (
    <form action={login}>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}> Log in </button>
      <p> </p>
      <button formAction={signup}> Sign up</button>
    </form>
  )
}