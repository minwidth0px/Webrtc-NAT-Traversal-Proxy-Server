import { Type } from '@sidewinder/contract'

export const SmokeMessage = Type.Object({
  from: Type.Optional(Type.String()),
  to: Type.String(),
  data: Type.Unknown()
})
export const SmokeContract = Type.Contract({
  server: {
    /** Gets WebRTC configuration information for the client */
    configuration: Type.Function([], Type.Unsafe<RTCConfiguration>(Type.Unknown())),
    /** Gets a clients address */
    address: Type.Function([], Type.String()),
    /** Relays a message to a remote client */
    send: Type.Function([SmokeMessage], Type.Unknown())
  },
  client: {
    /** Forwarded message function implemented on the client */
    receive: Type.Function([SmokeMessage], Type.Unknown())
  }
})