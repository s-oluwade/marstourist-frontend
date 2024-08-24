import axios from 'axios';
import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import WebFont from 'webfontloader';
import FooterSignature from './components/FooterSignature';
import Header from './components/Header';
import { AuthContext } from './components/Providers/AuthContextProvider';
import { GlobalContext } from './components/Providers/GlobalContextProvider';
import { UserContext } from './components/Providers/UserContextProvider';
import { Activity } from './models/activity';
import { User } from './models/user';

const Layout = () => {
    const { user, loadingUser, admin, loadingAdmin } = useContext(AuthContext);
    const { userAvatar, cart } = useContext(UserContext);
    const currentPath = window.location.pathname;

    const { setActivities, setAllUsers } = useContext(GlobalContext);

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get<Activity[]>('/activities')
            .then((response) => {
                const data = response.data;
                data.sort((a, b) =>
                    new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
                        ? 1
                        : new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
                        ? -1
                        : 0
                );
                setActivities(data);
            })
            .catch((error) => {
                setActivities([]);
                console.error(error);
            });
        axios
            .get<User[]>('/user/users')
            .then((response) => {
                setAllUsers(response.data ?? []);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [setActivities, setAllUsers]);

    useEffect(() => {
        WebFont.load({
            google: {
                families: [
                    'Open Sans',
                    'Open Sans Condensed',
                    'Roboto',
                    'Signika:300,400,500,700',
                    'Roboto Slab',
                    'Montserrat',
                    'Rubik:300,400,500,700',
                ],
            },
        });
    }, []);

    async function userLogout() {
        try {
            await axios.post('/user/logout');
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    const signedOut = !loadingUser && !user && !loadingAdmin && !admin;

    // if not signed in, redirect to home page
    if (
        currentPath !== '/' &&
        !currentPath.includes('login') &&
        !currentPath.includes('register') &&
        !currentPath.includes('activities') &&
        signedOut
    ) {
        navigate('/');
    }

    return (
        !loadingUser &&
        !loadingAdmin && (
            <div className='main drawer bg-zinc-400 dark:bg-neutral'>
                <input id='my-drawer-3' type='checkbox' className='drawer-toggle' />
                <div className='drawer-content flex min-h-screen flex-col font-rubik font-light'>
                    <Header />
                    <div
                        className={`flex grow ${
                            admin ? '' : 'mb-14 mt-20 dark:text-neutral-content'
                        }`}
                    >
                        <Outlet />
                        <FooterSignature />
                    </div>
                </div>
                <div className='drawer-side z-20'>
                    <label htmlFor='my-drawer-3' className='drawer-overlay'></label>
                    <ul className='menu h-full w-72 bg-base-200 p-4 dark:bg-neutral'>
                        {/* Sidebar content here */}
                        <div className='flex h-full w-full flex-col items-center justify-center gap-6'>
                            {user && (
                                <>
                                    <Link to={'/profile'}>
                                        <div className='avatar'>
                                            <div className='w-32 rounded-full ring ring-accent ring-offset-2 ring-offset-base-100'>
                                                <img src={userAvatar} />
                                            </div>
                                        </div>
                                        <div className='mt-2 text-center dark:text-neutral-content'>
                                            {user.fullname}
                                        </div>
                                    </Link>
                                    <div className='w-full border-b dark:border-b-gray-700'>
                                        <h6 className='mb-1 bg-gray-300 text-sm font-medium dark:bg-gray-700'>
                                            Location
                                        </h6>
                                        <p className='capitalize'>{user?.location || '_'}</p>
                                    </div>
                                    <div className='w-full border-b dark:border-b-gray-700'>
                                        <h6 className='mb-1 bg-gray-300 text-sm font-medium dark:bg-gray-700'>
                                            Bio
                                        </h6>
                                        <p className='capitalize'>{user?.bio || '_'}</p>
                                    </div>
                                    <div className='w-full border-b dark:border-b-gray-700'>
                                        <p>
                                            Credits:{' '}
                                            {user.credit ? (user.credit / 100).toFixed(2) : 0.0}
                                        </p>
                                    </div>
                                </>
                            )}
                            {user && window.location.pathname.includes('/profile') && (
                                <div id='user_menu' className='flex w-full flex-col gap-2 pt-4'>
                                    <h3 className='pl-6 text-xs dark:text-neutral-content'>MENU</h3>
                                    <ul className='menu rounded'>
                                        <li>
                                            <Link
                                                className={`${
                                                    !currentPath.includes('friends') &&
                                                    !currentPath.includes('settings') &&
                                                    !currentPath.includes('purchase')
                                                        ? 'active'
                                                        : ''
                                                } hover:text-neutral dark:text-neutral-content/60 dark:focus:text-neutral-content dark:active:text-neutral-content/60`}
                                                to={'/profile/' + user.username}
                                            >
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    strokeWidth={1.5}
                                                    stroke='currentColor'
                                                    className='h-4 w-4'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
                                                    />
                                                </svg>
                                                Home
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className={`${
                                                    currentPath.includes('friends') ? 'active' : ''
                                                } hover:text-neutral dark:text-neutral-content/60 dark:focus:text-neutral-content dark:active:text-neutral-content/60`}
                                                to={`/profile/${user.username}/friends`}
                                            >
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    strokeWidth={1.5}
                                                    stroke='currentColor'
                                                    className='h-4 w-4'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
                                                    />
                                                </svg>
                                                Friends
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className={`${
                                                    currentPath.includes('purchase') ? 'active' : ''
                                                } hover:text-neutral dark:text-neutral-content/60 dark:focus:text-neutral-content dark:active:text-neutral-content/60`}
                                                to={`/profile/${user.username}/purchase`}
                                            >
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    strokeWidth={1.5}
                                                    stroke='currentColor'
                                                    className='h-4 w-4'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z'
                                                    />
                                                </svg>
                                                Purchased Items
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className={`${
                                                    currentPath.includes('settings') ? 'active' : ''
                                                } hover:text-neutral dark:text-neutral-content/60 dark:focus:text-neutral-content dark:active:text-neutral-content/60`}
                                                to={`/profile/${user.username}/settings`}
                                            >
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    strokeWidth={1.5}
                                                    stroke='currentColor'
                                                    className='h-4 w-4'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z'
                                                    />
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                                    />
                                                </svg>
                                                Settings
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            <ul className='flex w-full flex-1 flex-col space-y-2 font-medium'>
                                {user && (
                                    <>
                                        <li>
                                            <Link to={`/profile/${user.username}`}>
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    strokeWidth={1.5}
                                                    stroke='currentColor'
                                                    className='h-4 w-4'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
                                                    />
                                                </svg>
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/cart'}>
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    strokeWidth={1.5}
                                                    stroke='currentColor'
                                                    className='h-4 w-4'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
                                                    />
                                                </svg>
                                                <div className='indicator'>
                                                    <span className='flex-1 whitespace-nowrap '>
                                                        Cart (
                                                        {cart
                                                            ? cart.products['total'] &&
                                                              cart.products['total'].count
                                                            : 0}
                                                        )
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/store'}>
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    strokeWidth={1.5}
                                                    stroke='currentColor'
                                                    className='h-4 w-4'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
                                                    />
                                                </svg>
                                                Shop
                                            </Link>
                                        </li>
                                    </>
                                )}
                                <li>
                                    <Link to={'/activities'}>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='h-4 w-4'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
                                            />
                                        </svg>
                                        Activities
                                    </Link>
                                </li>
                                {!user && (
                                    <li className='grow justify-end'>
                                        <Link
                                            to={'/login/user'}
                                            className='group flex items-center rounded-lg p-2 hover:bg-gray-100'
                                        >
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                strokeWidth={1.5}
                                                stroke='currentColor'
                                                className='h-5 w-5 dark:group-hover:text-gray-200 dark:group-focus:text-gray-200 dark:group-active:text-gray-200'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'
                                                />
                                            </svg>
                                            <span className='ml-3 flex-1 whitespace-nowrap dark:group-hover:text-gray-200 dark:group-focus:text-gray-200 dark:group-active:text-gray-200'>
                                                Sign In
                                            </span>
                                        </Link>
                                    </li>
                                )}
                                {user && (
                                    <li className='grow justify-end'>
                                        <a
                                            onClick={userLogout}
                                            className='group flex items-center rounded-lg p-2 hover:bg-gray-100'
                                        >
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                strokeWidth={1.5}
                                                stroke='currentColor'
                                                className='h-5 w-5 dark:group-hover:text-gray-200 dark:group-focus:text-gray-200 dark:group-active:text-gray-200'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75'
                                                />
                                            </svg>
                                            <span className='ml-3 flex-1 whitespace-nowrap dark:group-hover:text-gray-200 dark:group-focus:text-gray-200 dark:group-active:text-gray-200'>
                                                Sign Out
                                            </span>
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </ul>
                </div>
            </div>
        )
    );
};

export default Layout;
