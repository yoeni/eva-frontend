import { createContext, useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { config } from './config'
import { getCookie } from './cookies'

export const WebsocketContext = createContext({
  isReady: false,
  socket: null as unknown as Socket,
})

const backendWs = config.socket_url;

export const WebsocketProvider = ({ children }: any) => {
  const [isReady, setIsReady] = useState(false)

  const ws = useRef(null as unknown as Socket)
  // @ts-ignore
  useEffect(() => {
    const token = getCookie('token') || '';
    ws.current = io(backendWs, {
      reconnectionDelay: 5000,
      transports: ['websocket'],
      auth: {
        token: token ,
      },
      extraHeaders: { token: token}
    })
    ws.current.on('connect', () => {
      console.log('socket connected')
      setIsReady(true)
    })
    ws.current.on('disconnect', (reason: string, description: any) => {
      console.log(`socket disconnected: ${reason}`, description)
      setIsReady(false)
    })
    ws.current.on('connect_error', (reason: any) => {
      console.log(`socket connect_error: ${reason}`)
    })

    return () => ws.current.close()
  }, [])

  const returnValue = { isReady, socket: ws.current }

  return <WebsocketContext.Provider value={returnValue}>{children}</WebsocketContext.Provider>
}
