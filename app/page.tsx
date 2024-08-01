import Image from "next/image"
import { Exchanger } from "../components/Exchanger"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-16">
      <h1 className="text-white text-6xl font-bold	">The Exchanger</h1>
      <Exchanger />
    </main>
  )
}
