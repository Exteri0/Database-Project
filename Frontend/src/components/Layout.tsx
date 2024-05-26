import '../styles/components/layout.css'
import logo from '../assets/Bookshelf Icon.png'
import userIcon from '../assets/user-cirlce-add.png'
import documentIcon from '../assets/document-text.png'
import signOutIcon from '../assets/logout.png'
import { Outlet, useParams } from 'react-router-dom'

export default function Layout() {
    const { libId, selected } = useParams()

    return (
        <div className="layout-container">
            <div className="side-nav">
                <a className="logo-title">
                    <img src={logo} />
                    <span>BookShelf</span>
                </a>
                <a
                    className="nav-item"
                    href={`/dashboard/${libId}/1`}
                    style={{ background: selected && 1 ? '#00ACE8' : 'white' }}
                >
                    <img src={userIcon} />
                    <span>Dashboard</span>
                </a>
                <a
                    className="nav-item"
                    href={`/dashboard/${libId}/books`}
                    style={{ background: selected ? '#00ACE8' : 'white' }}
                >
                    <img src={documentIcon} />
                    <span>Books</span>
                </a>
                <a className="nav-item" href="/">
                    <img src={signOutIcon} />
                    <span>Sign Out</span>
                </a>
            </div>
            <Outlet />
        </div>
    )
}
