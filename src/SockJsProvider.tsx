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
import { ISockJsContext, ISubscribeOptions, SockJsContext } from './ISockJsContext'
import { Client, Frame, over, Subscription } from 'stompjs'
import * as SockJS from 'sockjs-client'

interface Props {
  url: string
  debug?: boolean
  onError?: (error: Frame | string) => void
}

export const SockJsProvider: React.FunctionComponent<Props>
  = ({
       url,
       debug,
       onError,
       children
     }) => {

  const disconnectHandler = (client: Client) => {
    if (!client) {
      return
    }

    if (client.connected) {
      const subscriptions = client.subscriptions
      for (const subscription in subscriptions) {
        client.unsubscribe(subscription)
      }
      client.disconnect(() => {
      })
    }
  }

  const subscribeHandler = ({ headers, destination, onMessage, onSubscribed }: ISubscribeOptions): Client => {
    const client = over(new SockJS(url))
    if (!debug) {
      client.debug = () => {
      }
    }

    client.connect(headers || {}, () => {
        if (!client) {
          return
        }

        const subscription = client.subscribe(destination, onMessage, headers)
        if (onSubscribed) {
          onSubscribed(subscription)
        }
      },
      error => {
        if (onError) {
          onError(error)
        }
      })
    return client
  }

  const unsubscribeHandler = (client: Client, subscription: Subscription) => {
    if (!client) {
      return
    }

    if (client.connected && subscription.id) {
      client.unsubscribe(subscription.id)

      if (Object.keys(client.subscriptions).length === 0) {
        disconnectHandler(client)
      }
    }
  }

  const provider: ISockJsContext = {
    subscribe: subscribeHandler,
    unsubscribe: unsubscribeHandler,
    disconnect: disconnectHandler
  }

  return (
    <SockJsContext.Provider value={provider}>
      {children}
    </SockJsContext.Provider>
  )
}
