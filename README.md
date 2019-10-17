# react-simple-list

[MIT Licensed](/LICENSE.txt)

A very simple virtualized list. This component only attempts to solve the problems of virtualized, vertical scrolling, in a very simple way. Nothing else.

## Important

By contributing to this repository, you're agreeing to follow a [code of conduct](/CODE_OF_CONDUCT.md). Thank you.

## Basic Usage

Below shows the most naive usage of the component.

```ts
import React from 'react';
import VList from 'react-simple-vlist';

function BasicUsage() {
  /**
   * A generated list of items.
   */
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
```

## a11y

Because the aim of this component is to handle only what is necessary to virtualize a list vertically in terms of DOM-manipulation, this component does _nothing_ on its own to setup ARIA attributes or roles. However, it does expose two properties that allow custom properties to be set on the scrollable container and the individual item containers (for visible items). Those properties are `containerProps` and `itemProps`, respectively.

For example, dealing with a virtualized list of articles you may do the following:

```ts
<VList
  items={listOfArticles}
  itemHeight={150}
  height={800}
  containerProps={{
    role: 'feed',
  }}
>
  {(art, i) => (
    <article aria-posinset={i} aria-setsize={listOfArticles.length}>
      <h2>{art.title}</h2>
      <p>{art.summary}</p>
    </article>
  )}
</VList>
```

Or perhaps you want just a simple virtualized list of items:

```ts
<VList
  items={allTheNamesEver}
  itemHeight={30}
  height={800}
  containerProps={{
    role: 'list',
  }}
  itemProps={{
    role: 'listitem',
  }}
>
  {(name, i) => <>{name}</>}
</VList>
```

(NOTE: To any **a11y** experts, I'd love help improving these examples)
