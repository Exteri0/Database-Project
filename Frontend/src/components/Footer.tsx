import '../styles/components/footer.css'
import logo from '../assets/Bookshelf Icon.png'

export default function Footer() {
    return (
        <div className="main-container">
            <div className="logo-email">
                <img src={logo} />
                <span>BookShelf</span>
            </div>
            <span>Copyright © 2024 BookShelf ltd. All rights reserved</span>
        </div>
    )
}
