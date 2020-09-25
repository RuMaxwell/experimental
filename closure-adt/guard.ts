class Guard<T> {
  private branches: { from: () => boolean, to: T }[]

  constructor() {
    this.branches = []
  }

  or(from: () => boolean, to: T): this {
    this.branches.push({ from, to })
    return this
  }

  test(): T {
    for (let i in this.branches) {
      const branch = this.branches[i]
      if (branch.from()) {
        return branch.to
      }
    }
    throw 'guard not exhausted'
  }
}

export function guard<T>(): Guard<T> {
  return new Guard()
}
