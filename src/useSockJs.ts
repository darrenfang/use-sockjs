import {useEffect} from 'react'
import * as SockJS from 'sockjs-client'
import {Client, Frame, over} from 'stompjs'

interface Options {
  ready: boolean
  url: string
  headers?: object
  onConnected: (client: Client) => void
  onDisconnected?: () => void
  onError?: (error: Frame | string) => void
  debug?: boolean
}

export function useSockJs(options: Options) {
  const {ready, url, headers, onConnected, onError, debug, onDisconnected} = options

  useEffect(() => {
    if (!ready) {
      return
    }

    let client: Client = over(new SockJS(url))
    if (!debug) {
      client.debug = () => {
      }
    }

    client.connect(headers || {}, () => {
      onConnected(client)
    }, (error: Frame | string) => {
      if (onError) {
        onError(error)
      }
    })

    return () => {
      if (onDisconnected) {
        onDisconnected()
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
  }, [ready])
}
