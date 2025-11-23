import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AgeVerificationModal from '../auth/AgeVerificationModal';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AgeVerificationModal />
      <Header />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

