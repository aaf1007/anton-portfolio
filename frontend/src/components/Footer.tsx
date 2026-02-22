import { FaLinkedinIn } from "react-icons/fa";
import { FaGithubAlt } from "react-icons/fa";
import { AiTwotoneMail } from "react-icons/ai";

export default function Footer() {
    return (
        <div id="contact" className="min-h-[24vh] md:min-h-[30vh]">
            <hr className="border-primary/20" />
            <div className="flex flex-col items-center justify-center w-full gap-6 md:gap-8 pt-6 md:pt-[8vh]">
                <p className="text-[1.25rem] md:text-[1.5rem] text-primary">Contact</p>
                <ul className="flex flex-col md:flex-row md:justify-around gap-4 md:gap-0 w-full md:w-[80%] px-4 text-[0.95rem] md:text-[1rem] text-foreground/75 font-medium">
                    <li><a target="_blank" href="https://www.linkedin.com/in/antonflorendo/" className="hover:text-accent-light flex items-center gap-2"><FaLinkedinIn className="text-foreground/75" />LinkedIn</a></li>
                    <li><a target="_blank" href="https://github.com/aaf1007" className="hover:text-accent-light flex items-center gap-2"><FaGithubAlt className="text-foreground/75" />GitHub</a></li>
                    <li><a target="_blank" href="mailto:aaf13@sfu.ca" className="hover:text-accent-light flex items-center gap-2"><AiTwotoneMail className="text-foreground/75" />SFU Email</a></li>
                </ul>
            </div>
        </div>
    )
}