
import { useEffect } from 'react'
import * as SockJS from 'sockjs-client'
import { Frame, over, Client, Message } from 'stompjs'

interface Options {
  url: string,
  topic: string,
  headers: object,
  subscribeHeaders: object,
  onMessage: (message: Message) => void,
  onError: (error: Frame | string) => void,
  debug?: boolean
}

export function useSockJs(options: Options) {
  const { url, topic, headers, subscribeHeaders, onMessage, onError, debug } = options

  let client: Client = {} as Client

  useEffect(() => {
    client = over(new SockJS(url))

    if (!debug) {
      client.debug = () => {
      }
    }

    client.connect(headers, () => {
      client.subscribe(topic, (msg: Message) => {
        onMessage(msg)
      }, subscribeHeaders)
    }, (error: Frame | string) => {
      onError(error)
    })

    return () => {
      client.unsubscribe(topic)
      client.disconnect(() => {
      })

    }
  }, [])

  return client
}
