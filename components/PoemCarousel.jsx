"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const PoemCarousel = () => {
  const [currentPoem, setCurrentPoem] = useState(0)

  // Sample poem pages - in a real implementation, these would be actual images of poem pages
  const poemPages = [
    {
      id: 1,
      title: "മഴ",
      content: (
        <div className="w-full h-[600px] bg-white shadow-2xl rounded-lg p-12 flex flex-col justify-center items-center border border-gray-200">
          <h2 className="text-4xl font-bold mb-8 text-blue-800 text-center">മഴ</h2>
          <div className="text-xl leading-relaxed text-center space-y-4 max-w-md">
            <p>മഴയുടെ സംഗീതം</p>
            <p>എന്റെ ഹൃദയത്തിൽ</p>
            <p>ഒരു പുതിയ താളം തീർക്കുന്നു</p>
            <p>ഓർമ്മകളുടെ തീരത്ത്</p>
            <p>ഞാൻ നിന്നെ കാണുന്നു</p>
          </div>
          <div className="mt-8 text-sm text-gray-500">Page 1</div>
        </div>
      ),
    },
    {
      id: 2,
      title: "അമ്മ",
      content: (
        <div className="w-full h-[600px] bg-white shadow-2xl rounded-lg p-12 flex flex-col justify-center items-center border border-gray-200">
          <h2 className="text-4xl font-bold mb-8 text-blue-800 text-center">അമ്മ</h2>
          <div className="text-xl leading-relaxed text-center space-y-4 max-w-md">
            <p>അമ്മയുടെ സ്നേഹം</p>
            <p>ഒരു മഹാസമുദ്രം പോലെ</p>
            <p>അതിരില്ലാതെ ഒഴുകുന്നു</p>
            <p>എന്റെ ജീവിതത്തിന്റെ</p>
            <p>നിത്യ പ്രകാശം</p>
          </div>
          <div className="mt-8 text-sm text-gray-500">Page 2</div>
        </div>
      ),
    },
    {
      id: 3,
      title: "സമയം",
      content: (
        <div className="w-full h-[600px] bg-white shadow-2xl rounded-lg p-12 flex flex-col justify-center items-center border border-gray-200">
          <h2 className="text-4xl font-bold mb-8 text-blue-800 text-center">സമയം</h2>
          <div className="text-xl leading-relaxed text-center space-y-4 max-w-md">
            <p>സമയം ഒഴുകുന്നു</p>
            <p>നദി പോലെ</p>
            <p>നിർത്താനാവാത്ത</p>
            <p>ഒരു യാത്ര</p>
            <p>നിത്യതയിലേക്ക്</p>
          </div>
          <div className="mt-8 text-sm text-gray-500">Page 3</div>
        </div>
      ),
    },
    {
      id: 4,
      title: "സ്വപ്നം",
      content: (
        <div className="w-full h-[600px] bg-white shadow-2xl rounded-lg p-12 flex flex-col justify-center items-center border border-gray-200">
          <h2 className="text-4xl font-bold mb-8 text-blue-800 text-center">സ്വപ്നം</h2>
          <div className="text-xl leading-relaxed text-center space-y-4 max-w-md">
            <p>സ്വപ്നങ്ങളുടെ ചിറകിൽ</p>
            <p>ഞാൻ പറന്നുയരുന്നു</p>
            <p>മേഘങ്ങളെ തൊട്ട്</p>
            <p>നക്ഷത്രങ്ങളോട് സംസാരിച്ച്</p>
            <p>അനന്തതയിൽ ലയിക്കുന്നു</p>
          </div>
          <div className="mt-8 text-sm text-gray-500">Page 4</div>
        </div>
      ),
    },
  ]

  const nextPoem = () => {
    setCurrentPoem((prev) => (prev + 1) % poemPages.length)
  }

  const prevPoem = () => {
    setCurrentPoem((prev) => (prev - 1 + poemPages.length) % poemPages.length)
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-center mb-8">
        <Button
          onClick={prevPoem}
          variant="outline"
          size="icon"
          className="mr-4 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPoem}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.5 }}
              className="perspective-1000"
            >
              {poemPages[currentPoem].content}
            </motion.div>
          </AnimatePresence>
        </div>

        <Button
          onClick={nextPoem}
          variant="outline"
          size="icon"
          className="ml-4 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center space-x-2">
        {poemPages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPoem(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentPoem ? "bg-blue-500 scale-125" : "bg-blue-200 hover:bg-blue-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default PoemCarousel
