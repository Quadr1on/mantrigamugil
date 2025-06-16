"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Volume2, VolumeX, ShoppingBag, Heart, Book, MapPin, Mail, Phone, ChevronDown } from "lucide-react"
import Navbar from "../components/Navbar"
import BookCarousel from "../components/BookCarousel"
import PoemCarousel from "../components/PoemCarousel"
import BillingPage from "../components/BillingPage"

function App() {
  const [isMuted, setIsMuted] = useState(true)
  const [showBilling, setShowBilling] = useState(false)
  const audioRef = useRef(null)

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

  useEffect(() => {
    if (!isMuted && audioRef.current) {
      audioRef.current.play()
    } else if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [isMuted])

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" })
  }

  const handleOrderClick = () => {
    setShowBilling(true)
  }

  const handleBackToBrowse = () => {
    setShowBilling(false)
  }

  if (showBilling) {
    return <BillingPage onBack={handleBackToBrowse} />
  }

  return (
    <div className="font-sans bg-gradient-to-br from-blue-50 via-white to-purple-50 text-slate-800 overflow-x-hidden">
      {/* Audio Player */}
      <audio ref={audioRef} src="/monsoon-sounds.mp3" loop />

      {/* Navbar */}
      <Navbar onOrderClick={handleOrderClick} />

      {/* Sound Toggle Button */}
      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label={isMuted ? "Unmute background sounds" : "Mute background sounds"}
      >
        {isMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {/* Hero Section */}
      <motion.section
        id="hero"
        style={{ opacity, scale }}
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 z-0"></div>

        <div className="container mx-auto px-4 z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              മാന്ത്രികമുകിൽ
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-600">by Marykutty Thomas</p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="relative w-64 h-80 md:w-80 md:h-96 mx-auto mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg transform rotate-3 opacity-20"></div>
              <img
                src="CoverFront.jpg"
                alt="മാന്ത്രികമുകിൽ book cover"
                className="relative z-10 w-full h-full object-cover rounded-lg shadow-2xl transform -rotate-3 transition-transform duration-500 hover:rotate-0"
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("about")}
              className="flex items-center justify-center mt-8 mx-auto text-blue-600"
            >
              <ChevronDown className="animate-bounce" size={32} />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              The Poet's Journey
            </h2>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="relative w-full aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full transform translate-x-2 translate-y-2"></div>
                  <img
                    src="author-photo.png"
                    alt="Marykutty Thomas"
                    className="relative z-10 w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div>
              </div>

              <div className="md:w-2/3">
                <p className="text-lg leading-relaxed mb-4">
                  Marykutty Thomas, a retired school teacher from the beautiful state of Kerala, has spent decades
                  nurturing young minds with the beauty of language and literature.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  After dedicating her life to education, she embarked on a new journey at the age of 68, compiling her
                  lifelong poetry into her first published collection, "മാന്ത്രികമുകിൽ" (Magical Cloud).
                </p>
                <p className="text-lg leading-relaxed">
                  Her poems reflect deep spiritual insights, maternal love, and the profound wisdom gained through a
                  lifetime of experiences. Each verse carries the gentle rhythm of the Malayalam language while touching
                  universal human emotions.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Poetry Preview Section */}
      <section id="poems" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Poetry Preview
            </h2>
            <p className="text-center text-slate-600 mb-12">
              Experience the beauty of Malayalam poetry through these sample pages
            </p>

            <PoemCarousel />
          </motion.div>
        </div>
      </section>

      {/* Purchase Section */}
      <section id="purchase" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Get Your Copy
            </h2>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-blue-100">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="md:w-1/3">
                  <motion.div whileHover={{ rotate: 3, scale: 1.05 }} className="relative w-48 h-64 mx-auto">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CoverFront.jpg-qjxECwx5vjleZ1ZMfIMA8NJVykm265.jpeg"
                      alt="മാന്ത്രികമുകിൽ book cover"
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                  </motion.div>
                </div>

                <div className="md:w-2/3 text-left">
                  <h3 className="text-2xl font-bold mb-2">മാന്ത്രികമുകിൽ</h3>
                  <p className="text-lg mb-2">by Marykutty Thomas</p>
                  <p className="text-blue-600 font-bold text-xl mb-4">₹350</p>
                  <p className="mb-4">Hardcover, 120 pages</p>
                  <p className="mb-6">Published by Manjari Books</p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOrderClick}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto md:mx-0"
                  >
                    <ShoppingBag size={18} />
                    Order Now
                  </motion.button>
                </div>
              </div>

              {/* Book Carousel */}
              <div className="border-t border-blue-100 pt-8">
                <h3 className="text-xl font-semibold mb-6">Explore the Book</h3>
                <BookCarousel />
              </div>

              <div className="border-t border-blue-100 pt-6 mt-8">
                <p className="text-sm text-slate-600 mb-4">Also available at:</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                    DC Books
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Mathrubhumi Books
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Amazon India
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Flipkart
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">മാത്രുതികമുകിൽ</h3>
              <p className="mb-4">A collection of Malayalam poetry by Marykutty Thomas</p>
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-red-400" />
                <span>Made with love for Malayalam literature</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Mail size={16} />
                  <a href="mailto:contact@matrukamukil.com" className="hover:underline">
                    contact@matrukamukil.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} />
                  <a href="tel:+919876543210" className="hover:underline">
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Kottayam, Kerala, India</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection("about")} className="hover:underline flex items-center gap-1">
                    <Book size={14} />
                    About the Author
                  </button>
                </li>
                <li>
                  <button onClick={handleOrderClick} className="hover:underline flex items-center gap-1">
                    <ShoppingBag size={14} />
                    Purchase Book
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("poems")} className="hover:underline flex items-center gap-1">
                    <Book size={14} />
                    Poetry Preview
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} മാത്രുതികമുകിൽ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
