import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the page container to top (not the window)
    const pageContainer = document.querySelector('.flex-1.overflow-auto.bg-qreva-ash');
    
    if (pageContainer) {
      pageContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use 'smooth' for smooth scrolling
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;