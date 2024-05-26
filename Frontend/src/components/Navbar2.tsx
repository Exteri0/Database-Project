import logo from '../assets/logo.png'
import Left from '../assets/Left.png'
import '../styles/components/navbar2.css'

export default function Navbar2() {
    return (
        <nav className="nav-bar2">
            <a className="logo-and-title" href="/">
                <span className="title">BookShelf</span>
                <img className="logo12" src={logo} alt="Logo" />
            </a>
            <a className="section" href="/dashboard/1/2">
                <span className="back">Books</span>
                <img className="back-arrow" src={Left} alt="" />
            </a>
        </nav>
    )
}
