# use-sockjs

![Node.js Package](https://github.com/darrenfang/use-sockjs/workflows/Node.js%20Package/badge.svg)

React Hook for SockJs

## Usage

```shell
yarn add use-sockjs
```

```javascript
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
