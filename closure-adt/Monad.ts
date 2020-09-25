import { guard } from './guard'
import * as Maybe from './Maybe'
import * as Result from './Result'

export type Monad<A> = Maybe.Maybe<A> | Result.Result<A, any>

export function bind<A, B>(maybe: Maybe.Maybe<A>, andThen: (feed: A) => Maybe.Maybe<B>): Maybe.Maybe<B>
export function bind<A, B>(result: Result.Result<A, any>, andThen: (feed: A) => Result.Result<B, any>): Result.Result<B, any>
export function bind<A, B>(monad: Monad<A>, andThen: (feed: A) => Monad<B>): Monad<B> {
  return guard<Monad<B>>()
    .or(() => Maybe.isNothing(monad), (monad as Maybe.Nothing)(() => Maybe.Nothing()))
    .or(() => Maybe.isJust(monad), (monad as Maybe.Just<A>)(x => andThen(x)))
    .or(() => Result.isOk(monad as Result.Result<A, any>), (monad as Result.Ok<A>)(x => andThen(x)))
    .or(() => Result.isErr(monad as Result.Result<A, any>), (monad as Result.Err<any>)(e => Result.Err(e)))
    .test()
}
