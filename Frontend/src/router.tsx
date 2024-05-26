import { createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/Homepage'
import Login from './pages/Login'
import Layout from './components/Layout'
import BorrowPage from './pages/BorrowPage'

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/dashboard',
        children: [
            {
                path: '',
                element: <Login />,
            },
        ],
    },
    {
        path: '/dashboard/:libId/:selected',
        element: <Layout />,
    },
    {
        path: '/borrow/:isbn',
        element: <BorrowPage />,
    },
])

export default router
