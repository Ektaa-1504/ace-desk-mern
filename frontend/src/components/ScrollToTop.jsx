/**
 * ============================================
 * ScrollToTop - Auto Scroll on Route Change
 * ============================================
 * useLocation() gives current pathname (e.g. /login, /profile)
 * When pathname changes (user navigates), scroll to top of page
 * Used in App.jsx so every route change resets scroll position
 */

import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);  // Re-run when route changes

  return null;
  
}

export default ScrollToTop
