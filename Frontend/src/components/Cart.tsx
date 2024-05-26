import { Link } from 'react-router-dom'
import '../styles/UserSelect.css'

export default function UserSelectionForm() {
    return (
        <div className="cart-page">
            <SelectedBook />
            <div className="form-container">
                <h2>User Selection</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" />
                    </div>
                    <button type="submit" className="select-user-btn">
                        Select User
                    </button>
                </form>
            </div>
        </div>
    )
}

function SelectedBook() {
    return (
        <div className="selected-book-container">
            <h3>Selected Book</h3>
            <p>You have 1 item in your cart</p>
            <div className="book-item">
                <span className="book-id">102421412</span>
                <span className="book-title">Atomic Habits</span>
                <button className="lend-button">Lend</button>
            </div>
        </div>
    )
}
