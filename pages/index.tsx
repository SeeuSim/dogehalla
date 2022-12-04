import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Collections from './collections_dash';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>DogeTTM</title>
        <meta name="description" content="Your #1 NFT insights page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen p-16 justify-center items-center">
        {Collections()}
      </main>
    </div>
  )
}
