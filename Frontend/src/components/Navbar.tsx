import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import '../styles/components/navbar.css'

export default function Navbar() {
    return (
        <nav className="nav-bar">
            <a className="logo-and-title" href="#">
                <img className="logo" src={logo} />
                <span className="title">BookShelf</span>
            </a>
            <a className="section" href="#libraries-section">
                Our Libraries
            </a>
            <a className="section" href="#whyus-section">
                Why Us?
            </a>
            <Link to={'login'} className="login-cta">
                <span>Login</span>
            </Link>
        </nav>
    )
}
