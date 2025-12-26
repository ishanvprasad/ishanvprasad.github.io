'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

export default function Music() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)

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
              <motion.div
                key={playlist.id}
                variants={cardVariants}
                whileHover={{ scale: 1.05, rotate: 1 }}
                onClick={() => setSelectedPlaylist(playlist)}
                className="card group cursor-pointer"
              >
                <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={playlist.images[0]?.url || '/placeholder.png'}
                    alt={playlist.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-5xl">▶</div>
                  </div>
                </div>
                <h3 className="text-gray-900 group-hover:text-purple-600 transition-colors">
                  {playlist.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {playlist.tracks.total} tracks
                </p>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {playlist.description || 'No description'}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Spotify Player Modal */}
      <AnimatePresence>
        {selectedPlaylist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPlaylist(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-900 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-lg transition-all hover:scale-110"
                onClick={() => setSelectedPlaylist(null)}
              >
                ×
              </button>

              {/* Playlist Header */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-white">
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-xl flex-shrink-0">
                    <Image
                      src={selectedPlaylist.images[0]?.url || '/placeholder.png'}
                      alt={selectedPlaylist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2 opacity-90">PLAYLIST</p>
                    <h3 className="text-3xl font-bold mb-2">{selectedPlaylist.name}</h3>
                    <p className="text-sm opacity-90">
                      {selectedPlaylist.owner.display_name} • {selectedPlaylist.tracks.total} tracks
                    </p>
                  </div>
                </div>
              </div>

              {/* Spotify Embed */}
              <div className="p-6 bg-gray-50">
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${selectedPlaylist.id}?utm_source=generator&theme=0`}
                  width="100%"
                  height="380"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg shadow-inner"
                ></iframe>
              </div>

              {/* Footer Actions */}
              <div className="p-6 bg-white border-t border-gray-200 flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                  {selectedPlaylist.description || 'Curated with care'}
                </p>
                <a
                  href={selectedPlaylist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex items-center gap-2"
                >
                  <span>Open in Spotify</span>
                  <span>↗</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}