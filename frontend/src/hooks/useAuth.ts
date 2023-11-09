import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const sessionData = sessionStorage.getItem('session');
    setIsAuthenticated(sessionData ? true : false);
  }, []);

  return isAuthenticated;
};

export default useAuth;