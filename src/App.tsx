import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const blogPosts = [
  {
    title: "What is the difference between art and design?",
    subtitle: "Exploring the boundaries of creative expression",
    date: "24 July 2025",
    content: [
      "The first question asked in all design colleges is \"what is the difference between art and design?\" and following it is the holy revelation of the separation — functionality. This piece of information slips almost boastingly off the design educator's tongue – Design is functional, Art is merely expressive. Design is selfless, Art is selfish. Design facilitates, Art just is.",
      "We are passionate anti-believers of the existence of this border. Don't get me wrong, I too have walked alongside it, like an ant bound by a line of chalk. But careless trespassing with wonderful consequences has lead me to believe that the border is fictitious, created perhaps to compensate for the lack of organized paths in creative fields. But this sort of organization is simply like well-trodden paths in an endless grassy field. I believe that it really is free-range here, and there simply is nothing that cannot be design.",
      "The first question asked in all design colleges is \"what is the difference between art and design?\" and following it is the holy revelation of the separation — functionality. This piece of information slips almost boastingly off the design educator's tongue – Design is functional, Art is merely expressive. Design is selfless, Art is selfish. Design facilitates, Art just is.",
      "We are passionate anti-believers of the existence of this border. Don't get me wrong, I too have walked alongside it, like an ant bound by a line of chalk. But careless trespassing with wonderful consequences has lead me to believe that the border is fictitious, created perhaps to compensate for the lack of organized paths in creative fields. But this sort of organization is simply like well-trodden paths in an endless grassy field. I believe that it really is free-range here, and there simply is nothing that cannot be design."
    ]
  },
  {
    title: "Minimalism in modern design",
    subtitle: "The power of intentional simplicity",
    date: "08 July 2025",
    content: [
      "Less is more – a principle that has guided designers for decades. Minimalism isn't just about removing elements; it's about distilling ideas to their purest form. Every line, every space, every color choice becomes intentional and meaningful.",
      "The challenge of minimalist design lies not in what you include, but in what you choose to leave out. It requires a deep understanding of hierarchy, balance, and the subtle power of negative space to communicate effectively."
    ]
  }
];

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('#e91e63');
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState('');

  const colors = [
    '#1244F1', // Original pink
    '#FE6416', // Light gray
    '#FE9FF5', // Yellow
    '#FF0D01', // Light pink
    '#5541BA', // Orange
    '#ffffff', // White
  ];

  // Function to randomize the background color, ensuring it's not the same as the current one
  const randomizeColor = () => {
    const currentIndex = colors.indexOf(backgroundColor);
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * colors.length);
    } while (newIndex === currentIndex);
    setBackgroundColor(colors[newIndex]);
  };

  // Effect hook for canvas initialization, resizing, and dynamically loading html2canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Function to resize canvas to full window dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas(); // Initial resize
    window.addEventListener('resize', resizeCanvas); // Add resize listener

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#000000'; // Set stroke color to black
      ctx.lineWidth = 2;           // Set line width
      ctx.lineCap = 'round';       // Set line cap style
      ctx.lineJoin = 'round';      // Set line join style
    }

    // Dynamically load html2canvas library
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.async = true;
    script.onload = () => {
      console.log('html2canvas loaded');
    };
    document.body.appendChild(script);

    // Cleanup function to remove event listeners and the dynamically added script
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // Function to start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastPosition({ x, y });
  };

  // Function to handle drawing movement
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath(); // Start a new path
    ctx.moveTo(lastPosition.x, lastPosition.y); // Move to the last recorded position
    ctx.lineTo(x, y); // Draw a line to the current position
    ctx.stroke(); // Render the line

    setLastPosition({ x, y }); // Update last position
  };

  // Function to stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Function to navigate to the next blog post
  const nextPost = () => {
    setCurrentPostIndex((prev) => (prev + 1) % blogPosts.length);
  };

  // Function to navigate to the previous blog post
  const prevPost = () => {
    setCurrentPostIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);
  };

  // Function to handle screenshot capture
  const handleScreenshot = async () => {
    if (typeof (window as any).html2canvas === 'undefined') {
      console.error('html2canvas is not loaded.');
      // Provide a user-friendly message instead of alert
      alert('Screenshot functionality is not ready yet. Please try again in a moment.');
      return;
    }

    try {
      // Capture the entire document body
      const canvas = await (window as any).html2canvas(document.body);
      const dataUrl = canvas.toDataURL('image/png');
      setScreenshotDataUrl(dataUrl);
      setShowScreenshotModal(true);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      alert('Failed to capture screenshot. Please try again.');
    }
  };

  // Function to download the screenshot
  const downloadScreenshot = () => {
    const link = document.createElement('a');
    link.href = screenshotDataUrl;
    link.download = 'blog_screenshot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowScreenshotModal(false); // Close modal after download
  };

  // Function to open email client with pre-filled email
  const emailScreenshot = () => {
    // Note: Direct attachment of data URL to mailto is not reliably supported or practical
    // due to URL length limits and security. Users will need to attach manually.
    const emailAddress = 'hello@nufab.in';
    const subject = encodeURIComponent('Screenshot from Blog App');
    const body = encodeURIComponent('Hello,\n\nPlease find the attached screenshot from the interactive blog app. You may need to manually attach the image file after this email opens.\n\nBest regards,');
    
    // Open mail client
    window.open(`mailto:${emailAddress}?subject=${subject}&body=${body}`, '_blank');
    
    // Provide a message to the user as they need to manually attach the image
    alert('Your email client has opened. Please remember to manually attach the screenshot to the email.');
    setShowScreenshotModal(false); // Close modal after attempting to email
  };

  // Get the current blog post based on the index
  const currentPost = blogPosts[currentPostIndex];

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor }}>
      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-10 cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ pointerEvents: 'auto' }}
      />

      {/* Fixed Black Circle */}
      <div 
        className="absolute rounded-full z-10 flex items-center justify-center" // Added flex for centering SVG
        style={{
          top: '80px',
          left: '400px', // Changed from right to left
          width: '120px',
          height: '120px',
          backgroundColor: '#000000'
        }}
      >
       <img
        src="https://raw.githubusercontent.com/Raeskaa/studionufab/refs/heads/main/Group.svg" // Updated image source
        alt="Decorative Icon" // Always provide an alt text for accessibility
        className="w-2/3 h-2/3" // Adjust size as needed
        // Optional: Add an onerror handler for fallback if image fails to load
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = "https://placehold.co/100x100/000000/FFFFFF?text=Error"; // Fallback image
          console.error("Failed to load SVG icon from URL");
        }}
      />
      </div>

      {/* Navigation Arrows & Color Switcher - Right Side */}
      <div className="absolute flex gap-2 z-20" style={{ 
        bottom: 'calc(70vh + 14px)', 
        right: '2vw' 
      }}>
        <button 
          onClick={prevPost}
          className="w-8 h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={16} className="text-black" />
        </button>
        <button 
          onClick={nextPost}
          className="w-8 h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors"
        >
          <ChevronRight size={16} className="text-black" />
        </button>
        <button 
          onClick={randomizeColor}
          className="h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors ml-2 px-2" 
          title="Randomize background color"
        >
          <span className="text-black" style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.875rem' }}>I'm bored</span>
        </button>
      </div>

      {/* Blog Content Frame */}
      <div 
        className="absolute bg-white border-2 border-black overflow-y-auto z-20 p-8"
        style={{
          bottom: '0vh',
          right: '0vw',
          width: '55vw',
          height: '70vh'
        }}
      >
        {/* Screenshot Button - Inside the blog frame, top-left */}
        <div className="absolute top-4 left-4 z-20"> 
          <button 
            onClick={handleScreenshot}
            className="h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors px-2"
            title="Take a screenshot"
          >
            <span className="text-black" style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.875rem' }}>Screenshot</span>
          </button>
        </div>

        <h1 
          className="text-black mb-3 leading-tight text-2xl md:text-4xl lg:text-5xl"
          style={{ 
            fontFamily: 'dotmatri, serif', 
            fontWeight: '400'
          }}
        >
          {currentPost.title}
        </h1>
        
        <h2 
          className="text-black mb-6 leading-tight"
          style={{ 
            fontFamily: 'Sofia Sans, sans-serif', 
            fontWeight: '400',
            fontSize: '24px'
          }}
        >
          {currentPost.subtitle}
        </h2>
        
        <p 
          className="text-black mb-8 text-xs md:text-sm"
          style={{ 
            fontFamily: 'Courier Prime, monospace', 
            fontWeight: '400'
          }}
        >
          {currentPost.date}
        </p>
        
        <div className="space-y-6">
          {currentPost.content.map((paragraph, index) => (
            <p 
              key={index}
              className="text-black leading-relaxed text-sm md:text-lg lg:text-xl"
              style={{ 
                fontFamily: 'Sofia Sans, sans-serif', 
                fontWeight: '400'
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Screenshot Modal */}
      {showScreenshotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-black">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Courier Prime, monospace' }}>Screenshot Captured!</h3>
            {/* Removed the line "What would you like to do with it?" */}
            <div className="flex justify-center gap-4">
              <button
                onClick={downloadScreenshot}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition-colors" // Styled like Close button
                style={{ fontFamily: 'Courier Prime, monospace' }}
              >
                Download
              </button>
              <button
                onClick={emailScreenshot}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition-colors" // Styled like Close button
                style={{ fontFamily: 'Courier Prime, monospace' }}
              >
                Email
              </button>
              <button
                onClick={() => setShowScreenshotModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition-colors"
                style={{ fontFamily: 'Courier Prime, monospace' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Blog Content - Hidden by default for desktop, shown on mobile */}
      <div className="md:hidden absolute inset-0 bg-white overflow-y-auto p-6 z-30" style={{ display: 'none' }} id="mobile-blog">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Blog</h2>
          <div className="flex gap-2">
            <button 
              onClick={prevPost}
              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextPost}
              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Dai Banna SIL, serif' }}>
          {currentPost.title}
        </h1>
        <h2 className="text-xl mb-4" style={{ fontFamily: 'Sofia Sans, sans-serif' }}>
          {currentPost.subtitle}
        </h2>
        <p className="text-sm mb-6" style={{ fontFamily: 'Courier Prime, monospace' }}>
          {currentPost.date}
        </p>
        <div className="space-y-6">
          {currentPost.content.map((paragraph, index) => (
            <p 
              key={index}
              className="text-black leading-relaxed text-sm md:text-lg lg:text-xl"
              style={{ 
                fontFamily: 'Sofia Sans, sans-serif', 
                fontWeight: '400'
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
