import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  const blogFrameRef = useRef<HTMLDivElement>(null); // Ref for the blog frame
  const logoCircleRef = useRef<HTMLDivElement>(null); // Ref for the logo circle

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('#1244F1'); // Changed initial background color to blue
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState('');

  // Initial dimensions for the blog frame
  const initialFrameWidth = window.innerWidth * 0.55;
  const initialFrameHeight = window.innerHeight * 0.70;

  // State for draggable blog frame position (initial: bottom-right, no margin)
  const [framePosition, setFramePosition] = useState({
    x: window.innerWidth - initialFrameWidth,
    y: window.innerHeight - initialFrameHeight,
  });

  // State for draggable logo circle position
  const [logoPosition, setLogoPosition] = useState({
    x: 480, // Initial left
    y: 160, // Initial top
  });

  const [isDraggingFrame, setIsDraggingFrame] = useState(false);
  const [dragOffsetFrame, setDragOffsetFrame] = useState({ x: 0, y: 0 }); // Offset for blog frame

  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [dragOffsetLogo, setDragOffsetLogo] = useState({ x: 0, y: 0 }); // Offset for logo circle

  // State for inactivity eyes feature
  const [eyes, setEyes] = useState<{ id: number; x: number; y: number; rotation: number }[]>([]);
  const inactivityTimeoutRef = useRef<number | null>(null);
  const eyeIntervalRef = useRef<number | null>(null);
  let eyeIdCounter = useRef(0);

  // State for custom pencil cursor
  const [pencilPosition, setPencilPosition] = useState({ x: 0, y: 0 });
  const [showPencil, setShowPencil] = useState(false);
  const [cursorScale, setCursorScale] = useState(1); // New state for cursor scaling
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const lastMouseTime = useRef(0);
  const cursorResetTimeout = useRef<number | null>(null);

  // New state for grab cursor
  const [isGrabbing, setIsGrabbing] = useState(false);


  // New states for managing visibility and position of elements after delete
  const [showBlogContentFrame, setShowBlogContentFrame] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true); // For Chevron buttons and I'm bored
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false); // New state for confirmation modal

  const colors = [
    '#1244F1', // Blue
    '#FE6416', // Orange
    '#FE9FF5', // Pink
    '#FF0D01', // Red
    '#5541BA', // Purple
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

  // Function to add a new eye at a random position with random rotation
  const addEye = useCallback(() => {
    const padding = 50; // Keep eyes away from edges
    const x = Math.random() * (window.innerWidth - padding * 2) + padding;
    const y = Math.random() * (window.innerHeight - padding * 2) + padding;
    const rotation = Math.random() * 360; // Random rotation between 0 and 360 degrees
    setEyes((prevEyes) => [...prevEyes, { id: eyeIdCounter.current++, x, y, rotation }]);
  }, []);

  // Function to reset all inactivity timers
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    if (eyeIntervalRef.current) {
      clearInterval(eyeIntervalRef.current);
      setEyes([]); // Clear existing eyes when activity resumes
    }

    inactivityTimeoutRef.current = window.setTimeout(() => {
      addEye(); // Add first eye after 5 seconds
      eyeIntervalRef.current = window.setInterval(addEye, 10000); // Add subsequent eyes every 2 seconds
    }, 30000); // 5 seconds for first eye
  }, [addEye]);

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

    // Setup inactivity listeners
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer(); // Start the initial inactivity timer

    // Cleanup function to remove event listeners and the dynamically added script
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      if (eyeIntervalRef.current) {
        clearInterval(eyeIntervalRef.current);
      }
    };
  }, [resetInactivityTimer]); // Depend on resetInactivityTimer

  // --- Drawing Functions ---
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastPosition({ x, y });
  };

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

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // --- Pencil Cursor Functions ---
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const currentTime = performance.now();

      setPencilPosition({ x: currentX, y: currentY });
      setShowPencil(true);

      // Calculate speed for dynamic cursor size
      const dx = currentX - lastMouseX.current;
      const dy = currentY - lastMouseY.current;
      const dt = currentTime - lastMouseTime.current;

      if (dt > 0) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = distance / dt; // pixels per millisecond

        // Map speed to a scale factor (adjust maxSpeed and minSpeed as needed)
        const maxSpeed = 2; // Adjust based on typical fast mouse movement
        const minSpeed = 0.1; // Adjust based on typical slow mouse movement
        const calculatedScale = 1 + Math.min(1, Math.max(0, (speed - minSpeed) / (maxSpeed - minSpeed))); // Scale from 1 to 2

        setCursorScale(calculatedScale);

        // Clear previous timeout and set a new one to reset cursor size
        if (cursorResetTimeout.current) {
          clearTimeout(cursorResetTimeout.current);
        }
        cursorResetTimeout.current = window.setTimeout(() => {
          setCursorScale(1); // Reset to original size after inactivity
        }, 100); // Reset after 100ms of no movement
      }

      lastMouseX.current = currentX;
      lastMouseY.current = currentY;
      lastMouseTime.current = currentTime;
    }
    // Also pass to drawing function if drawing is active
    draw(e);
  };

  const handleCanvasMouseLeave = () => {
    setShowPencil(false);
    stopDrawing();
    setCursorScale(1); // Reset cursor size when leaving canvas
    if (cursorResetTimeout.current) {
      clearTimeout(cursorResetTimeout.current);
    }
  };

  // --- Blog Post Navigation Functions ---
  const nextPost = () => {
    setCurrentPostIndex((prev) => (prev + 1) % blogPosts.length);
  };

  const prevPost = () => {
    setCurrentPostIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);
  };

  // --- Screenshot Functions ---
  const handleScreenshot = async () => {
    if (typeof (window as any).html2canvas === 'undefined') {
      console.error('html2canvas is not loaded.');
      alert('Screenshot functionality is not ready yet. Please try again in a moment.');
      return;
    }

    try {
      const canvas = await (window as any).html2canvas(document.body);
      const dataUrl = canvas.toDataURL('image/png');
      setScreenshotDataUrl(dataUrl);
      setShowScreenshotModal(true);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      alert('Failed to capture screenshot. Please try again.');
    }
  };

  const downloadScreenshot = () => {
    const link = document.createElement('a');
    link.href = screenshotDataUrl;
    link.download = 'blog_screenshot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowScreenshotModal(false);
  };

  const emailScreenshot = () => {
    const emailAddress = 'hello@nufab.in';
    const subject = encodeURIComponent('Screenshot from Blog App');
    const body = encodeURIComponent('Hello,\n\nPlease find the attached screenshot from the interactive blog app. You may need to manually attach the image file after this email opens.\n\nBest regards,');
    
    alert('Your email client has opened. Please remember to manually attach the screenshot to the email.');
    window.open(`mailto:${emailAddress}?subject=${subject}&body=${body}`, '_blank');
    
    setShowScreenshotModal(false);
  };

  // --- Draggable Frame Functions ---
  const startDraggingFrame = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!blogFrameRef.current) return;

    setIsDraggingFrame(true);
    setIsGrabbing(true); // Show grab cursor
    setPencilPosition({ x: e.clientX, y: e.clientY }); // Update cursor position immediately
    const rect = blogFrameRef.current.getBoundingClientRect();
    setDragOffsetFrame({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const dragFrame = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingFrame) return;

    // Update pencilPosition to make grab cursor follow
    setPencilPosition({ x: e.clientX, y: e.clientY });

    setFramePosition({
      x: e.clientX - dragOffsetFrame.x,
      y: e.clientY - dragOffsetFrame.y,
    });
  };

  const stopDraggingFrame = () => {
    setIsDraggingFrame(false);
    setIsGrabbing(false); // Hide grab cursor
  };

  // --- Draggable Logo Circle Functions ---
  const startDraggingLogo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!logoCircleRef.current) return;

    setIsDraggingLogo(true);
    setIsGrabbing(true); // Show grab cursor
    setPencilPosition({ x: e.clientX, y: e.clientY }); // Update cursor position immediately
    const rect = logoCircleRef.current.getBoundingClientRect();
    setDragOffsetLogo({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const dragLogo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingLogo) return;

    // Update pencilPosition to make grab cursor follow
    setPencilPosition({ x: e.clientX, y: e.clientY });

    setLogoPosition({
      x: e.clientX - dragOffsetLogo.x,
      y: e.clientY - dragOffsetLogo.y,
    });
  };

  const stopDraggingLogo = () => {
    setIsDraggingLogo(false);
    setIsGrabbing(false); // Hide grab cursor
  };

  // --- Delete Blog Function ---
  const handleDeleteBlogClick = () => {
    setShowDeleteConfirmationModal(true);
  };

  const confirmDeleteBlog = () => {
    setShowBlogContentFrame(false);
    setShowNavButtons(false); // Hide chevron and "I'm bored" buttons

    setShowDeleteConfirmationModal(false); // Close confirmation modal
  };

  const abortDeleteBlog = () => {
    setShowDeleteConfirmationModal(false); // Close confirmation modal
  };

  const currentPost = blogPosts[currentPostIndex];

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor }}>
      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-10" // Removed cursor-crosshair
        onMouseDown={startDrawing}
        onMouseMove={handleCanvasMouseMove} // Use custom handler for pencil
        onMouseUp={stopDrawing}
        onMouseLeave={handleCanvasMouseLeave} // Use custom handler for pencil
        style={{ pointerEvents: 'auto', cursor: 'none' }} // Hide default cursor
      />

      {/* Custom Cursor Rendering */}
      {isGrabbing && (
        <img
          src="https://raw.githubusercontent.com/Raeskaa/studionufab/b14b17e2dce2b5fff264d91d41c2e787bec30673/Grab%20Cursor.svg" // Grab cursor SVG
          alt="Grab Cursor"
          className="absolute z-50" // High z-index to be on top
          style={{
            top: pencilPosition.y, // Use pencilPosition for consistency
            left: pencilPosition.x, // Use pencilPosition for consistency
            pointerEvents: 'none', // Critical: allows clicks/drawing to pass through
            transform: 'translate(-50%, -50%)', // Center the cursor
            width: '32px', // Fixed size for grab cursor
            height: '32px', // Fixed size for grab cursor
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = "https://placehold.co/32x32/000000/FFFFFF?text=✋"; // Fallback image
            console.error("Failed to load Grab SVG icon from URL");
          }}
        />
      )}

      {!isGrabbing && showPencil && ( // Only show pencil if not grabbing
        <img
          src="https://raw.githubusercontent.com/Raeskaa/studionufab/59d263299b8c3990bd561abbd995c9f13409b6ac/Cursor%20for%20Blog.svg" // Updated pencil SVG URL
          alt="Pencil Cursor"
          className="absolute z-50" // High z-index to be on top
          style={{
            top: pencilPosition.y,
            left: pencilPosition.x,
            pointerEvents: 'none', // Critical: allows clicks/drawing to pass through
            transform: `translate(-50%, -50%) scale(${cursorScale})`, // Apply dynamic scale
            width: '32px', // Base width
            height: '32px', // Base height
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = "https://placehold.co/32x32/000000/FFFFFF?text=✏️"; // Fallback image
            console.error("Failed to load Pencil SVG icon from URL");
          }}
        />
      )}

      {/* Dynamic Eye SVGs */}
      {eyes.map((eye) => (
        <div
          key={eye.id}
          className="absolute z-20" // Z-index below blog frame but above canvas
          style={{
            top: eye.y,
            left: eye.x,
            pointerEvents: 'none', // Allow clicks to pass through to elements below
          }}
        >
          <img
            src="https://raw.githubusercontent.com/Raeskaa/studionufab/ec81588c796d013bbd3fcb4d473985d8e0f87a8b/Nufab%20Eye%20White.svg" // Use external SVG
            alt="Eye Icon"
            style={{
              width: '89.6px', // Reduced size to 70% of 128px
              height: '89.6px', // Reduced size to 70% of 128px
              transform: `rotate(${eye.rotation}deg)`, // Apply rotation
            }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = "https://placehold.co/89x89/000000/FFFFFF?text=Eye"; // Fallback image
              console.error("Failed to load Eye SVG icon from URL");
            }}
          />
        </div>
      ))}

      {/* Fixed Black Circle (Logo) - Now Draggable */}
      <div
        ref={logoCircleRef}
        className="absolute rounded-full z-10 flex items-center justify-center" // Removed cursor-grab from className
        style={{
          top: logoPosition.y,
          left: logoPosition.x,
          width: '180px',
          height: '180px',
          backgroundColor: '#ffffff',
          cursor: isGrabbing ? 'none' : 'grab', // Dynamic cursor
        }}
        onMouseDown={startDraggingLogo}
        onMouseMove={dragLogo}
        onMouseUp={stopDraggingLogo}
        onMouseLeave={stopDraggingLogo}
      >
       <img
        src="https://raw.githubusercontent.com/Raeskaa/studionufab/ffdd3e0158bd7e83bfb51a14f710792b29061d90/Group.svg" // Corrected image source URL
        alt="Decorative Icon" // Always provide an alt text for accessibility
        className="w-2/3 h-2/3" // Adjust size as needed
        // Optional: Add an onerror handler for fallback if image fails to load
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = "https://placehold.co/100x100/000000/FFFFFF?text=Error"; // Fallback image
          console.error("Failed to load SVG icon from URL");
        }}
      />
      </div>

      {/* Navigation Arrows & Color Switcher (I'm bored) - Fixed position relative to viewport */}
      {showNavButtons && (
        <div className="absolute flex gap-2 z-20" style={{
          bottom: 'calc(70vh + 14px)', // Fixed position relative to viewport
          right: '2vw', // Fixed position relative to viewport
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
      )}

      {/* Buttons after deletion (I'm bored and Screenshot) */}
      {!showBlogContentFrame && (
        <div className="fixed bottom-5 right-5 flex gap-4 z-40">
          <button
            onClick={handleScreenshot}
            className="h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors px-2"
            title="Take a screenshot"
          >
            <span className="text-black" style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.875rem' }}>Screenshot</span>
          </button>
          <button
            onClick={randomizeColor}
            className="h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors px-2"
            title="Randomize background color"
          >
            <span className="text-black" style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.875rem' }}>I'm bored</span>
          </button>
        </div>
      )}


      {/* Blog Content Frame - Conditionally Rendered */}
      {showBlogContentFrame && (
        <div
          ref={blogFrameRef}
          className="absolute bg-white border-2 border-black overflow-y-auto z-30 p-8" // Removed cursor-grab from className
          style={{
            top: framePosition.y,
            left: framePosition.x,
            width: '55vw',
            height: '70vh',
            cursor: isGrabbing ? 'none' : 'grab', // Dynamic cursor
          }}
          onMouseDown={startDraggingFrame}
          onMouseMove={dragFrame}
          onMouseUp={stopDraggingFrame}
          onMouseLeave={stopDraggingFrame} // Stop dragging if mouse leaves the window
        >
          {/* Screenshot and Delete Buttons - Inside the blog frame, top-left */}
          <div className="absolute top-4 left-4 flex gap-2 z-20">
            <button
              onClick={handleScreenshot}
              className="h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors px-2"
              title="Take a screenshot"
            >
              <span className="text-black" style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.875rem' }}>Screenshot</span>
            </button>
            <button
              onClick={handleDeleteBlogClick} // Call the new handler for confirmation
              className="h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors px-2"
              title="Delete Blog Frame"
            >
              <span className="text-black" style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.875rem' }}>Delete</span>
            </button>
          </div>

          <h1
            className="text-black mb-1 leading-tight text-2xl md:text-4xl lg:text-5xl uppercase"
            style={{
              fontFamily: 'dotmatri, serif',
              fontWeight: '400'
            }}
          >
            {currentPost.title}
          </h1>

          <h2
            className="text-black mb-6 leading-tight text-sm md:text-lg lg:text-xl" // Changed font size to match body
            style={{
              fontFamily: 'Sofia Sans, sans-serif',
              fontWeight: '400'
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

          <div className="space-y-6 pt-4"> {/* Added pt-4 to move content down */}
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
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-none shadow-lg text-center border-2 border-black">
            <h3 className="text-lg font-bold mb-4 text-black" style={{ fontFamily: 'Courier Prime, monospace' }}>
              Delete the blog frame?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeleteBlog}
                className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-none transition-colors border border-black"
                style={{ fontFamily: 'Courier Prime, monospace' }}
              >
                Yes
              </button>
              <button
                onClick={abortDeleteBlog}
                className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-none transition-colors border border-black"
                style={{ fontFamily: 'Courier Prime, monospace' }}
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Modal */}
      {showScreenshotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-none shadow-lg text-center border-2 border-black">
            <h3 className="text-lg font-bold mb-4 text-black" style={{ fontFamily: 'Courier Prime, monospace' }}>
              Art Just Happens. <br/>
              All Yours. <br/>
              This One’s a Keeper <br/>
              Caught you creating 👀
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={downloadScreenshot}
                className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-none transition-colors border border-black"
                style={{ fontFamily: 'Courier Prime, monospace' }}
              >
                Save
              </button>
              <button
                onClick={emailScreenshot}
                className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-none transition-colors border border-black"
                style={{ fontFamily: 'Courier Prime, monospace' }}
              >
                Share
              </button>
              <button
                onClick={() => setShowScreenshotModal(false)}
                className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-none transition-colors border border-black"
                style={{ fontFamily: 'Courier Prime, monospace' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Blog Content - Hidden by default for desktop, shown on mobile */}
      <div className="md:hidden absolute inset-0 bg-white overflow-y-auto p-6 z-30" id="mobile-blog">
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

        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'dotmatri, serif' }}> {/* Increased size and applied font */}
          {currentPost.title}
        </h1>
        <h2 className="text-xl mb-4" style={{ fontFamily: 'Sofia Sans, sans-serif' }}> {/* Applied font */}
          {currentPost.subtitle}
        </h2>
        <p className="text-sm mb-6" style={{ fontFamily: 'Courier Prime, monospace' }}> {/* Applied font */}
          {currentPost.date}
        </p>
        <div className="space-y-6">
          {currentPost.content.map((paragraph, index) => (
            <p
              key={index}
              className="mb-4 leading-relaxed" style={{ fontFamily: 'Sofia Sans, sans-serif' }}> {/* Applied font */}
            {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
