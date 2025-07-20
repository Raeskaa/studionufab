import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Asterisk from '../asterisk.svg';


const colors = [
  '#1244F1', // Blue
  '#FE6416', // Orange
  '#FE9FF5', // Pink
  '#FF0D01', // Red
  '#5541BA', // Purple
  '#ffffff', // White
  '#E1F532', // Light Green
];


const blogPosts = [
  {
    title: "NUFAB IS A DESIGN STUDIO*",
    subtitle: "*or maybe something else entirely.",
    date: "Hi, reader. Welcome to a media anomaly: long form content. This one’s a 3 minute read. Oh, and if the words don’t hold you, don’t be afraid to wander.",
    content: [
      "Some shared opinions about culture, some inter-generational dialogue, some free love – and Nufab was conceived as a fragile idea, unexpectedly. But that was a long time ago. It has wandered, been wrong, changed and grown. What remains the same is what truly defines us. And we’re ready to share it with you.",
      "Nufab is awake. Nufab is looking.",
      "Looking Inward",
      "Long have we looked outward for the latest definition of style and culture to follow. We’re losing our identity as a People, and losing our chance to shape it into our own definitions. Why are we following this penthouse blueprint on top of the foundation of our intricate Haveli? A land full of stories awaits, eager to share its artisanal legacy, its natural abundance, and its willing hands.",
      "Nufab looks inward into this vivid and chaotic land. Nufab seeks to craft with more tenderness, more relevance, more roots. We’re not India-inspired. We’re just Indian.",
      "Looking Ahead",
      "Even the clearest water turns foul when it stops flowing. Tradition and culture are no different. Preserving them in a glass case leaves them stagnant, outdated and irrelevant. The only way to do justice to our art is to let it evolve with the land, and its people. Culture isn’t a fragile museum piece, it has always been meant for play.",
      "Nufab takes culture out of nostalgic memory and brings it into the everyday — so it can shed what no longer serves and fall freely into the hands of its new heirs.",
      "Looking Around",
      "To be human is to create, to play, to express, and to share. Art is for everyone, everyday. Culture has always lived among people: in one rupee matchboxes and newsprint ads, in cinema posters and Monday Haats, in 3rd A.C. and IPL nights. But somewhere in its revival, culture became elitist. Wrapped in the shenanigans of marketing and coolness, culture has been taken away from its true place — in the hands that shaped it.",
      "Nufab isn’t a revival, it’s a continuation. It is a movement to bring people back to their own art, their own language, their own culture.",
      "Not Looking",
      "We don’t have a brand strategy. And we’re not looking for one. We aren’t a part of the cool kid competition. We want to exist, to create, to share ideas. To connect humans with humans. We want to be heard and to listen. Not to trends or markets, but to land, to memory, to you.",
      "We aren’t founders building a brand. We are humans, and Nufab is a conversation.",
      "We’re starting small. A studio with no ceilings. A balcony and a tailor. The story that started it all. And soon, our first public project."
    ]
  },
  /*
  // The following blog post content has been commented out as requested:
  {
    title: "The logo",
    subtitle: "It has the potential to innovate profoundly at \"Mind\" and \"Culture\" levels.",
    date: "24 July 2025",
    content: [
      "The first question asked in all design colleges is “what is the difference between art and design?” and following it is the holy revelation of the separation — functionality. This piece of information slips almost boastingly off the design educator’s tongue - Design is functional, Art is merely expressive. Design is selfless, Art is selfish. Design facilitates, Art just is.",
      "We are passionate antibelievers of the existence of this border. Don’t get me wrong, I too have walked alongside it, like an ant bound by a line of chalk. But careless trespassing with wonderful consequences has lead me to believe that the border is fictitious, created perhaps to compensate for the lack of organised paths in creative fields. But this sort of organisation is simply like well-trodded paths in an endless grassy field. I believe that it really is free-range here, and there simply is nothing that cannot be design.",
      "I like to think of logos as bite sized pieces of art, like an elaborate thought vacuum-packed into a few pixels. Making a logo feels like a party trick, like making a thought-dove transform into a small white rose and conjuring it back at a swish. Looking at a logo and unpacking its meaning feels like decrypting a message, written in a language with more forgiving boundaries that letters or syllables.",
      "Although a logo is as large as the decrypter, I would like to talk about the Nufab logo in its context. It is a small wax seal to a movement that we hope can envelope anyone and everyone.",
      "The central form of the logo is a human figure. Inside the context of the circle and square, it is reference to the Vitruvian Man by Da Vinci. It shows humanity, evolution and art. Da Vinci, the designer, artist, scientist and philosopher, inspires Nufab with his urge to be a jack of all trades - a maker that didn’t stick to trodded paths and took to the grass.",
      "The form is carved out of an asterisk. An asterisk implies a footnote, subtext, or contingency — in this case, that “we preserve” but with evolution, and without the stagnant, stale and outdated.",
      "Also quite striking is the eye, with a falling gaze that is almost meditative. It speaks of intentional, unblinking perception that is matter of fact and just. Nufab starts with observation, which gives way to conversation, and then creative action.",
      "In its stylistic entirety, The logo speaks of reform in the system to include human tenderness in contrast with efficiency goals. It speaks of community and reaching out. It speaks of strong, intentional, creative action.",
      "The logotype weaves different accents into the english name. The Dot beneath the F not only represents the Nuqta used in writing the word in devanagari, but also is our Nazar ka Teeka onto our beloved."
    ]
  },
  */
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

// Helper function to get the initial post index from the URL
const getInitialPostIndex = () => {
  if (typeof window === 'undefined') return 0;
  const params = new URLSearchParams(window.location.search);
  const blogIndexParam = params.get('blog');
  if (blogIndexParam !== null) {
    const initialIndex = parseInt(blogIndexParam, 10);
    // Adjust index if the commented-out post was previously at index 1
    if (initialIndex === 1) return 0; // If it was the second post, now it's the first
    if (!isNaN(initialIndex) && initialIndex >= 0 && initialIndex < blogPosts.length) {
      return initialIndex;
    }
  }
  return 0; // Default to the first post
};


function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blogFrameRef = useRef<HTMLDivElement>(null); // Ref for the blog frame
  const logoCircleRef = useRef<HTMLDivElement>(null); // Ref for the logo circle

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [currentPostIndex, setCurrentPostIndex] = useState(getInitialPostIndex);
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
  const [hasDraggedLogo, setHasDraggedLogo] = useState(false); // New state to track if logo was dragged


  // State for inactivity eyes feature
  const [eyes, setEyes] = useState<{ id: number; x: number; y: number; rotation: number }[]>([]);
  const inactivityTimeoutRef = useRef<number | null>(null);
  const eyeIntervalRef = useRef<number | null>(null);
  let eyeIdCounter = useRef(0);


  // State for custom pencil cursor
  const [pencilPosition, setPencilPosition] = useState({ x: 0, y: 0 });
  const [showPencil, setShowPencil] = useState(false);
  const [cursorScale, setCursorScale] = useState(1.2); // New state for cursor scaling, increased base size
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

  // New state for "More" button visibility and drawing tools
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [brushWidth, setBrushWidth] = useState(2); // Default brush width
  const [brushColor, setBrushColor] = useState('#000000'); // Default brush color (black)
  const [isErasing, setIsErasing] = useState(false); // State for eraser tool

  // State for Undo/Redo
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]); // Stores canvas data URLs
  const [historyPointer, setHistoryPointer] = useState(-1); // Points to the current state in history
  const MAX_HISTORY_STATES = 10; // Max number of states to keep in history


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
      eyeIntervalRef.current = window.setInterval(addEye, 15000); // Add subsequent eyes every 15 seconds
    }, 40000); // 40 seconds for first eye
  }, [addEye]);


  // --- Drawing Functions ---
  const saveCanvasState = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      setCanvasHistory(prevHistory => {
        // Discard 'future' states if we've undone and now performing a new action
        const newHistory = prevHistory.slice(0, historyPointer + 1);
        newHistory.push(dataUrl);
        // Enforce max history states
        const cappedHistory = newHistory.length > MAX_HISTORY_STATES
          ? newHistory.slice(newHistory.length - MAX_HISTORY_STATES)
          : newHistory;
        // Set pointer to the new end
        setHistoryPointer(cappedHistory.length - 1);
        return cappedHistory;
      });
    }
  }, [historyPointer, MAX_HISTORY_STATES]); // Depends on historyPointer for slicing, MAX_HISTORY_STATES for capping


  const restoreCanvasState = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (canvas && canvasHistory[index]) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          const originalCompositeOperation = ctx.globalCompositeOperation;
          ctx.globalCompositeOperation = 'source-over';
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          ctx.globalCompositeOperation = originalCompositeOperation;
          // Re-apply current brush settings after restoring image
          ctx.strokeStyle = brushColor;
          ctx.lineWidth = brushWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
        };
        img.src = canvasHistory[index];
      }
      setHistoryPointer(index);
    } else {
    }
  }, [canvasHistory, brushColor, brushWidth, isErasing]);


  const handleUndo = useCallback(() => {
    if (historyPointer > 0) {
      restoreCanvasState(historyPointer - 1);
    }
  }, [historyPointer, restoreCanvasState]);


  const handleRedo = useCallback(() => {
    if (historyPointer < canvasHistory.length - 1) {
      restoreCanvasState(historyPointer + 1);
    }
  }, [historyPointer, canvasHistory.length, restoreCanvasState]);


  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Remove saveCanvasState from here
    // saveCanvasState();

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

    ctx.strokeStyle = brushColor; // Ensure current color is used
    ctx.lineWidth = brushWidth; // Eraser uses brush width
    ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';


    ctx.beginPath(); // Start a new path
    ctx.moveTo(lastPosition.x, lastPosition.y); // Move to the last recorded position
    ctx.lineTo(x, y); // Draw a line to the current position
    ctx.stroke(); // Render the line


    setLastPosition({ x, y }); // Update last position
  };


  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      saveCanvasState(); // Only save if a stroke was made
    }
    setIsDrawing(false);
  }, [isDrawing, saveCanvasState]);


  const handleClearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      saveCanvasState(); // Save current state before clearing for undo
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Temporarily set composite operation to source-over to ensure clearRect works as expected
        const originalCompositeOperation = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = originalCompositeOperation; // Restore original
      }
      // After clearing, save the new empty state
      saveCanvasState(); // Save the cleared state
    }
  }, [saveCanvasState]);


  const handleSaveDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Create a temporary canvas to draw the background and then the drawing
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');

      if (tempCtx) {
        // Draw background color onto the temporary canvas
        tempCtx.fillStyle = backgroundColor;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw the main canvas content onto the temporary canvas
        tempCtx.drawImage(canvas, 0, 0);

        // Get data URL from the temporary canvas
        const dataUrl = tempCanvas.toDataURL('image/png');

        // Trigger download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'my_drawing_with_background.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }, [backgroundColor]);


  // This useCallback handles resizing and restoring canvas content
  const resizeCanvasAndRestore = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Capture current content before resizing
    const currentContentDataUrl = canvas.toDataURL();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = currentContentDataUrl;
    }
  }, []);


  // Main useEffect for canvas setup, window events, initial history
  const isInitialMount = useRef(true); // Ref to track initial mount

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial canvas setup and resize handling
    resizeCanvasAndRestore(); // Call it once on mount
    window.addEventListener('resize', resizeCanvasAndRestore);

    // Initial save of blank canvas state ONLY ONCE on initial mount
    if (isInitialMount.current) {
      if (canvasHistory.length === 0 && historyPointer === -1) {
        saveCanvasState();
      }
      isInitialMount.current = false;
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

    // Cleanup function for this useEffect
    return () => {
      window.removeEventListener('resize', resizeCanvasAndRestore);
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
  }, [resizeCanvasAndRestore, saveCanvasState, resetInactivityTimer]);


  // Effect for updating drawing context properties when brush/eraser settings change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushWidth;
      ctx.lineCap = 'round'; // Ensure line cap is round for smooth drawing/erasing
      ctx.lineJoin = 'round'; // Ensure line join is round for smooth drawing/erasing
      ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
    }
  }, [brushWidth, brushColor, isErasing]); // Only depends on drawing properties


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
          setCursorScale(1.2); // Reset to original size after inactivity
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
    setCursorScale(1.2); // Reset cursor size when leaving canvas
    if (cursorResetTimeout.current) {
      clearTimeout(cursorResetTimeout.current);
    }
  };


  // Function to update URL when navigating posts
  const updateUrlForPost = (index: number) => {
    if (window.location.protocol !== 'blob:') {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('blog', index.toString());
      // Use pushState to update the URL without a page reload
      window.history.pushState({ blogIndex: index }, '', newUrl.toString());
    } else {
      console.warn("Skipping URL update: Cannot use pushState with blob: protocol.");
    }
  };


  // Effect to handle browser navigation (back/forward buttons)
  useEffect(() => {
    // On initial load, replace the current history state with one that includes the blog index.
    // This ensures that the state is available when the user navigates back to the initial page.
    window.history.replaceState({ blogIndex: currentPostIndex }, '');

    const handlePopState = (event: PopStateEvent) => {
      if (window.location.protocol !== 'blob:') {
        // When the user navigates, get the index from the history state if available.
        // If not, fall back to parsing the URL again.
        const newIndex = event.state?.blogIndex ?? getInitialPostIndex();
        setCurrentPostIndex(newIndex);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Run only once on component mount


  // --- Blog Post Navigation Functions ---
  const navigateToPost = (index: number) => {
    setCurrentPostIndex(index);
    updateUrlForPost(index); // Update the URL when the user navigates
  };


  const nextPost = () => {
    navigateToPost((currentPostIndex + 1) % blogPosts.length);
  };


  const prevPost = () => {
    navigateToPost((currentPostIndex - 1 + blogPosts.length) % blogPosts.length);
  };


  // --- Screenshot Functions ---
  const handleScreenshot = async () => {
    if (typeof (window as any).html2canvas === 'undefined') {
      console.error('html2canvas is not loaded.');
      // Using a custom message box instead of alert()
      const modal = document.createElement('div');
      modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
      modal.innerHTML = `
        <div class="bg-white p-6 rounded-none shadow-lg text-center border-2 border-black">
          <h3 class="text-lg font-bold mb-4 text-black" style="font-family: 'Courier Prime', monospace;">
            Screenshot functionality is not ready yet. Please try again in a moment.
          </h3>
          <button id="closeScreenshotModal" class="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-none transition-colors border border-black" style="font-family: 'Courier Prime', monospace;">
            Close
          </button>
        </div>
      `;
      document.body.appendChild(modal);
      document.getElementById('closeScreenshotModal')?.addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      return;
    }

    // Add a small delay to ensure all elements are rendered and settled
    setTimeout(async () => {
      try {
        const canvas = await (window as any).html2canvas(document.body);
        const dataUrl = canvas.toDataURL('image/png');
        setScreenshotDataUrl(dataUrl);
        setShowScreenshotModal(true);
      } catch (error) {
        console.error('Error capturing screenshot:', error);
        // Using a custom message box instead of alert()
        const modal = document.createElement('div');
        modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
        modal.innerHTML = `
          <div class="bg-white p-6 rounded-none shadow-lg text-center border-2 border-black">
            <h3 class="text-lg font-bold mb-4 text-black" style="font-family: 'Courier Prime', monospace;">
              Failed to capture screenshot. Please try again.
            </h3>
            <button id="closeScreenshotModal" class="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-none transition-colors border border-black" style="font-family: 'Courier Prime', monospace;">
              Close
            </button>
          </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('closeScreenshotModal')?.addEventListener('click', () => {
          document.body.removeChild(modal);
        });
      }
    }, 100); // 100ms delay
  };


  const downloadScreenshot = () => {
    const link = document.createElement('a');
    link.href = screenshotDataUrl;
    link.download = 'masterpiece.png'; // Changed filename here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowScreenshotModal(false);
  };


  const emailScreenshot = () => {
    // Note: Direct attachment of local files via mailto: is not supported by browsers for security reasons.
    // Users will still need to manually attach the screenshot after the email client opens.
    const emailAddress = 'people@nufab.studio'; // Updated email address
    const subject = encodeURIComponent('Screenshot from Blog App');
    const body = encodeURIComponent('Hello,\n\nPlease find the attached screenshot from the interactive blog app. You may need to manually attach the image file after this email opens.\n\nBest regards,');
    // Using a custom message box instead of alert()
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-none shadow-lg text-center border-2 border-black">
        <h3 class="text-lg font-bold mb-4 text-black" style="font-family: 'Courier Prime', monospace;">
          Your email client has opened. Please remember to manually attach the screenshot to the email.
        </h3>
        <button id="closeEmailModal" class="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-none transition-colors border border-black" style="font-family: 'Courier Prime', monospace;">
          Close
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('closeEmailModal')?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
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
    setHasDraggedLogo(false); // Reset drag flag at the start of a new drag
  };


  const dragLogo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingLogo) return;


    // Update pencilPosition to make grab cursor follow
    setPencilPosition({ x: e.clientX, y: e.clientY });


    setLogoPosition({
      x: e.clientX - dragOffsetLogo.x,
      y: e.clientY - dragOffsetLogo.y,
    });
    setHasDraggedLogo(true); // Set drag flag if movement occurs
  };


  const stopDraggingLogo = () => {
    setIsDraggingLogo(false);
    setIsGrabbing(false); // Hide grab cursor
    // The hasDraggedLogo state will be checked in the onClick handler
    // No need to reset it here immediately, as onClick fires after mouseUp
  };


  // --- Logo Click Handler ---
  const handleLogoClick = () => {
    if (!hasDraggedLogo) { // Only navigate if no drag occurred
      window.open('https://www.instagram.com/nufab.in/', '_blank');
    }
    setHasDraggedLogo(false); // Reset for next interaction
  };


  // --- Delete Blog Function ---
  const handleDeleteBlogClick = () => {
    setShowDeleteConfirmationModal(true);
  };


  const confirmDeleteBlog = () => {
    setShowBlogContentFrame(false);
    setShowNavButtons(false); // Hide chevron and "I'm bored" buttons
    setShowMoreOptions(false); // Hide more options if they were open

    setShowDeleteConfirmationModal(false); // Close confirmation modal
  };


  const abortDeleteBlog = () => {
    setShowDeleteConfirmationModal(false); // Close confirmation modal
  };


  const currentPost = blogPosts[currentPostIndex];


  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor }}>
      {/* Custom CSS for scrollbar */}
      <style>
        {`
          /* For Webkit browsers (Chrome, Safari) */
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px; /* Width of the scrollbar */
            height: 8px; /* Height of the scrollbar for horizontal */
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: white; /* Color of the track */
            border-radius: 0px; /* No curvature */
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: black; /* Color of the scroll thumb */
            border-radius: 0px; /* No curvature */
            border: 1px solid black; /* Border around the thumb */
          }

          /* For Firefox */
          .custom-scrollbar {
            scrollbar-width: thin; /* "auto" or "thin" */
            scrollbar-color: black white; /* thumb color track color */
          }
        `}
      </style>

      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-0" // Changed z-index to 0
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
          src="https://raw.githubusercontent.com/Raeskaa/studionufab/59d263299b8c3990bd561abbd995c9f13409b6ac/Cursor%20for%20Blog.svg"
          alt="Pencil Cursor"
          className="absolute z-50"
          style={{
            top: pencilPosition.y,
            left: pencilPosition.x,
            pointerEvents: 'none',
            transform: `translate(-50%, -50%) scale(${cursorScale})`,
            width: '32px',
            height: '32px',
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = "https://placehold.co/32x32/000000/FFFFFF?text=✏️";
            console.error("Failed to load Pencil SVG icon from URL");
          }}
        />
      )}


      {/* Dynamic Eye SVGs */}
      {eyes.map((eye) => (
        <div
          key={eye.id}
          className="absolute z-40" // Increased z-index for eyes to be above mobile blog frame
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
              width: '80.6px', // Reduced size to 70% of 128px
              height: '80.6px', // Reduced size to 70% of 128px
              transform: `rotate(${eye.rotation}deg)`, // Apply rotation
            }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = "https://placehold.co/89x89/000000/FFFFFF?text=Eye"; // Fallback image
              console.error("Failed to load Eye SVG icon from URL");
            }}
          />
        </div>
      ))}


      {/* Fixed Black Circle (Logo) - Now Draggable and Clickable */}
      <div
        ref={logoCircleRef}
        className="absolute rounded-full z-45 flex items-center justify-center" // Changed z-index to 45
        style={{
          top: logoPosition.y,
          left: logoPosition.x,
          width: '180px',
          height: '180px',
          backgroundColor: '#ffffff',
          cursor: 'none', // Always none, custom cursor will show
        }}
        onMouseDown={startDraggingLogo}
        onMouseMove={dragLogo}
        onMouseUp={stopDraggingLogo}
        onClick={handleLogoClick} // Added onClick handler
        onMouseLeave={stopDraggingLogo}
        onDragStart={e => e.preventDefault()} // Prevent browser drag
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
          draggable={false}
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
            className="w-8 h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
            style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}
          >
            <ChevronLeft size={16} className="text-black" />
          </button>
          <button
            onClick={nextPost}
            className="w-8 h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
            style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}
          >
            <ChevronRight size={16} className="text-black" />
          </button>
          <button
            onClick={randomizeColor}
            className="h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors ml-2 px-2 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
            title="Randomize background color"
            style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}
          >
            <span className="text-black" style={{ fontFamily: 'Courier Prime, Courier, monospace', fontSize: '0.875rem' }}>I'm bored</span>
          </button>
        </div>
      )}


      {/* Buttons after deletion (I'm bored and Screenshot) */}
      {!showBlogContentFrame && (
        <>
          <div className="fixed bottom-5 right-5 flex gap-4 z-40">
            <button
              onClick={handleScreenshot}
              className="h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors px-2 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
              title="Take a screenshot"
              style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}
            >
              <span className="text-black" style={{ fontFamily: 'Courier Prime, Courier, monospace', fontSize: '0.875rem' }}>screenshot</span>
            </button>
            <button
              onClick={randomizeColor}
              className="h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors px-2 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
              title="Randomize background color"
              style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}
            >
              <span className="text-black" style={{ fontFamily: 'Courier Prime, Courier, monospace', fontSize: '0.875rem' }}>I'm bored</span>
            </button>
          </div>

          {/* "More" button at top right */}
          <div className="fixed top-5 right-5 z-40">
            <button
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors px-2 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
              title="More options"
              style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}
            >
              <span className="text-black" style={{ fontFamily: 'Courier Prime, Courier, monospace', fontSize: '0.875rem' }}>More</span>
            </button>
            {showMoreOptions && (
              <div
                className={`
                  absolute top-full right-0 mt-2 flex flex-col gap-2 bg-white border border-black p-2 shadow-lg
                  transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${showMoreOptions ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
                `}
                style={{ transformOrigin: 'top right' }}
              >
                {/* Brush Size Controls */}
                <div className="flex flex-col gap-1">
                  <span className="text-black text-sm" style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}>Brush Size:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setBrushWidth(2)}
                      className={`h-8 bg-white hover:bg-gray-100 text-black py-1 px-2 rounded-none transition-colors border border-black ${brushWidth === 2 ? 'bg-gray-200' : ''} active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black`}
                      style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400, fontSize: '0.875rem' }}
                    >
                      Thin
                    </button>
                    <button
                      onClick={() => setBrushWidth(5)}
                      className={`h-8 bg-white hover:bg-gray-100 text-black py-1 px-2 rounded-none transition-colors border border-black ${brushWidth === 5 ? 'bg-gray-200' : ''} active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black`}
                      style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400, fontSize: '0.875rem' }}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => setBrushWidth(10)}
                      className={`h-8 bg-white hover:bg-gray-100 text-black py-1 px-2 rounded-none transition-colors border border-black ${brushWidth === 10 ? 'bg-gray-200' : ''} active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black`}
                      style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400, fontSize: '0.875rem' }}
                    >
                      Thick
                    </button>
                  </div>
                </div>

                {/* Brush Color Picker */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="brushColor" className="text-black text-sm" style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}>Brush Color:</label>
                  <input
                    type="color"
                    id="brushColor"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    className="h-8 w-full border border-black cursor-pointer active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
                    style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}
                  />
                </div>

                {/* Eraser Tool */}
                <button
                  onClick={() => setIsErasing(!isErasing)}
                  className={`h-8 bg-white hover:bg-gray-100 text-black py-1 px-2 rounded-none transition-colors border border-black ${isErasing ? 'bg-gray-200' : ''} active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black`}
                  style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400, fontSize: '0.875rem' }}
                >
                  {isErasing ? 'Drawing Mode' : 'Eraser Tool'}
                </button>

                {/* Clear Canvas Button */}
                <button
                  onClick={handleClearCanvas}
                  className="h-8 bg-white hover:bg-gray-100 text-black py-1 px-2 rounded-none transition-colors border border-black active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
                  style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400, fontSize: '0.875rem' }}
                >
                  Clear Canvas
                </button>

                {/* Save Drawing Button */}
                <button
                  onClick={handleSaveDrawing}
                  className="h-8 bg-white hover:bg-gray-100 text-black py-1 px-2 rounded-none transition-colors border border-black active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
                  style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400, fontSize: '0.875rem' }}
                >
                  Save Drawing
                </button>

              </div>
            )}
          </div>
        </>
      )}


      {/* Blog Content Frame - Conditionally Rendered */}
      {showBlogContentFrame && (
        <div
          ref={blogFrameRef}
          className="absolute bg-white border-2 border-black z-30 p-8" // Removed overflow-y-auto here
          style={{
            top: framePosition.y,
            left: framePosition.x,
            width: '55vw',
            height: '70vh',
            cursor: 'none', // Always none, custom cursor will show
            position: 'absolute', // Ensure this is explicitly set for positioning children
          }}
          onMouseDown={startDraggingFrame}
          onMouseMove={dragFrame}
          onMouseUp={stopDraggingFrame}
          onMouseLeave={stopDraggingFrame} // Stop dragging if mouse leaves the window
        >
          {/* Screenshot and Delete Buttons - Fixed position relative to blogFrameRef */}
          <div className="absolute top-4 left-4 flex gap-2 z-20">
            <button
              onClick={handleScreenshot}
              className="h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors px-2 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
              title="Take a screenshot"
              style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}
            >
              <span className="text-black" style={{ fontFamily: 'Courier Prime, Courier, monospace', fontSize: '0.875rem' }}>screenshot</span>
            </button>
            <button
              onClick={handleDeleteBlogClick} // Call the new handler for confirmation
              className="h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors px-2 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
              title="Delete Blog Frame"
              style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}
            >
              <span className="text-black" style={{ fontFamily: 'Courier Prime, Courier, monospace', fontSize: '0.875rem' }}>dlt</span>
            </button>
          </div>


          {/* Scrollable content area */}
          <div className="overflow-y-auto h-full w-full pt-16 pb-8 custom-scrollbar"> {/* Added custom-scrollbar class */}
            <h1
              className="text-black mb-0 leading-tight text-2xl md:text-4xl lg:text-5xl uppercase"
              style={{
                fontFamily: 'dotmatri, serif',
                fontWeight: '400'
              }}
            >
              {currentPostIndex === 0 ? (
                <span style={{ display: 'inline-block' }}>
                  NUFAB IS A DESIGN STUDIO
                  <img
                    src={Asterisk}
                    alt="Asterisk"
                    style={{
                      display: 'inline',
                      height: '0.35em',
                      width: 'auto',
                      verticalAlign: 'super',
                      marginLeft: '0.1em',
                    }}
                  />
                </span>
              ) : (
                currentPost.title
              )}
            </h1>


            <h2
              className={`text-black mb-8 leading-tight text-sm md:text-lg lg:text-xl ${currentPostIndex === 0 ? 'text-gray-500 text-xs md:text-sm lg:text-base leading-snug' : ''}`}
              style={
                currentPostIndex === 0 && currentPost.subtitle === '*or maybe something else entirely.'
                  ? {
                      fontFamily: 'Sofia Sans',
                      fontWeight: 400,
                      color: '#000',
                      lineHeight: 1.3,
                    }
                  : currentPostIndex === 0
                  ? {
                      fontFamily: 'Courier Prime, Courier, monospace',
                      fontWeight: 400,
                      color: '#6B7280', // Tailwind gray-500
                      lineHeight: 1.3,
                    }
                  : {
                      fontFamily: 'Sofia Sans',
                      fontWeight: 400,
                    }
              }
            >
              {currentPost.subtitle}
            </h2>


            <p
              className={`text-black mb-8 text-xs md:text-sm ${currentPostIndex === 0 ? 'text-gray-500 text-xs md:text-sm lg:text-base leading-snug' : ''}`}
              style={currentPostIndex === 0 ? {
                fontFamily: 'Courier Prime, Courier, monospace',
                fontWeight: 400,
                color: '#6B7280', // Tailwind gray-500
                lineHeight: 1.3,
              } : {
                fontFamily: 'Courier Prime, monospace',
                fontWeight: 400,
              }}
            >
              {currentPost.date}
            </p>


            <div className="space-y-6"> {/* Removed pt-4 here */}
              {currentPost.content.map((paragraph, index) => {
                // For the first blog post, render section headers as h4, underlined, not bold, with numbers
                const sectionHeaders = [
                  "Looking Inward",
                  "Looking Ahead",
                  "Looking Around",
                  "Not Looking"
                ];
                const sectionIndex = sectionHeaders.indexOf(paragraph);
                if (currentPostIndex === 0 && sectionIndex !== -1) {
                  const number = (sectionIndex + 1).toString().padStart(2, '0');
                  return (
                    <h4
                      key={index}
                      className="text-black underline mb-2 mt-8 text-base md:text-lg lg:text-xl"
                      style={{
                        fontFamily: 'Sofia Sans',
                        fontWeight: 400,
                        textDecorationThickness: '2px',
                        textUnderlineOffset: '4px',
                      }}
                    >
                      {number}. {paragraph}
                    </h4>
                  );
                }
                // Default paragraph rendering
                return (
                  <p
                    key={index}
                    className="text-black leading-relaxed text-sm md:text-lg lg:text-xl"
                    style={{
                      fontFamily: 'Sofia Sans',
                      fontWeight: 400,
                    }}
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {showDeleteConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-none shadow-lg text-center border-2 border-black">
            <h3 className="text-lg font-bold mb-4 text-black" style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}>
              Delete the blog frame?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeleteBlog}
                className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-none transition-colors border border-black active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
                style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}
              >
                Yes
              </button>
              <button
                onClick={abortDeleteBlog}
                className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-none transition-colors border border-black active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
                style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}
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
            <h3 className="text-lg font-bold mb-4 text-black" style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}>
              Caught you creating
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={downloadScreenshot}
                className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-none transition-colors border border-black active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
                style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}
              >
                Save
              </button>
              <button
                onClick={emailScreenshot}
                className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-none transition-colors border border-black active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
                style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}
              >
                Share
              </button>
              <button
                onClick={() => setShowScreenshotModal(false)}
                className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-none transition-colors border border-black active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
                style={{ fontFamily: 'Courier Prime, Courier, monospace', fontWeight: 400 }}
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Mobile Blog Content - Hidden by default for desktop, shown on mobile */}
      <div className="md:hidden absolute inset-0 bg-white overflow-y-auto p-6 z-30 custom-scrollbar" id="mobile-blog">
        {/* Removed <h2 className="text-lg font-bold">Blog</h2> */}
        <div className="flex justify-between items-center mb-6">
          {/* Mobile-specific navigation and "I'm bored" buttons */}
          {showBlogContentFrame && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
              <button
                onClick={prevPost}
                className="w-10 h-10 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors rounded-full shadow-md active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
              >
                <ChevronLeft size={20} className="text-black" />
              </button>
              <button
                onClick={nextPost}
                className="w-10 h-10 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors rounded-full shadow-md active:scale-95 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
              >
                <ChevronRight size={20} className="text-black" />
              </button>
            </div>
          )}
        </div>


        <h1 className="uppercase text-4xl font-bold mb-1" style={{ fontFamily: 'dotmatri, serif' }}>
          {currentPostIndex === 0 ? (
            <span style={{ display: 'inline-block' }}>
              NUFAB IS A DESIGN STUDIO
              <img
                src={Asterisk}
                alt="Asterisk"
                style={{
                  display: 'inline',
                  height: '0.35em',
                  width: 'auto',
                  verticalAlign: 'super',
                  marginLeft: '0.1em',
                }}
              />
            </span>
          ) : (
            currentPost.title
          )}
        </h1>
        <h2
          className={`mb-4 leading-relaxed text-base ${currentPostIndex === 0 ? 'text-gray-500 leading-snug' : ''}`}
          style={{
            fontFamily: 'Sofia Sans, sans-serif',
            fontWeight: 400,
            color: currentPostIndex === 0 && currentPost.subtitle === '*or maybe something else entirely.' ? '#000' : (currentPostIndex === 0 ? '#6B7280' : undefined),
            lineHeight: 1.3,
          }}
        >
          {currentPost.subtitle}
        </h2>
        <p
          className={`text-sm mb-10 ${currentPostIndex === 0 ? 'text-gray-500 text-xs md:text-sm lg:text-base leading-snug' : ''}`}
          style={currentPostIndex === 0 ? {
            fontFamily: 'Courier Prime, Courier, monospace',
            fontWeight: 400,
            color: '#6B7280',
            lineHeight: 1.3,
          } : {
            fontFamily: 'Courier Prime, monospace',
            fontWeight: 400,
          }}
        >
          {currentPost.date}
        </p>
        <div className="space-y-6">
          {currentPost.content.map((paragraph, index) => {
            // Section headers logic for mobile
            const sectionHeaders = [
              "Looking Inward",
              "Looking Ahead",
              "Looking Around",
              "Not Looking"
            ];
            const sectionIndex = sectionHeaders.indexOf(paragraph);
            if (currentPostIndex === 0 && sectionIndex !== -1) {
              const number = (sectionIndex + 1).toString().padStart(2, '0');
              return (
                <h4
                  key={index}
                  className="text-black underline mb-2 mt-8 text-base md:text-lg lg:text-xl"
                  style={{
                    fontFamily: 'Sofia Sans',
                    fontWeight: 400,
                    textDecorationThickness: '2px',
                    textUnderlineOffset: '4px',
                  }}
                >
                  {number}. {paragraph}
                </h4>
              );
            }
            // Default paragraph rendering
            return (
              <p
                key={index}
                className="mb-4 leading-relaxed text-base"
                style={{ fontFamily: 'Sofia Sans, sans-serif' }}
              >
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}


export default App;
