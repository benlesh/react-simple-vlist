import * as React from 'react';
import VList from '..';
import { render, fireEvent } from '@testing-library/react';

describe('VList', () => {
  it('should render a few items', async () => {
    const items = ['apples', 'bananas', 'oranges'];

    const { findAllByRole } = render(
      <VList
        items={items}
        itemHeight={20}
        height={200}
        containerProps={{
          role: 'listbox',
          'aria-orientation': 'vertical',
        }}
        itemProps={{
          role: 'option',
        }}
      >
        {(item, i) => (
          <>
            {i}: {item}
          </>
        )}
      </VList>
    );

    const listitems = await findAllByRole('option');
    expect(listitems.map(el => el.textContent)).toEqual([
      '0: apples',
      '1: bananas',
      '2: oranges',
    ]);
  });

  it('should render a LOT of items, but only show the top few by default', async () => {
    const items = Array.from({ length: 100000 }, (_, i) => `Item ${i}`);

    const { findAllByRole } = render(
      <VList
        items={items}
        itemHeight={50}
        height={200}
        itemProps={{
          role: 'listitem',
        }}
      >
        {(item, i) => (
          <>
            {i}: {item}
          </>
        )}
      </VList>
    );

    const listitems = await findAllByRole('listitem');

    expect(listitems.map(el => el.textContent)).toEqual([
      '0: Item 0',
      '1: Item 1',
      '2: Item 2',
      '3: Item 3',
      '4: Item 4',
    ]);
  });

  it('should update the rendered items when you scroll down and up', async () => {
    const items = Array.from({ length: 100000 }, (_, i) => `Item ${i}`);

    const { findAllByTestId, findByRole } = render(
      <VList
        items={items}
        itemHeight={50}
        height={200}
        containerProps={{
          role: 'feed',
        }}
      >
        {(item, i) => (
          <article
            data-testid="article"
            aria-posinset={i}
            aria-setsize={items.length}
          >
            {i}: {item}
          </article>
        )}
      </VList>
    );

    const feed = await findByRole('feed');

    // Scroll down to 800 from 0.
    scrollTo(feed, 800);

    let articles = await findAllByTestId('article');

    expect(articles.map(el => el.textContent)).toEqual([
      '16: Item 16',
      '17: Item 17',
      '18: Item 18',
      '19: Item 19',
      '20: Item 20',
    ]);

    // Scroll up to 400 from 800
    scrollTo(feed, 400);

    articles = await findAllByTestId('article');
    expect(articles.map(el => el.textContent)).toEqual([
      '8: Item 8',
      '9: Item 9',
      '10: Item 10',
      '11: Item 11',
      '12: Item 12',
    ]);
  });

  it('should start scrolled to the position of the item at the `startIndex`', async () => {
    const items = Array.from({ length: 100000 }, (_, i) => `Item ${i}`);

    const { findAllByTestId, findByRole } = render(
      <VList
        items={items}
        itemHeight={50}
        height={200}
        startIndex={16}
        containerProps={{
          role: 'feed',
        }}
      >
        {(item, i) => (
          <article
            data-testid="article"
            aria-posinset={i}
            aria-setsize={items.length}
          >
            {i}: {item}
          </article>
        )}
      </VList>
    );

    const feed = await findByRole('feed');

    expect(feed.scrollTop).toBe(800);

    let articles = await findAllByTestId('article');
    expect(articles.map(el => el.textContent)).toEqual([
      '16: Item 16',
      '17: Item 17',
      '18: Item 18',
      '19: Item 19',
      '20: Item 20',
    ]);
  });

  it('should have an onScroll event that fires when the feed is scrolled', async () => {
    const items = Array.from({ length: 100000 }, (_, i) => `Item ${i}`);
    const onScrollHandler = jest.fn();

    const { findByRole } = render(
      <VList
        items={items}
        startIndex={16}
        itemHeight={50}
        height={200}
        onScroll={onScrollHandler}
        containerProps={{
          role: 'feed',
        }}
      >
        {(item, i) => (
          <>
            {i}: {item}
          </>
        )}
      </VList>
    );

    const feed = await findByRole('feed');

    scrollTo(feed, 1000);

    expect(onScrollHandler).toHaveBeenCalledWith({
      startIndex: 20,
    });
  });

  it('should have a default width of 100%', async () => {
    const items = [1, 2, 3];
    const { findByRole } = render(
      <VList
        items={items}
        itemHeight={30}
        height={300}
        containerProps={{
          role: 'feed',
        }}
      >
        {item => <span>{item}</span>}
      </VList>
    );

    const feed = await findByRole('feed');
    expect(feed.style.width).toBe('100%');
  });
});

function scrollTo(el: HTMLElement, y: number) {
  el.scrollTop = y;
  fireEvent(el, new Event('scroll'));
}
