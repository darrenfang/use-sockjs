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
import { Client, Frame, Message, Subscription } from 'stompjs'

export const MyComponent: React.FunctionComponent = () => {
  const { client, connect, disconnect, subscribe } = useSockJs()

  const subscriptionRef = useRef<Subscription | null>(null)

  // connect websocket when init
  useEffect(() => {
    connect({
      url: 'http://localhost/ws'
    })
  }, [])

  // subscribe topic when client connected
  useEffect(() => {
    if (!client || !client.connected) {
      return
    }

    subscribe({
      destination: 'destination',
      onMessage: message => {
      },
      onSubscribed: (subscription) => {
        subscriptionRef.current = subscription
      }
    })

    return ()=>{
      if(subscriptionRef.current){
        unsubscribe(subscriptionRef.current)
      }
      disconnect()
    }
  }, [client, client && client.connected])

  return (
    <div></div>
  )
}
```
