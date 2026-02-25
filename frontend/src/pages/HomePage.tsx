import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import profileImage from "@/assets/P6140340.png";
import StackIcon from "tech-stack-icons";

const coursework = ["Intro to Artificial Intelligence", "Intro to Software Engineering", "Linear Algebra", "Business Statistics"];

export default function HomePage() {
    const { hash } = useLocation();

    useEffect(() => {
        if (!hash) return;
        const id = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (hash === "#contact") {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                } else if (hash === "#home") {
                    document.getElementById("home")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        });
        return () => cancelAnimationFrame(id);
    }, [hash]);

    return (
        <div>
            <div className="flex flex-col gap-8 md:gap-10 md:h-dvh min-h-0 mb-12 md:mb-0">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0 mt-2 md:mt-4">
                    <div className="min-w-0">
                        <p className="font-medium text-[1.5rem] md:text-[2rem] tracking-wider text-primary/70">portfolio:$ <span className="text-primary-dark">anton</span></p>
                        <div className="bg-peach-soft/80 border border-tan-muted/30 rounded-lg p-4 md:p-6 mr-0 md:mr-12 shadow-sm backdrop-blur-sm">
                            <div className="flex gap-2 mb-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-primary/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-primary/20"></div>
                            </div>
                            <div className="font-mono leading-relaxed text-sm md:text-base">
                                <p className="mb-4">
                                    <span className="text-primary/70 font-bold">anton@portfolio:$</span> aboutme
                                </p>
                                <p>
                                    I'm a Data Science student at SFU who enjoys building full-stack web apps and recently got into AI/ML. Some of my hobbies include playing tennis, basketball and spending way too much time at the gym. I also love to listen to music watching movies on my free time.
                                </p>
                                <div className="mt-4 flex items-center">
                                    <span className="text-primary/70 font-bold mr-2">anton@portfolio:$</span>
                                    <span className="cursor-blink"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img src={profileImage} alt="" className="w-40 md:w-56 h-auto self-center md:self-auto shrink-0" />
                </div>
                <div>
                    <p className="font-medium text-[1.2rem] md:text-[1.4rem] text-primary/70">Interested In</p>
                    <p className="text-sm md:text-base">Full-Stack Development, AI/ML, and Distributed System. I am working on projects that combine impact and technical challenges.</p>
                </div>
                <div className="flex md:w-[80%] justify-between flex-col md:flex-row gap-5">
                    <div>
                        <p className="font-medium text-[1.2rem] md:text-[1.4rem] text-primary/70">Current Coursework</p>
                        <ul className="list-disc m-0 pl-5 text-sm md:text-base">
                            {coursework.map(cur => (
                                <li key={cur}>{cur}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="font-medium text-[1.2rem] md:text-[1.4rem] text-primary/70">Hobbies</p>
                        <ul className="list-disc m-0 pl-5 text-sm md:text-base">
                            <li>gyming</li>
                            <li>cooking</li>
                            <li>eating</li>
                            <li>coding</li>
                        </ul>
                    </div>
                </div>
                <div className="w-full">
                    <p className="font-medium text-[1.2rem] md:text-[1.4rem] text-primary/70">Tech Stack</p>
                    <div className="w-full flex gap-2 pl-1 flex-wrap"> 
                        <StackIcon name="typescript" className="w-[3rem]" />
                        <StackIcon name="java" className="w-[3rem]" />
                        <StackIcon name="python" className="w-[3rem]" />
                        <StackIcon name="react" className="w-[3rem]" />
                        <StackIcon name="nextjs" className="w-[3rem]" />
                        <StackIcon name="spring" className="w-[3rem]" />
                        <StackIcon name="tailwindcss" className="w-[3rem]" />
                    </div>
                </div>
            </div>
        <Footer/>
        </div>
    )
}