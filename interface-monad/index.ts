interface Show {
  show(): string
}

interface Monad<T> {
  bind<R>(andThen: (lastResult: T) => Monad<R>): Monad<R>
}

interface MonadConstructor {
  new<T>(value: T): Monad<T>
}
declare var Monad: MonadConstructor

type MonadTask = MonadBind | MonadRet

class MonadBind {
  bindName: string
  boundMonad: string

  constructor(binding: string) {
    if (~binding.indexOf('<-')) {
      [this.bindName, this.boundMonad] = binding.split('<-').map(x => x.trim())
    } else {
      this.bindName = ''
      this.boundMonad = binding
    }
  }
}

type MonadRet = string

function bind(binding: string): MonadBind {
  return new MonadBind(binding)
}

function ret(monad: string): MonadRet {
  return monad
}

function Do<T>(...tasks: MonadTask[]): Monad<T> {
  let s = ''
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i]
    if (task instanceof MonadBind) {
      s += `(${task.boundMonad}).bind(${task.bindName} =>\n`
    } else {
      s += task
    }
  }
  for (let i = 0; i < tasks.length; i++) {
    s += ')'
  }
  console.log(s)
  return eval(s)
}

class Result<T, E> implements Monad<T>, Show {
  value?: T
  error?: E

  static Ok<T>(value: T): Result<T, any> {
    let r = new Result<T, any>()
    r.value = value
    return r
  }

  static Err<E>(error: E): Result<any, E> {
    let r = new Result<any, E>()
    r.error = error
    return r
  }

  get isError(): boolean {
    return this.error !== undefined
  }

  unwrap(): T {
    if (this.isError) {
      throw new Error(`${this.error}`)
    }
    return this.value!
  }

  except(msg: string): T {
    if (this.isError) {
      throw new Error(msg)
    }
    return this.value!
  }

  bind<R>(andThen: (lastResult: T) => Monad<R>): Monad<R> {
    if (this.isError) {
      return Result.Err(this.error)
    }
    return andThen(this.value!)
  }

  static ret<T>(value: T): Result<T, any> {
    return Result.Ok(value)
  }

  show(): string {
    if (this.isError) {
      return `Err(${this.error})`
    }
    return `Ok(${this.value})`
  }
}

class Account implements Show {
  balance: number

  constructor() {
    this.balance = 0
  }

  update(balance: number): Result<this, string> {
    if (balance < 0) {
      return Result.Err('invalid balance')
    }
    this.balance = balance
    return Result.Ok(this)
  }

  add(amount: number): Result<this, string> {
    let rest = this.balance + amount
    if (rest < 0) {
      return Result.Err('invalid balance')
    }
    this.balance = rest
    return Result.Ok(this)
  }

  show(): string {
    return `Account(${this.balance})`
  }
}

class IO<T> implements Monad<T>, Show {
  value: T

  constructor(value: T) {
    this.value = value
  }

  bind<R>(andThen: (lastResult: T) => Monad<R>): Monad<R> {
    return andThen(this.value)
  }

  static ret<T>(value: T): IO<T> {
    return new IO(value)
  }

  show(): string {
    return `IO(${this.value})`
  }
}

function printIt(o: any): IO<void> {
  console.log(o.show())
  return IO.ret<void>(undefined)
}

(function Test() {
  let account = new Account().update(50)
    .bind(a => a.add(-20)
      .bind(a => a.add(10)
        .bind(a => a.add(-40)
          .bind(a => a.add(20))
        )
      )
    )

  Do(
    bind('a <- new Account().update(50)'),
    bind('a <- a.add(-20)'),
    bind('a <- a.add(10)'),
    bind('a <- a.add(-40)'),
    ret('a.add(20')
  )

  console.log(account.bind(a => printIt(a)))
})()
