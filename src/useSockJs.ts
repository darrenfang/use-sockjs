import { useContext } from 'react'
import { SockJsContext } from "./ISockJsContext";

export const useSockJs = () => {
  return useContext(SockJsContext)
}
