import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Collections from './collections_dash';
import Searchbar from './searchbar';
import NavBar from './navbar';

export default function Home() {
  return (
      <div className="px-0 py-8">
      {/* <div className={styles.container}> */}
      <Head>
        <title>DogeTTM</title>
        <meta name="description" content="Your #1 NFT insights page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen p-16 justify-center items-center">
        <NavBar/>
        <Collections/>
      </main>
    </div>
  )
}
