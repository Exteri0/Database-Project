import { useParams } from 'react-router-dom'
import Navbar2 from '../components/Navbar2'
import '../styles/borrowpage.css'
import { useEffect, useState } from 'react'

export default function BorrowPage() {
    interface IBook {
        isbn: string
        book_name?: string
        book_genre?: string
        bookname?: string
    }

    interface ITransaction {
        transactionid: number
        bookname: string
        isbnbook: string
        borrowedon: string
    }

    const { isbn } = useParams()
    const [enabled, setEnabled] = useState(0)
    const [myBook, setMyBook] = useState<IBook>({
        book_name: '',
        isbn: isbn as unknown as string,
        book_genre: '',
    })
    const [myUser, setMyUser] = useState({
        id: '',
        name: '',
        password: '',
        membershipstatus: '',
        libraryid: '',
    })
    const [err, setErr] = useState([0, ''])
    const [borroweds, setBorroweds] = useState<ITransaction[]>([
        {
            transactionid: 0,
            bookname: '',
            isbnbook: '',
            borrowedon: '',
        },
    ])
    const [recommended, setRecommended] = useState<IBook[]>([
        {
            isbn: '',
            bookname: '',
        },
    ])

    useEffect(() => {
        async function yes(isbn: string) {
            const response = await fetch(
                `http://localhost:3000/testapi/v1/libraries/${isbn}/Describe`
            )
            const data = await response.json()
            console.log(data)
            setMyBook(data[0])
        }
        yes(isbn as unknown as string)
    }, [isbn])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setMyUser({
            ...myUser,
            [e.target.name]: [e.target.value],
        })
    }

    async function handleSubmit(e: React.FormEvent<HTMLButtonElement>) {
        e.preventDefault()

        try {
            const dataToBeSent = {
                UserIDEntry: String(myUser.id),
                UserpasswordEntry: String(myUser.password),
            }

            const response1 = await fetch(
                `http://localhost:3000/testapi/v1/users/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToBeSent),
                }
            )

            const result = await response1.json()
            if (result.response === 'Accepted') {
                const userResponse = await fetch(
                    `http://localhost:3000/testapi/v1/users/${dataToBeSent.UserIDEntry}`
                )
                const userData = await userResponse.json()
                const updatedUser = { ...myUser, ...userData[0] }
                setMyUser(updatedUser)

                const transactionsResponse = await fetch(
                    `http://localhost:3000/testapi/v1/users/${dataToBeSent.UserIDEntry}/all`
                )
                if (!transactionsResponse.ok) {
                    throw new Error('Transactions data request failed')
                }
                const borrowedTransactions: ITransaction[] =
                    await transactionsResponse.json()
                setBorroweds(borrowedTransactions)

                if (updatedUser.libraryid) {
                    const recommendationsResponse = await fetch(
                        `http://localhost:3000/testapi/v1/users/${dataToBeSent.UserIDEntry}/${updatedUser.libraryid}/recommended`
                    )
                    if (!recommendationsResponse.ok) {
                        throw new Error('Recommendations data request failed')
                    }
                    const recommendedBooks: IBook[] =
                        await recommendationsResponse.json()
                    setRecommended(recommendedBooks)
                    setEnabled(1)
                } else {
                    setEnabled(0)
                }
            } else {
                setEnabled(0)
            }
        } catch (error) {
            console.error('An error occurred:', error)
            setEnabled(0)
        }
    }
    async function lendBook(isbn: string) {
        if (!enabled) return
        const dataToBeSent = {
            ISBN_Entry: String(isbn),
            userIDEntry: parseInt(myUser.id),
            LibraryIDEntry: parseInt(myUser.libraryid),
        }
        const response = await fetch(
            `http://localhost:3000/testapi/v1/users/Borrow`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToBeSent),
            }
        )
        const data = await response.text()
        console.log(data)
        setErr([1, data])
    }

    return (
        <div className="container">
            <Navbar2 />
            <div className="inner-container">
                <div className="selected-book">
                    <h3>Selected Book</h3>
                    <div className="white-container">
                        <span>{isbn}</span>
                        <span>{myBook.book_name}</span>
                        <span
                            style={{
                                color: !enabled ? '#666666' : '#2194F3',
                                cursor: enabled ? 'pointer' : '',
                            }}
                            onClick={() => lendBook(isbn as string)}
                        >
                            Lend
                        </span>
                    </div>
                    <span>{err[1]}</span>
                </div>
                {!enabled ? (
                    <div className="form">
                        <h1>User Selection</h1>
                        <label>ID</label>
                        <input name="id" onChange={(e) => handleChange(e)} />
                        <label>Password</label>
                        <input
                            name="password"
                            onChange={(e) => handleChange(e)}
                        />
                        <button onClick={(e) => handleSubmit(e)}>
                            Select User
                        </button>
                    </div>
                ) : (
                    <div className="form">
                        <h1>User Selection</h1>
                        <label>ID: {myUser.id}</label>
                        <label>Username: {myUser.name}</label>
                        <label>Membership: {myUser.membershipstatus}</label>
                        {borroweds.map((trans) => (
                            <label>Borrowed Book: {trans.bookname}</label>
                        ))}
                    </div>
                )}
            </div>
            <div className="below-container">
                <h3>Recommended Books</h3>
                <section>
                    {!enabled ? (
                        <h4>Select a user</h4>
                    ) : (
                        recommended.slice(0, 2).map((rec) => (
                            <div className="white-container">
                                <label>{rec.isbn}</label>
                                <label>{rec.bookname}</label>
                                <span onClick={() => lendBook(isbn as string)}>
                                    Lend
                                </span>
                            </div>
                        ))
                    )}
                </section>
            </div>
        </div>
    )
}
