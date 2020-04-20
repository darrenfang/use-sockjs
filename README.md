# use-sockjs

![Node.js Package](https://github.com/darrenfang/use-sockjs/workflows/Node.js%20Package/badge.svg)
[![NPM](https://img.shields.io/npm/l/use-sockjs)](https://www.npmjs.com/package/use-sockjs)
[![NPM](https://img.shields.io/npm/v/use-sockjs)](https://www.npmjs.com/package/use-sockjs)

React Hook for SockJs

## Usage

```shell
yarn add use-sockjs
```

```typescript
import { useSockJs } from 'use-sockjs'
import { Frame, Message } from 'stompjs'

useSockJs({
  url: `http://localhost:8080/websocket`,
  topic: '/user/queue/messages',
  headers: {},
  subscribeHeaders: {},
  onMessage: (message: Message) => {},
  onError: (error: Frame | string) => {},
  debug: true
})
```
