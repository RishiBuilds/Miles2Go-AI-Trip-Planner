'use client'
import HeroVideoDialog from '@/components/magicui/hero-video-dialog'
import { motion } from 'motion/react'

const VideoSection = () => {
    return (
        <section className="w-full py-16 px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex flex-col items-center gap-4 mb-10">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/50 to-border"></div>
                            <span className="text-base font-semibold">See it in action</span>
                            <div className="h-px w-16 bg-gradient-to-l from-transparent via-primary/50 to-border"></div>
                        </div>
                    </div>

                    <motion.div
                        className="relative group"
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary via-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative">
                            <HeroVideoDialog
                                className="block w-full rounded-2xl overflow-hidden shadow-2xl border border-border/50"
                                animationStyle="from-center"
                                videoSrc="https://www.youtube.com/embed/qpeGHPfFyNY"
                                thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg?p=facebook"
                                thumbnailAlt="Miles2Go Demo Video"
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="pt-12"
                >
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                        <motion.div
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">AI-Powered</span>
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Instant Results</span>
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            <span className="text-sm font-medium text-purple-700 dark:text-purple-400">Personalized</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default VideoSection
