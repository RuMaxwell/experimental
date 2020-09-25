import { nameOf } from "./utils"

export type Ok<T> = <U>(method: (x: T) => U) => U
export type Err<E> = <U>(method: (e: E) => U) => U
export type Result<T, E> = Ok<T> | Err<E>

export function Ok<T>(x: T): Ok<T> {
  return function OkReceiver<U>(method: (x: T) => U) {
    return method(x)
  }
}

export function Err<E>(e: E): Err<E> {
  return function ErrReceiver<U>(method: (e: E) => U) {
    return method(e)
  }
}

export function isOk<T>(r: Result<T, any>): r is Ok<T> {
  return nameOf(r as Ok<T>) === 'OkReceiver'
}

export function isErr<E>(r: Result<any, E>): r is Err<E> {
  return nameOf(r as Err<E>) === 'ErrReceiver'
}

export class Unwrap<T, E> {
  result: Result<T, E>

  constructor(result: Result<T, E>) {
    this.result = result
  }

  unwrap(x: T): T
  unwrap(e: E): never
  unwrap(x: T | E): T {
    if (isOk(this.result)) {
      return (x as T)
    } else {
      throw 'unwrapping Err'
    }
  }
}
