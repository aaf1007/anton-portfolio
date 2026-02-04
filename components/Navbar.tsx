import "./styles.css";
import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center fixed top-0 px-10 py-4">
        <div className="text-xl"><Link href="/" className="hover:font-bold">Anton Florendo</Link></div>
        <ul className="flex text-xl gap-7">
            <li><Link href="/" className="hover:text-[#404080] hover:font-semibold">Home</Link></li>
            <li><Link href="/projects" className="hover:text-[#404080] hover:font-semibold">Projects</Link></li>
            <li><Link href="/contact" className="hover:text-[#404080] hover:font-semibold">Contact</Link></li>
        </ul>
    </nav>
  );
}