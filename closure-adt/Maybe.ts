import { nameOf } from "./utils"

export type Nothing = <U>(method: () => U) => U
export type Just<T> = <U>(method: (x: T) => U) => U
export type Maybe<T> = Nothing | Just<T>

export function Nothing(): Nothing {
  return function NothingReceiver<U>(method: () => U) {
    return method()
  }
}

export function Just<T>(x: T): Just<T> {
  return function JustReceiver<U>(method: (x: T) => U) {
    return method(x)
  }
}

export function isNothing(m: Maybe<any>): m is Nothing {
  return nameOf(m as Nothing) === 'NothingReceiver'
}

export function isJust<T>(m: Maybe<T>): m is Just<T> {
  return nameOf(m as Just<T>) === 'JustReceiver'
}

export function unwrap<T>(x: T): T {
  return x
}
