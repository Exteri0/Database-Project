import '../styles/components/bookdash.css'
import searchIcon from '../assets/search-normal.png'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import handIcon from '../assets/image 22.png'
import plusIcon from '../assets/+.png'
import minusIcon from '../assets/minus.png'

export default function BookDash() {
    const { libId } = useParams()

    interface IBook {
        isbn: string
        book_name: string
        book_genre: string
        number_copies: string
        author_name: string
        authorSSN?: string
    }

    // const [targetISBN, setTargetISBN] = useState('')
    const [searchTarget, setSearchTarget] = useState('')
    const [booksData, setBooksData] = useState<IBook[]>([
        {
            isbn: '',
            book_name: '',
            book_genre: '',
            number_copies: '',
            author_name: '',
        },
    ])
    const [newBook, setNewBook] = useState<IBook>({
        isbn: '',
        book_name: '',
        book_genre: '',
        number_copies: '',
        author_name: '',
        authorSSN: '',
    })

    const navigate = useNavigate()

    useState(async () => {
        const response = await fetch(
            `http://localhost:3000/testapi/v1/libraries/${libId}/books`
        )
        const data = await response.json()
        setBooksData(data as IBook[])
    })

    async function BookPlusPlus(isbn: string) {
        const data = {
            ISBN_Entry: parseInt(isbn),
            LibraryIDEntry: libId,
            numberOfCopiesEntry: 1,
        }
        await fetch('http://localhost:3000/testapi/v1/libraries/BookCopyAdd', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
    }

    async function BookMinusMinus(isbn: string) {
        const data = {
            ISBN_Entry: parseInt(isbn),
            LibraryIDEntry: libId,
            numberOfCopiesEntry: 1,
        }
        await fetch(
            'http://localhost:3000/testapi/v1/libraries/BookCopyRemove',
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }
        )
            .then((res) => res.json())
            .then((data) => console.log(data))
    }

    async function handleSubmit(e: React.FormEvent<HTMLButtonElement>) {
        e.preventDefault()
        const dataToBeSent = {
            ISBN_Entry: parseInt(newBook.isbn),
            bookNameEntry: newBook.book_name,
            bookGenreEntry: newBook.book_genre,
            LibraryIDEntry: libId,
            numberOfCopiesEntry: parseInt(newBook.number_copies),
            authorSSNEntry: parseInt(newBook.authorSSN as unknown as string),
            authorNameEntry: newBook.author_name,
        }
        await fetch(
            'http://localhost:3000/testapi/v1/libraries/bookAddCopies',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToBeSent),
            }
        )
            .then((res) => res.json())
            .then((data) => console.log(data))
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setNewBook({
            ...newBook,
            [e.target.name]: [e.target.value],
        })
    }

    return (
        <div className="book-dash">
            <div className="search-container">
                <div className="search-box">
                    <input
                        placeholder="Search for Book Name"
                        onChange={(e) => setSearchTarget(e.target.value)}
                        value={searchTarget}
                    ></input>
                    <img src={searchIcon} />
                </div>
            </div>
            <div className="books-table">
                <h2>Library Books</h2>
                <div className="names">
                    <span>ISBN</span>
                    <span>Book Name</span>
                    <span>Author</span>
                    <span>#Copies</span>
                </div>
                <main>
                    {booksData
                        .filter((book) =>
                            book.book_name
                                .toLowerCase()
                                .includes(searchTarget.toLowerCase())
                        )
                        .map((book) => (
                            <div className="book-container" key={book.isbn}>
                                <span>{book.isbn}</span>
                                <span>{book.book_name}</span>
                                <span>{book.author_name}</span>
                                <span>{book.number_copies}</span>
                                <div className="buttons">
                                    <img
                                        src={handIcon}
                                        onClick={() => navigate('/borrow')}
                                    />
                                    <img
                                        src={minusIcon}
                                        onClick={() =>
                                            BookMinusMinus(book.isbn)
                                        }
                                    />
                                    <img
                                        src={plusIcon}
                                        onClick={() => BookPlusPlus(book.isbn)}
                                    />
                                </div>
                            </div>
                        ))}
                </main>
                <h2>Add New Book</h2>
                <div className="new-names">
                    <input
                        placeholder="ISBN"
                        value={newBook.isbn}
                        onChange={(e) => handleChange(e)}
                        name="isbn"
                    />
                    <input
                        placeholder="Book Name"
                        value={newBook.book_name}
                        onChange={(e) => handleChange(e)}
                        name="book_name"
                    />
                    <input
                        placeholder="Author"
                        value={newBook.author_name}
                        onChange={(e) => handleChange(e)}
                        name="author_name"
                    />
                    <input
                        placeholder="#Copies"
                        value={newBook.number_copies}
                        onChange={(e) => handleChange(e)}
                        name="number_copies"
                    />
                    <input
                        placeholder="Book Genre"
                        value={newBook.book_genre}
                        onChange={(e) => handleChange(e)}
                        name="book_genre"
                    />
                    <input
                        placeholder="Author SSN"
                        value={newBook.authorSSN}
                        onChange={(e) => handleChange(e)}
                        name="authorSSN"
                    />
                    <button
                        className="submit-btn"
                        onClick={(e) => handleSubmit(e)}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}
