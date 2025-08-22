import { useEffect } from 'react';

// TypeScript declarations for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface GoogleAnalyticsProps {
  measurementId?: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ 
  measurementId = 'G-XXXXXXXXXX' // Default placeholder, replace with your actual GA4 ID
}) => {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    try {
      // Google Analytics 4 (GA4) tracking code
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      
      // Define gtag function
      window.gtag = function(...args: any[]) {
        window.dataLayer.push(args);
      };
      
      // Initialize Google Analytics
      window.gtag('js', new Date());
      window.gtag('config', measurementId);
      
      console.log('Google Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }, [measurementId]);

  return null;
};

export default GoogleAnalytics;
