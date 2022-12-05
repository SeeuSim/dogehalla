import Collections from './collectionsdash'
import NavBar from './navbar'

export default function Home() {
  return (
    <div>
      <main className="min-h-screen p-16 justify-center items-center">
        <NavBar/>
        <Collections/>
      </main>
    </div>
  )
}
