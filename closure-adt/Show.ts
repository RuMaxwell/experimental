import * as Maybe from './Maybe'
import * as Account from './Account'
import { guard } from './guard'
import { nameOf } from './utils'

export type Show = any

export function show(x: Show): string {
  return guard<string>()
    .or(() => Maybe.isNothing(x), 'Nothing')
    .or(() => Maybe.isJust(x), (x as Maybe.Just<any>)(x => `Just(${x})`))
    .or(() => nameOf(x as Account.Account) === 'AccountReceiver', (x as Account.Account)(b => `Account(${b})`))
    .test()
}
