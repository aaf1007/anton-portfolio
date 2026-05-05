import LifeCards from "@/components/LifeCards"
import { useMotionVariants } from "@/lib/motion"
import { motion } from "motion/react"

export default function LifePage() {
    const item = useMotionVariants();
    return (
        <div className="md:max-w-[1400px] mx-auto h-full w-full">
            <motion.h1
                className="text-3xl tracking-wider pl-2"
                variants={item}
                initial="hidden"
                animate="show"
            >
                2026
            </motion.h1>
            <LifeCards />
        </div>
    )
}