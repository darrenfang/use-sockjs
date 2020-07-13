# use-sockjs

![Node.js Package](https://github.com/darrenfang/use-sockjs/workflows/Node.js%20Package/badge.svg)
![NPM](https://img.shields.io/npm/l/use-sockjs)
[![NPM](https://img.shields.io/npm/v/use-sockjs)](https://www.npmjs.com/package/use-sockjs)

React Hook for SockJs

## Installation

```shell
yarn add use-sockjs
```

## Usage

Wrap your app inside the SockJsProvider component.

```typescript jsx
import React from 'react'
import { SockJsProvider } from 'use-sockjs'

const App = () => {
  return (
    <SockJsProvider
        url='http://localhost/ws'
        onError={(error: Frame | string) => {
        }}
    >
      {/* ... */}
    </SockJsProvider>
  )
}

export default App
```

Call the `useSockJs` hook in the components.

```typescript jsx
import React from 'react'
import { useSockJs } from 'use-sockjs'
import { Frame, Message } from 'stompjs'

export const MyComponent: React.FunctionComponent = () => {
  useEffect(() => {
    const client = subscribe({
      destination: 'destination',
      headers: {},
      onMessage: message => {
      },
      onSubscribed: (_subscription) => {
      }
    })
  }, [])

  return (
    <div></div>
  )
}
```
