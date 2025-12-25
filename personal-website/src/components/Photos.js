'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { photosData } from '@/data/photos'

export default function Photos() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  return (
    <section id="photos" className="bg-white" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-gray-900">Photography</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Some of my favorite photographs my family and I have taken over the years!
          </p>
        </motion.div>

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {photosData.map((photo, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              whileHover={{ scale: 1.05 }}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer shadow-lg"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-semibold">{photo.title}</h3>
                  <p className="text-sm">{photo.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative max-w-4xl max-h-[90vh] w-full"
          >
            <button
              className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300 z-10"
              onClick={() => setSelectedPhoto(null)}
            >
              ×
            </button>
            <div className="relative w-full h-[70vh]">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="bg-white p-6 rounded-b-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedPhoto.title}
              </h3>
              <p className="text-gray-600 mb-1">{selectedPhoto.location}</p>
              <p className="text-gray-700">{selectedPhoto.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}