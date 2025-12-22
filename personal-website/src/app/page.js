import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Research from '@/components/Research'
import Music from '@/components/Music'
import Photos from '@/components/Photos'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <Research />
      <Music />
      <Photos />
      <Footer />
    </main>
  )
}