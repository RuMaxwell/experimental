import { nameOf } from "./utils"

export type Empty = <U>(method: () => U) => U
export type Cons<T> = <U>(method: (x: T, xs: List<T>) => U) => U
export type List<T> = Empty | Cons<T>

export function Empty(): Empty {
  return function EmptyReceiver<U>(method: () => U) {
    return method()
  }
}

export function Cons<T>(x: T, xs: List<T>): Cons<T> {
  return function ConsReceiver<U>(method: (x: T, xs: List<T>) => U) {
    return method(x, xs)
  }
}

export function isCons<T>(xs: List<T>): xs is Cons<T> {
  return nameOf(xs as Cons<T>) === 'ConsReceiver'
}

export function head<T>(x: T, xs: List<T>): T {
  return x
}

export function tail<T>(x: T, xs: List<T>): List<T> {
  return xs
}

// export function index<T>(idx: number): (x: T, xs: List<T>) => T {
//   return (x: T, xs: List<T>) => {
//   }
// }

export function cat<T>(ys: List<T>) {
  function method(): typeof ys
  function method<T>(x: T, xs: List<T>): typeof ys
  function method(x?: T, xs?: List<T>): typeof ys {
    return (
      x === undefined || xs === undefined ? ys :
      !isCons(xs) ? Cons(x, ys) :
        Cons(x, xs(cat(ys)))
    )
  }

  return method
}
