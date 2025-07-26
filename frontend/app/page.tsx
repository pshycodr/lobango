import About from "@/components/HomePage/About";
import Hero from "@/components/HomePage/Hero";
import Promo from "@/components/HomePage/Promo";
import Nav from "@/components/NavBar/Nav";
import { Suspense } from "react";



export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}



function HomeContent() {
  return (
    <>
      <Nav />
      <Hero />
      <Promo/>
      <About />
    </>
  )
}