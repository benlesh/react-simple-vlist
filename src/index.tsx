/**
 * Copyright 2019 Ben Lesh <ben@benlesh.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without
 * limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
 * EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { useRef, useState } from 'react';

interface VListScrollEvent {
  /**
   * The index of the first displayed item in the list
   * as of the scroll event.
   */
  startIndex: number;
}

interface VListProps<T> {
  /**
   * The height, in pixels, of each item in the list.
   */
  itemHeight: number;

  /**
   * The optional index to start displaying from. For example, if you have a `startIndex` of
   * `3`, the fourth item in the `items` array will be "scrolled" to the top of the list.
   */
  startIndex?: number;

  /**
   * The list of items. The data used to feed the virtualized list.
   */
  items: T[];

  /**
   * The width of the list. Defaults to `"100%"`. If a number is specified,
   * that is the width in pixels.
   */
  width?: number | string;

  /**
   * The height of the list, in pixels.
   */
  height: number;

  /**
   * A function used as a rendering template for each item. The JSX returned here will be rendered
   * _inside_ of each item.
   */
  children: (item: T, index: number) => JSX.Element;

  /**
   * An event that is fired when the list is scrolled
   */
  onScroll?: (e: VListScrollEvent) => void;

  /**
   * Props to be applied to the scrollable `<div>` that contains
   * the virtualized items.
   *
   * This is useful for setting things like ARIA `role` and other `aria-*` attributes.
   */
  containerProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;

  /**
   * Props to be applied to the `<div>` elements that wrap each
   * virtualized item in the list.
   *
   * This is useful for setting things like ARIA `role` and other `aria-*` attributes.
   */
  itemProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
}

/**
 * A simple, vertical scrolling, virtualized list.
 */
export default function VList<T>(props: VListProps<T>) {
  const {
    itemHeight,
    children,
    height = 300,
    startIndex = 0,
    items,
    width = '100%',
    onScroll,
    containerProps,
    itemProps,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleStartIndex, setVisibleStartIndex] = useState(startIndex);

  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = startIndex * itemHeight;
    }
  }, [itemHeight, startIndex]);

  // We're adding one here because at certain zoom levels, the math is
  // *just* right, that we can sometimes be missing the last item in the list.
  const displayCount = Math.ceil(height / itemHeight);
  const displayHeight = displayCount * itemHeight;
  const contentHeight = items.length * itemHeight;
  const containerHeight = Math.min(contentHeight, displayHeight);

  const onContainerScroll = () => {
    const scrollTop = containerRef.current!.scrollTop;
    const startIndex = Math.round(scrollTop / itemHeight);
    setVisibleStartIndex(startIndex);
    onScroll &&
      onScroll({
        startIndex,
      });
  };

  const containerStyle = {
    overflow: 'auto',
    height: containerHeight + 'px',
    width,
  };

  const contentStyle = {
    height: contentHeight + 'px',
    width,
  };

  const itemStyle = {
    height: itemHeight + 'px',
    overflow: 'hidden',
    width,
  };

  const itemContainerY = visibleStartIndex * itemHeight;

  const itemContainerStyle = {
    transform: `translate3d(0, ${itemContainerY}px, 0)`,
    width,
    height: 0,
    overflow: 'visible',
  };

  const visibleItems = [];
  const endIndex = visibleStartIndex + displayCount;
  const itemsLength = items.length;
  for (let i = visibleStartIndex; i < endIndex && i < itemsLength; i++) {
    const item = items[i];
    visibleItems.push(
      <div {...itemProps} style={itemStyle} key={i % displayCount}>
        {children(item, i)}
      </div>
    );
  }

  return (
    <div
      {...containerProps}
      ref={containerRef}
      style={containerStyle}
      onScroll={onContainerScroll}
    >
      <div style={contentStyle}>
        <div style={itemContainerStyle}>{visibleItems}</div>
      </div>
    </div>
  );
}
