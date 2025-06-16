"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const BookCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: "front-cover",
      title: "Front Cover",
      content: (
        <div className="flex justify-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CoverFront.jpg-qjxECwx5vjleZ1ZMfIMA8NJVykm265.jpeg"
            alt="മാത്രുതികമുകിൽ Front Cover"
            className="max-h-96 w-auto rounded-lg shadow-2xl"
          />
        </div>
      ),
    },
    {
      id: "back-cover",
      title: "Back Cover",
      content: (
        <div className="flex justify-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CoverBack.jpg-jyi2x8kYhCxM8diruJ2Tgi70BiSFBI.jpeg"
            alt="മാത്രുതികമുകിൽ Back Cover"
            className="max-h-96 w-auto rounded-lg shadow-2xl"
          />
        </div>
      ),
    },
    {
      id: "sample-poem-1",
      title: "Sample Poem - മഴ",
      content: (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-center text-blue-800">മഴ</h3>
          <div className="text-lg leading-relaxed text-center">
            <p className="mb-2">മഴയുടെ സംഗീതം</p>
            <p className="mb-2">എന്റെ ഹൃദയത്തിൽ</p>
            <p className="mb-2">ഒരു പുതിയ താളം തീർക്കുന്നു</p>
            <p className="mb-2">ഓർമ്മകളുടെ തീരത്ത്</p>
            <p>ഞാൻ നിന്നെ കാണുന്നു</p>
          </div>
        </div>
      ),
    },
    {
      id: "sample-poem-2",
      title: "Sample Poem - അമ്മ",
      content: (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-center text-blue-800">അമ്മ</h3>
          <div className="text-lg leading-relaxed text-center">
            <p className="mb-2">അമ്മയുടെ സ്നേഹം</p>
            <p className="mb-2">ഒരു മഹാസമുദ്രം പോലെ</p>
            <p className="mb-2">അതിരില്ലാതെ ഒഴുകുന്നു</p>
            <p className="mb-2">എന്റെ ജീവിതത്തിന്റെ</p>
            <p>നിത്യ പ്രകാശം</p>
          </div>
        </div>
      ),
    },
    {
      id: "authors-note",
      title: "Author's Note",
      content: (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-center text-blue-800">Author's Note</h3>
          <div className="text-base leading-relaxed">
            <p className="mb-4 italic">
              "Poetry has been my companion through the seasons of life. Each verse in this collection carries the
              essence of my experiences as a teacher, a mother, and a woman who has witnessed the beautiful tapestry of
              Kerala's culture."
            </p>
            <p className="mb-4">
              This collection, 'മാത്രുതികമുകിൽ' (Maternal Cloud), represents a lifetime of observations, emotions, and
              reflections. From the classroom where I nurtured young minds to the quiet moments of introspection, these
              poems are born from the heart.
            </p>
            <p className="text-right font-semibold">- Marykutty Thomas</p>
          </div>
        </div>
      ),
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={prevSlide}
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h3 className="text-xl font-semibold text-slate-800">{slides[currentSlide].title}</h3>

        <Button
          onClick={nextSlide}
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="min-h-[400px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {slides[currentSlide].content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-blue-500 scale-125" : "bg-blue-200 hover:bg-blue-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default BookCarousel
