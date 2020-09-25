import { Maybe, Nothing } from './Maybe'
import { Account, updateBalance, addBalance } from './Account'
import { bind } from './Monad'
import { show } from './Show'

function Test() {
  const account: Maybe<Account> =
    bind(Account(0)(updateBalance(100)), (x) =>
    bind(x(addBalance(-50)), (x) =>
    bind(x(addBalance(30)), (x) =>
    bind(x(addBalance(-90)), (x) =>
    bind(x(addBalance(20)), (x) => x
    )))))

  console.log(show(account))
}

Test()
