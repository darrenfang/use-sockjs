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
import { useRef } from 'react'
import { ISockJsContext, ISubscribeOptions, SockJsContext } from './ISockJsContext'
import { Client, Frame, over, Subscription } from 'stompjs'
import * as SockJS from 'sockjs-client'

interface Props {
  url: string
  debug?: boolean
  onError?: (error: Frame | string) => any
}

export const SockJsProvider: React.FunctionComponent<Props>
  = ({
       url,
       debug,
       onError: globalOnError,
       children
     }) => {

  const clientRef = useRef<Client | null>(null)

  const subscribeHandler = ({ headers, destination, onMessage, onSubscribed, onError }: ISubscribeOptions): Client => {
    const client = over(new SockJS(url))
    clientRef.current = client

    if (!debug) {
      clientRef.current.debug = () => {
      }
    }

    clientRef.current.connect(headers || {}, () => {
      const subscription = client.subscribe(destination, onMessage, headers)
      if (onSubscribed) {
        onSubscribed(subscription)
      }
    }, onError || globalOnError)
    return client
  }

  const unsubscribeHandler = (subscription?: Subscription) => {
    if (clientRef.current && clientRef.current.connected) {
      if (subscription && subscription.id) {
        clientRef.current.unsubscribe(subscription.id)
      } else {
        for (const sub in clientRef.current.subscriptions) {
          clientRef.current.unsubscribe(sub)
        }
      }

      if (Object.keys(clientRef.current.subscriptions).length === 0) {
        clientRef.current.disconnect(() => {
        })
      }
    }
  }

  const provider: ISockJsContext = {
    subscribe: subscribeHandler,
    unsubscribe: unsubscribeHandler
  }

  return (
    <SockJsContext.Provider value={provider}>
      {children}
    </SockJsContext.Provider>
  )
}
