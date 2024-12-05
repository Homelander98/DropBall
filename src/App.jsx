import React, { useState, useEffect, useRef } from "react";
import "./style.css";

const BallDropGame = () => {
  const [balls, setBalls] = useState([]);
  const containerRef = useRef(null);

  const colors = ["cyan", "red", "blue", "green", "yellow", "purple", "orange"];

  const handleClick = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // Ball's X position relative to the container
    const y = e.clientY - rect.top;  // Ball's Y position relative to the container
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    setBalls((prev) => [
      ...prev,
      { id: Date.now(), x, y, vx: 0, vy: 0, color: randomColor }, // Add random color to ball
    ]);
  };

  const detectCollisions = (updatedBalls) => {
    const ballRadius = 10;

    for (let i = 0; i < updatedBalls.length; i++) {
      for (let j = i + 1; j < updatedBalls.length; j++) {
        const dx = updatedBalls[i].x - updatedBalls[j].x;
        const dy = updatedBalls[i].y - updatedBalls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ballRadius * 2) {
          // Elastic collision response
          const angle = Math.atan2(dy, dx);
          const targetDistance = ballRadius * 2;
          const overlap = targetDistance - distance;

          // Separate overlapping balls
          updatedBalls[i].x += (overlap / 2) * Math.cos(angle);
          updatedBalls[i].y += (overlap / 2) * Math.sin(angle);

          updatedBalls[j].x -= (overlap / 2) * Math.cos(angle);
          updatedBalls[j].y -= (overlap / 2) * Math.sin(angle);

          // Swap velocities (simplified physics)
          const tempVx = updatedBalls[i].vx;
          const tempVy = updatedBalls[i].vy;

          updatedBalls[i].vx = updatedBalls[j].vx;
          updatedBalls[i].vy = updatedBalls[j].vy;

          updatedBalls[j].vx = tempVx;
          updatedBalls[j].vy = tempVy;
        }
      }
    }

    return updatedBalls;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBalls((prevBalls) => {
        const containerWidth = 300;
        const containerHeight = 400;
        const ballRadius = 10;

        let updatedBalls = prevBalls.map((ball) => {
          const nextX = ball.x + ball.vx;
          const nextY = ball.y + ball.vy;

          const isAtBottom = nextY + ballRadius >= containerHeight;
          const isAtTop = nextY - ballRadius <= 0;
          const isAtLeft = nextX - ballRadius <= 0;
          const isAtRight = nextX + ballRadius >= containerWidth;

          return {
            ...ball,
            x: isAtLeft
              ? ballRadius
              : isAtRight
              ? containerWidth - ballRadius
              : nextX,
            y: isAtTop
              ? ballRadius
              : isAtBottom
              ? containerHeight - ballRadius
              : nextY,
            vx: isAtLeft || isAtRight ? -ball.vx : ball.vx,
            vy: isAtTop || isAtBottom ? -ball.vy * 0.8 : ball.vy + 1, // Gravity & bounce damping
          };
        });

        return detectCollisions(updatedBalls);
      });
    }, 16); // ~60FPS
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="game-container"
      ref={containerRef}
      onClick={handleClick}
    >
      {balls.map((ball) => (
        <div
          key={ball.id}
          className="ball"
          style={{
            left: `${ball.x - 10}px`, // Center the ball horizontally
            top: `${ball.y - 10}px`,  // Center the ball vertically
            backgroundColor: ball.color, // Assign the random color
          }}
        />
      ))}
    </div>
  );
};

export default BallDropGame;
