import React from 'react';
import './nine.css'


const NineMensMorris = () => {
  const outerSquarePoints = [
    { id: 'O1', x: 5, y: 5 }, { id: 'O2', x: 50, y: 5 }, { id: 'O3', x: 95, y: 5 },
    { id: 'O4', x: 95, y: 50 }, { id: 'O5', x: 95, y: 95 }, { id: 'O6', x: 50, y: 95 },
    { id: 'O7', x: 5, y: 95 }, { id: 'O8', x: 5, y: 50 },
  ];

  const middleSquarePoints = [
    { id: 'M1', x: 20, y: 20 }, { id: 'M2', x: 50, y: 20 }, { id: 'M3', x: 80, y: 20 },
    { id: 'M4', x: 80, y: 50 }, { id: 'M5', x: 80, y: 80 }, { id: 'M6', x: 50, y: 80 },
    { id: 'M7', x: 20, y: 80 }, { id: 'M8', x: 20, y: 50 },
  ];

  const innerSquarePoints = [
    { id: 'I1', x: 35, y: 35 }, { id: 'I2', x: 50, y: 35 }, { id: 'I3', x: 65, y: 35 },
    { id: 'I4', x: 65, y: 50 }, { id: 'I5', x: 65, y: 65 }, { id: 'I6', x: 50, y: 65 },
    { id: 'I7', x: 35, y: 65 }, { id: 'I8', x: 35, y: 50 },
  ];

  const allPoints = [...outerSquarePoints, ...middleSquarePoints, ...innerSquarePoints];


  return (
    <div className="game-board">
      {allPoints.map((point) => (
        <div
          key={point.id}
          className="point"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
        ></div>
      ))}
       <svg className="connections" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
        <line x1="200" y1="20" x2="200" y2="140" stroke="black" strokeWidth="1" />
        <line x1="200" y1="260" x2="200" y2="380" stroke="black" strokeWidth="1" />
        //vertical
        <line x1="20" y1="200" x2="140" y2="200" stroke="black" strokeWidth="1" />
        <line x1="260" y1="200" x2="380" y2="200" stroke="black" strokeWidth="1" />
      </svg>
      <div className="square outer"></div>
      <div className="square middle"></div>
      <div className="square inner"></div>
    </div>
  );
};

export default NineMensMorris;
