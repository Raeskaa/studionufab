import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const blogPosts = [
  {
    title: "What is the difference between art and design?",
    subtitle: "Exploring the boundaries of creative expression",
    date: "24 July 2025",
    content: [
      "The first question asked in all design colleges is \"what is the difference between art and design?\" and following it is the holy revelation of the separation — functionality. This piece of information slips almost boastingly off the design educator's tongue – Design is functional, Art is merely expressive. Design is selfless, Art is selfish. Design facilitates, Art just is.",
      "We are passionate anti-believers of the existence of this border. Don't get me wrong, I too have walked alongside it, like an ant bound by a line of chalk. But careless trespassing with wonderful consequences has lead me to believe that the border is fictitious, created perhaps to compensate for the lack of organized paths in creative fields. But this sort of organization is simply like well-treaded paths in an endless grassy field. I believe that it really is free-range here, and there simply is nothing that cannot be design.",
      "The first question asked in all design colleges is \"what is the difference between art and design?\" and following it is the holy revelation of the separation — functionality. This piece of information slips almost boastingly off the design educator's tongue – Design is functional, Art is merely expressive. Design is selfless, Art is selfish. Design facilitates, Art just is.",
      "We are passionate anti-believers of the existence of this border. Don't get me wrong, I too have walked alongside it, like an ant bound by a line of chalk. But careless trespassing with wonderful consequences has lead me to believe that the border is fictitious, created perhaps to compensate for the lack of organized paths in creative fields. But this sort of organization is simply like well-treaded paths in an endless grassy field. I believe that it really is free-range here, and there simply is nothing that cannot be design."
    ]
  },
// 
//    title: "The evolution of digital creativity",
 //   subtitle: "How technology reshapes artistic expression",
   // date: "15 July 2025",
   // content: [
   //   "Digital tools have fundamentally transformed how we approach creative work. What once required physical materials and extensive setup can now be accomplished with a few clicks and gestures. This democratization of creative tools has opened new possibilities for expression and experimentation.",
    //  "However, with this accessibility comes new challenges. The abundance of options can be overwhelming, and the ease of creation sometimes leads to a devaluation of the creative process. The question becomes: how do we maintain the essence of craftsmanship in a digital age?"
  //  ]S
  //},
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

  const colors = [
    '#e91e63', // Original pink
    '#f8f9fa', // Light gray
    '#FFCE01', // Yellow
    '#FFA2CE', // Light pink
    '#FF9902', // Orange
    '#f44336'  // Red
  ];

  const randomizeColor = () => {
    const currentIndex = colors.indexOf(backgroundColor);
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * colors.length);
    } while (newIndex === currentIndex);
    setBackgroundColor(colors[newIndex]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

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

    // Prevent drawing in the blog frame area (starts at 45% of screen width from left)
    const blogFrameRight = window.innerWidth * 0.45;
    if (e.clientX <= blogFrameRight) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastPosition({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const nextPost = () => {
    setCurrentPostIndex((prev) => (prev + 1) % blogPosts.length);
  };

  const prevPost = () => {
    setCurrentPostIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);
  };

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
          right: '400px',
          width: '120px',
          height: '120px',
          backgroundColor: '#000000'
        }}
      >
       <img
  src="https://raw.githubusercontent.com/Raeskaa/studionufab/refs/heads/main/Asset%203%201.svg"
  alt="Decorative Icon" // Always provide an alt text for accessibility
  className="w-3/4 h-3/4" // Adjust size as needed
  // Optional: Add an onerror handler for fallback if image fails to load
  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "https://placehold.co/100x100/000000/FFFFFF?text=Error"; // Fallback image
    console.error("Failed to load SVG icon from URL");
  }}
/>
      </div>

      {/* Navigation Arrows - Outside Frame */}
      <div className="absolute flex gap-2 z-20" style={{ 
        bottom: 'calc(70vh + 14px)', 
        left: '2vw'
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
          className="w-8 h-8 bg-white hover:bg-gray-100 border border-black flex items-center justify-center transition-colors ml-2"
          title="Randomize background color"
        >
        </button>
      </div>

      {/* Blog Content Frame */}
      <div 
        className="absolute bg-white border-2 border-black overflow-y-auto z-20 p-8"
        style={{
          bottom: '0vh',
          left: '0vw',
          width: '55vw',
          height: '70vh'
        }}
      >
        <h1 
          className="text-black mb-3 leading-tight text-2xl md:text-4xl lg:text-5xl"
          style={{ 
            fontFamily: 'Dai Banna SIL, serif', 
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

      {/* Mobile Blog Content */}
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
        {currentPost.content.map((paragraph, index) => (
          <p key={index} className="mb-4 leading-relaxed" style={{ fontFamily: 'Sofia Sans, sans-serif' }}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;