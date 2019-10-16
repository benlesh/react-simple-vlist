import React from 'react';
import VList from 'react-simple-vlist';

function BasicUsage() {
  const items = Array.from({ length: 100000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    data: Math.round(Math.random() * 100),
  }));

  return (
    <VList items={items} itemHeight={50} height={200}>
      {(item, itemIndex) => (
        <>
          {item.name}: {item.data}
        </>
      )}
    </VList>
  );
}
