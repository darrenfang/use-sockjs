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
import { Client, Frame, Message, Subscription } from 'stompjs'

export interface ISubscribeOptions {
  destination: string
  onMessage?: (message: Message) => any
  onSubscribed?: (subscription: Subscription) => void
  headers?: {}
}

export interface IConnectOptions {
  url: string
  debug?: boolean
  headers?: object
  onError?: (error: Frame | string) => any
  heartbeat?: {
    incoming: number
    outgoing: number
  }
  onConnected?: (client: Client, frame?: Frame) => any
}

export interface ISockJsContext {
  connect: (options: IConnectOptions) => void
  disconnect: () => void
  subscribe: (options: ISubscribeOptions) => void
  unsubscribe: (subscription?: Subscription) => void
}

export const SockJsContext = React.createContext<ISockJsContext>({} as ISockJsContext)
