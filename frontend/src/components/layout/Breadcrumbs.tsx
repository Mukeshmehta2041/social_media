import { Link, useLocation } from 'react-router-dom';
import { HiHome, HiChevronRight } from 'react-icons/hi';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbLabel = (path: string): string => {
    // Handle specific routes
    if (path === 'call-girls') {
      return 'Call Girls';
    }
    if (path === 'category') {
      return 'Category';
    }
    if (path === 'state') {
      return 'State';
    }
    if (path === 'ad') {
      return 'Ad';
    }
    if (path === 'search') {
      return 'Search';
    }
    if (path === 'post-ad') {
      return 'Post Ad';
    }
    if (path === 'dashboard') {
      return 'Dashboard';
    }
    if (path === 'profile') {
      return 'Profile';
    }
    if (path === 'settings') {
      return 'Settings';
    }

    // For dynamic routes, try to get from URL or use formatted path
    return path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

    if (pathnames.length === 0) {
      return breadcrumbs;
    }

    let currentPath = '';
    pathnames.forEach((path, index) => {
      currentPath += `/${path}`;
      const isLast = index === pathnames.length - 1;

      breadcrumbs.push({
        label: getBreadcrumbLabel(path),
        path: isLast ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <HiChevronRight className="mx-2 text-gray-400" aria-hidden="true" />
              )}
              {crumb.path ? (
                <Link
                  to={crumb.path}
                  className="text-gray-500 hover:text-indigo-600 transition-colors flex items-center"
                >
                  {index === 0 ? (
                    <HiHome className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;

