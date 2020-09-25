import { Maybe, Just, Nothing } from './Maybe'

export type Account = <U>(method: (balance: number) => U) => U

export function Account(balance: number) {
  return function AccountReceiver<U>(method: (balance: number) => U) {
    return method(balance)
  }
}

export function updateBalance(amount: number): (balance: number) => Maybe<Account> {
  return (_: number) => amount >= 0 ? Just(Account(amount)) : Nothing()
}

export function addBalance(amount: number): (balance: number) => Maybe<Account> {
  return (balance: number) => balance + amount >= 0 ? Just(Account(balance + amount)) : Nothing()
}
