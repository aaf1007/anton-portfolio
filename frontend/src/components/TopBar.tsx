import { Link } from "react-router-dom";
import Logo from "./Logo";

/** The case studies' top bar: just the laptop-and-matcha mark, home on click. */
export default function TopBar() {
  return (
    <header className="top-nav">
      <Link to="/" className="nav-left" aria-label="Anton Florendo — home">
        <Logo className="nav-logo" />
      </Link>
    </header>
  );
}
