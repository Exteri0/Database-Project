import '../styles/components/layout.css'
import logo from '../assets/Bookshelf Icon.png'
import userIconOn from '../assets/user-cirlce-add-on.png'
import userIconOff from '../assets/user-cirlce-add-off.png'
import documentIconOn from '../assets/document-text-on.png'
import documentIconOff from '../assets/document-text-off.png'
import signOutIcon from '../assets/logout.png'
import { Outlet, useParams } from 'react-router-dom'

export default function Layout() {
    const { libId, selected } = useParams()

    return (
        <div className="layout-container">
            {typeof selected != 'undefined' ? (
                <>
                    <div className="side-nav">
                        <a className="logo-title">
                            <img src={logo} />
                            <span>BookShelf</span>
                        </a>
                        <a
                            className="nav-item"
                            href={`/dashboard/${libId}/1`}
                            style={{
                                background:
                                    parseInt(selected) == 1
                                        ? '#00ACE8'
                                        : 'white',
                            }}
                        >
                            <img
                                src={selected == '1' ? userIconOn : userIconOff}
                            />
                            <span
                                style={{
                                    color: selected == '1' ? 'white' : 'black',
                                }}
                            >
                                Dashboard
                            </span>
                        </a>
                        <a
                            className="nav-item"
                            href={`/dashboard/${libId}/2`}
                            style={{
                                background:
                                    parseInt(selected) == 2
                                        ? '#00ACE8'
                                        : 'white',
                            }}
                        >
                            <img
                                src={
                                    selected == '2'
                                        ? documentIconOn
                                        : documentIconOff
                                }
                            />
                            <span
                                style={{
                                    color: selected == '2' ? 'white' : 'black',
                                }}
                            >
                                Books
                            </span>
                        </a>
                        <a className="nav-item" href="/">
                            <img src={signOutIcon} />
                            <span>Sign Out</span>
                        </a>
                    </div>
                    <Outlet />
                </>
            ) : (
                <></>
            )}
        </div>
    )
}
