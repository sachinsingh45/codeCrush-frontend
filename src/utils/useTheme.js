import { useState, useEffect } from 'react';

const useTheme = () => {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'abyss'
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    
    return () => observer.disconnect();
  }, []);

  return theme;
};

export default useTheme;
