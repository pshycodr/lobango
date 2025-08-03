import { createFileRoute } from '@tanstack/react-router'
import Header from '../components/Signup/Header'
import SignInForm from '../components/Signup/SinupForm'

export const Route = createFileRoute('/Signin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="min-h-screen bg-[var(--smoky-black-1)] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Header />
        <SignInForm />
      </div>
    </div>
    </>
  )
}
