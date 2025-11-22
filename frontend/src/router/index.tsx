import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Lazy load pages for code splitting
const Home = lazy(() => import('../pages/Home'));
const SearchResults = lazy(() => import('../pages/SearchResults'));
const CityPage = lazy(() => import('../pages/CityPage'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const CityCategoryPage = lazy(() => import('../pages/CityCategoryPage'));
const AdDetail = lazy(() => import('../pages/AdDetail'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const PostAd = lazy(() => import('../pages/PostAd'));
const EditAd = lazy(() => import('../pages/EditAd'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Contact = lazy(() => import('../pages/Contact'));
const About = lazy(() => import('../pages/About'));
const Terms = lazy(() => import('../pages/Terms'));
const Privacy = lazy(() => import('../pages/Privacy'));
const Help = lazy(() => import('../pages/Help'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Wrapper component for Suspense
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <Home />
          </LazyWrapper>
        ),
      },
      {
        path: 'search',
        element: (
          <LazyWrapper>
            <SearchResults />
          </LazyWrapper>
        ),
      },
      {
        path: 'call-girls/:city',
        element: (
          <LazyWrapper>
            <CityPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'call-girls/:city/:category',
        element: (
          <LazyWrapper>
            <CityCategoryPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'category/:slug',
        element: (
          <LazyWrapper>
            <CategoryPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'ad/:id',
        element: (
          <LazyWrapper>
            <AdDetail />
          </LazyWrapper>
        ),
      },
      {
        path: 'login',
        element: (
          <LazyWrapper>
            <Login />
          </LazyWrapper>
        ),
      },
      {
        path: 'register',
        element: (
          <LazyWrapper>
            <Register />
          </LazyWrapper>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <LazyWrapper>
            <ForgotPassword />
          </LazyWrapper>
        ),
      },
      {
        path: 'reset-password/:token',
        element: (
          <LazyWrapper>
            <ResetPassword />
          </LazyWrapper>
        ),
      },
      {
        path: 'post-ad',
        element: (
          <ProtectedRoute>
            <LazyWrapper>
              <PostAd />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'edit-ad/:id',
        element: (
          <ProtectedRoute>
            <LazyWrapper>
              <EditAd />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <LazyWrapper>
              <Dashboard />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <LazyWrapper>
              <Profile />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <LazyWrapper>
              <Settings />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'contact',
        element: (
          <LazyWrapper>
            <Contact />
          </LazyWrapper>
        ),
      },
      {
        path: 'about',
        element: (
          <LazyWrapper>
            <About />
          </LazyWrapper>
        ),
      },
      {
        path: 'terms',
        element: (
          <LazyWrapper>
            <Terms />
          </LazyWrapper>
        ),
      },
      {
        path: 'privacy',
        element: (
          <LazyWrapper>
            <Privacy />
          </LazyWrapper>
        ),
      },
      {
        path: 'help',
        element: (
          <LazyWrapper>
            <Help />
          </LazyWrapper>
        ),
      },
    ],
  },
]);

export default router;

