import { createHash, randomBytes } from 'node:crypto'
export const make_state = () => {
  const state = randomBytes(16).toString('hex')
  const ts = Date.now().toString()
  return createHash('sha256').update(state).update(ts).digest('hex')
}
