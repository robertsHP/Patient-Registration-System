import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const MouseTest = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const cols = 12; // Number of columns in your grid
    const rowHeight = 30; // Height of each row in the grid
    const gridWidth = 1200; // Width of your grid

    const onMouseMove = (event) => {
        const gridElement = event.currentTarget;
        const boundingRect = gridElement.getBoundingClientRect();
        const x = event.clientX - boundingRect.left;
        const y = event.clientY - boundingRect.top;

        setMousePosition({ x, y });
    };

    const colWidth = gridWidth / cols;
    const hoveredCol = Math.floor(mousePosition.x / colWidth);
    const hoveredRow = Math.floor(mousePosition.y / rowHeight);

    // Generate layout for the grid of numbers
    const layout = [];
    for (let i = 0; i < 100; i++) {
        layout.push({
            i: i.toString(),
            x: i % cols,
            y: Math.floor(i / cols),
            w: 1,
            h: 1
        });
    }

    return (
        <div
            onMouseMove={onMouseMove}
            style={{ width: gridWidth, height: rowHeight * 10, position: 'relative' }}
        >
            <GridLayout
                className="layout"
                layout={layout}
                cols={cols}
                rowHeight={rowHeight}
                width={gridWidth}
            >
                {layout.map(item => (
                    <div key={item.i} style={{ border: '1px solid black', textAlign: 'center' }}>
                        {item.i}
                    </div>
                ))}
            </GridLayout>
            <div style={{ position: 'absolute', top: 0, left: 0 }}>
                Mouse Position: {mousePosition.x}, {mousePosition.y}
                <br />
                Hovered Column: {hoveredCol}, Hovered Row: {hoveredRow}
            </div>
        </div>
    );
};

export default MouseTest;
