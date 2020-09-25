interface I {
  x: number
  getX(): number
}
class A implements I {
  x: number = 0
  getX(): number { return this.x }
}
class B implements I {
  x: number = 1
  getX(): number { return this.x }
}
function getClass(c: 'A' | 'B'): typeof A | typeof B {
  const a = A
  const b = B
  return c === 'A' ? A : B
}
const x = new (getClass('A'))()
