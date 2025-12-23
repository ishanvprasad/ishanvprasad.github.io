'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="home" className="relative bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-gray-900">
              <span className="text-blue-600">Ishan Verma Prasad</span>
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 mb-4"
          >
            Computers • Music • History
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
          >
            I enjoy conducting research, learning about the underpinnings of machine learning, listening to music, and discussing current events.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex gap-4 justify-center"
          >
            <a href="#research" className="btn btn-primary">
              View Research
            </a>
            <a
              href="mailto:your.email@example.com"
              className="btn"
              style={{
                background: 'white',
                color: 'var(--primary)',
                border: '2px solid var(--primary)',
              }}
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 left-20 w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-3xl"
      />
    </section>
  )
}