/*
 * MIT License
 *
 * Copyright (c) 2018 Darren Fang
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import * as React from 'react'
import {useRef, useState} from 'react'
import {IConnectOptions, ISockJsContext, ISubscribeOptions, SockJsContext} from './ISockJsContext'
import {Client, Frame, over, Subscription} from 'stompjs'
import * as SockJS from 'sockjs-client'

interface Props {
  onError?: (error: Frame | string) => any
}

export const SockJsProvider: React.FunctionComponent<Props>
  = ({
       onError: globalErrorHandler,
       children
     }) => {

  const clientRef = useRef<Client | null>(null)
  const [connected, setConnected] = useState(false)

  const subscribeHandler = ({headers, destination, onMessage, onSubscribed}: ISubscribeOptions) => {
    if (!clientRef.current) {
      return
    }

    const subscription = clientRef.current.subscribe(destination, onMessage, headers)
    if (onSubscribed) {
      onSubscribed(subscription)
    }
  }

  const unsubscribeHandler = (subscription: Subscription) => {
    if (clientRef.current && clientRef.current.connected) {
      if (subscription && subscription.id) {
        clientRef.current.unsubscribe(subscription.id)
      }
    }
  }

  const connectHandler = ({url, debug, headers, onError}: IConnectOptions) => {
    if (clientRef.current) {
      return
    }

    clientRef.current = over(new SockJS(url))

    if (!debug) {
      clientRef.current.debug = () => {
      }
    }

    clientRef.current.connect(headers || {}, () => {
      setConnected(true)
    }, onError || globalErrorHandler)
  }

  const disconnectHandler = () => {
    if (clientRef.current && clientRef.current.connected) {
      for (const subscription in clientRef.current.subscriptions) {
        clientRef.current.unsubscribe(subscription)
      }
      clientRef.current.disconnect(() => {
      })
    }
  }

  const provider: ISockJsContext = {
    client: clientRef.current,
    connect: connectHandler,
    disconnect: disconnectHandler,
    subscribe: subscribeHandler,
    unsubscribe: unsubscribeHandler
  }

  return (
    <SockJsContext.Provider value={provider}>
      {children}
    </SockJsContext.Provider>
  )
}
