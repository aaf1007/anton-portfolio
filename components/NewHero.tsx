import Link from "next/link";

export default function NewHero() {
    return (
        <div className="relative bg-[url('/hero.jpg')] bg-cover bg-center h-dvh w-full pb-10">
            {/* Vignette overlay: darker edges */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
                }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                <ul className="flex gap-[clamp(4.5rem,4vw,7rem)] text-[clamp(2rem,6vw,7rem)] font-normal text-white">
                    <li><Link href="#home" className="hover:underline underline-offset-30 decoration-1">About</Link></li>
                    <li><Link href="#projects" className="hover:underline underline-offset-30 decoration-1">Projects</Link></li>
                    <li><Link href="#life" className="hover:underline underline-offset-30 decoration-1">Life</Link></li>
                </ul>
            </div>
        </div>
    );
}