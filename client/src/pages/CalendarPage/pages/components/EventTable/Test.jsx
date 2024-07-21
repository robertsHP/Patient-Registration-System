import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const Test = () => {
  const [clickTimeout, setClickTimeout] = useState(null);

  const handleClick = (itemKey) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleDoubleClick(itemKey);
    } else {
      const timeout = setTimeout(() => {
        setClickTimeout(null);
      }, 300); // Adjust the timeout duration to detect double-clicks properly
      setClickTimeout(timeout);
    }
  };

  const handleDoubleClick = (itemKey) => {
    console.log('Double clicked on:', itemKey);
    // Add your custom logic here
  };

  const layout = [
    { i: 'a', x: 0, y: 0, w: 1, h: 2, static: false },
    { i: 'b', x: 1, y: 0, w: 3, h: 2, static: false },
    { i: 'c', x: 4, y: 0, w: 1, h: 2, static: false }
  ];

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
    >
      {layout.map(item => (
        <div
          key={item.i}
          onClick={() => handleClick(item.i)}
          style={{ border: '1px solid black', textAlign: 'center', userSelect: 'none' }}
        >
          {item.i}
        </div>
      ))}
    </GridLayout>
  );
};

export default Test;
