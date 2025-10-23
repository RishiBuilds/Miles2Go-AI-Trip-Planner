'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@clerk/nextjs'
import { ArrowRight, Globe2, Landmark, Plane, MapPin, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'

export const suggestions = [
  {
    title: 'Create New Trip',
    icon: <Globe2 className='h-4 w-4' />,
  },
  {
    title: 'Inspire Me',
    icon: <Sparkles className='h-4 w-4' />,
  },
  {
    title: 'Hidden Gems',
    icon: <Landmark className='h-4 w-4' />,
  },
  {
    title: 'Adventure Trips',
    icon: <Plane className='h-4 w-4' />,
  },
]

const Hero = () => {
  const { user } = useUser()
  const router = useRouter()
  const [tripQuery, setTripQuery] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onSend = () => {
    if (!user) {
      router.push('/sign-in')
      return
    }
    router.push('/create-new-trip')
  }

  const handleSuggestionClick = (title: string) => {
    if (!user) {
      router.push('/sign-in')
      return
    }

    const queryMap: { [key: string]: string } = {
      'Create New Trip': 'Plan a trip to ',
      'Inspire Me': 'Show me inspiring destinations for ',
      'Hidden Gems': 'Find hidden gems in ',
      'Adventure Trips': 'Plan an adventure trip to '
    }

    setTripQuery(queryMap[title] || '')
    onSend()
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background"></div>

      <div className="relative pt-8 md:pt-12 pb-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center space-y-4 md:space-y-5"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Badge */}
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">AI-Powered Travel Planning</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={item}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center px-4"
            >
              <span className="text-foreground">
                Plan Your Perfect Trip
              </span>
              <br />
              <span className="text-primary">
                Powered by AI
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={item}
              className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center px-4"
            >
              Create personalized itineraries in seconds. From destinations to accommodations—let AI handle the planning.
            </motion.p>

            {/* Input Box */}
            <motion.div
              variants={item}
              className="max-w-3xl mx-auto mt-6 px-4"
            >
              <div className="relative">
                <motion.div
                  className="relative bg-background border-2 border-border rounded-2xl p-3 shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.005 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className="pointer-events-none absolute left-6 top-6 text-muted-foreground">
                    <Globe2 className="h-5 w-5" />
                  </div>
                  <Textarea
                    value={tripQuery}
                    onChange={(e) => setTripQuery(e.target.value)}
                    placeholder="Describe your trip (e.g., 5-day beach vacation in Goa)"
                    className="w-full h-24 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none text-base md:text-lg pl-12 pr-4 py-4 placeholder:text-muted-foreground/60 text-foreground"
                    aria-label="Trip planning prompt"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        onSend()
                      }
                    }}
                  />
                  <div className="flex items-center justify-end px-2 pt-3 border-t border-border/50 mt-2">
                    <Button
                      size="lg"
                      className="rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 font-semibold text-white dark:text-black"
                      aria-label="Start planning your trip"
                      onClick={onSend}
                    >
                      <span className="mr-2">Start Planning</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Suggestions */}
            <motion.div
              variants={item}
              className="max-w-4xl mx-auto pt-4 px-4"
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.title)}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background hover:bg-accent hover:border-primary/30 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    aria-label={suggestion.title}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-muted-foreground group-hover:text-primary transition-colors">
                      {suggestion.icon}
                    </div>
                    <span className="text-xs md:text-sm font-medium">{suggestion.title}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Hero