import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import SearchResults from '../pages/SearchResults';
import CityPage from '../pages/CityPage';
import CategoryPage from '../pages/CategoryPage';
import CityCategoryPage from '../pages/CityCategoryPage';
import AdDetail from '../pages/AdDetail';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import PostAd from '../pages/PostAd';
import EditAd from '../pages/EditAd';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Contact from '../pages/Contact';
import About from '../pages/About';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import Help from '../pages/Help';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'search',
        element: <SearchResults />,
      },
      {
        path: 'call-girls/:city',
        element: <CityPage />,
      },
      {
        path: 'call-girls/:city/:category',
        element: <CityCategoryPage />,
      },
      {
        path: 'category/:slug',
        element: <CategoryPage />,
      },
      {
        path: 'ad/:id',
        element: <AdDetail />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password/:token',
        element: <ResetPassword />,
      },
      {
        path: 'post-ad',
        element: (
          <ProtectedRoute>
            <PostAd />
          </ProtectedRoute>
        ),
      },
      {
        path: 'edit-ad/:id',
        element: (
          <ProtectedRoute>
            <EditAd />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'terms',
        element: <Terms />,
      },
      {
        path: 'privacy',
        element: <Privacy />,
      },
      {
        path: 'help',
        element: <Help />,
      },
    ],
  },
]);

export default router;

