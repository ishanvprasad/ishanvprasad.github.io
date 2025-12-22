'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

export default function Music() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/spotify')
      .then(res => res.json())
      .then(data => {
        setPlaylists(data.playlists || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching playlists:', err)
        setLoading(false)
      })
  }, [])

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="music" className="bg-gradient-to-br from-purple-50 to-pink-50" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-gray-900">My Music</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Music is my companion through late-night coding sessions and historical deep dives.
            Here are some of my curated playlists.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {playlists.map((playlist, index) => (
              <motion.a
                key={playlist.id}
                href={playlist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                variants={cardVariants}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="card group cursor-pointer"
              >
                <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={playlist.images[0]?.url || '/placeholder.png'}
                    alt={playlist.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-gray-900 group-hover:text-purple-600 transition-colors">
                  {playlist.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {playlist.tracks.total} tracks
                </p>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {playlist.description}
                </p>
              </motion.a>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}