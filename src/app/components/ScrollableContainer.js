import React, {useEffect, useRef, useState} from 'react';

export default function ScrollableContainer({children, canScroll=true, className="", ...rest}) {
    const scrollContainerRef = useRef();
    const [scrollDirection, setScrollDirection] = useState(null);
    const [scrollSpeed, setScrollSpeed] = useState(5);
    const [currentScrollSpeed, setCurrentScrollSpeed] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const scrollContainer = scrollContainerRef.current;
            
            if (scrollContainer) {
              const { top, bottom, height } = scrollContainer.getBoundingClientRect();
              const scrollThresholdPercentage = 0.35; // 35%
              const scrollThreshold = height * scrollThresholdPercentage;
          
              // Check if the mouse is near the top edge
              if (e.clientY < top + scrollThreshold) {
                const distance = top + scrollThreshold - e.clientY;
                setScrollDirection("up");
                setCurrentScrollSpeed(distance / scrollThreshold); // Speed ranges from 0 to 1
                
              }
              // Check if the mouse is near the bottom edge
              else if (e.clientY > bottom - scrollThreshold) {
                const distance = e.clientY - (bottom - scrollThreshold);
                setScrollDirection("down");
                setCurrentScrollSpeed(distance / scrollThreshold); // Speed ranges from 0 to 1)
              } else {
                setScrollDirection(null);
                setCurrentScrollSpeed(0);
              }
            }
        };
    
        document.addEventListener('mousemove', handleMouseMove);
    
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
        };
      }, []);
    
      useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        const scrollInterval = setInterval(() => {
          if (scrollContainer && canScroll && scrollDirection) {
            const speed = scrollSpeed * currentScrollSpeed; // Adjust speed dynamically
            if (scrollDirection === "up") {
                scrollContainerRef.current.scrollBy(0, -speed);
            } else if (scrollDirection === "down") {
                scrollContainerRef.current.scrollBy(0, speed);
            }
          }
        }, 5);
    
        return () => clearInterval(scrollInterval);
      }, [scrollDirection, currentScrollSpeed, canScroll, scrollSpeed]);

      useEffect(() => {
      }, [scrollDirection]);

    return (
        <div
        className={`max-w-full max-h-full overflow-auto ${className}`}
            ref={scrollContainerRef}
            {...rest}
        >
            {children}
        </div>
    );
};
