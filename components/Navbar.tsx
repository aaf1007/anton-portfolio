import Link from "next/link";

export default function Navbar() {
  return (
    <div>
        <nav className="flex justify-between items-center pr-6 pl-6 text-[1.1rem] pt-4
        font-medium ">
            <h1>Anton Florendo</h1>
            <ul className="flex gap-4">
                <li>
                    <Link href="/" className="hover:text-gray-500">Home</Link>
                </li>
                <li>
                    <Link href="/projects" className="hover:text-gray-500">Projects</Link>
                </li>
                <li>
                    <Link href="/contact" className="hover:text-gray-500">Contact</Link>
                </li>
            </ul>
        </nav>
    </div>
  );
}