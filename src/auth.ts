import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { AUTH_ROUTE } from '@/router'
import { HTTPException } from 'hono/http-exception'
import { make_state } from '@/utils'
import { getCookie, setCookie } from 'hono/cookie'
import type { TokenInfo } from '@/types'
import axios from 'axios'

const app = new Hono()

app.get(AUTH_ROUTE, async (c) => {
  if (getCookie(c, 'token')) {
    return c.json({
      message: 'Already logged in',
    })
  }
  const { client_id, client_secret } = env<{
    client_id: string | null
    client_secret: string | null
  }>(c)
  if (!client_id || !client_secret) {
    const res = c.json({
      message: 'Missing client_id or client_secret',
    })
    throw new HTTPException(500, {
      res,
    })
  }
  const code = c.req.query('code')
  if (!code) {
    if (!getCookie(c, 'state')) {
      const state = make_state()
      setCookie(c, 'state', state, {
        maxAge: 60 * 10,
        httpOnly: false,
        path: '/',
      })
    }
    const urlParams = new URLSearchParams({
      client_id,
      state: getCookie(c, 'state')!,
      scope: 'public_repo read:user',
      redirect_uri: c.req.url,
    })
    const url = `https://github.com/login/oauth/authorize?${urlParams.toString()}`
    return c.redirect(url)
  }
  const state = c.req.query('state')
  if (state) {
    const ck_state = getCookie(c, 'state')
    if (ck_state !== state) {
      const response = c.json({ error: 'Unauthorized' })
      throw new HTTPException(401, { res: response })
    }
  }
  const token = await getTokenFromCode(client_id, client_secret, code)
  if (!token) {
    const res = c.json({ error: 'Internal Server Error' })
    throw new HTTPException(500, { res })
  }
  setCookie(c, 'token', token.access_token)
  return c.json({ message: 'success' })
})

const getTokenFromCode = async (
  client_id: string,
  client_secret: string,
  code: string,
): Promise<TokenInfo | null> => {
  if (!client_id || !client_secret || !code) {
    return null
  }
  const response = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: client_id,
      client_secret: client_secret,
      code: code,
    },
  )
  if ('error_description' in response) {
    const res = new Response(
      JSON.stringify({ message: response.error_description }),
      { status: 400 },
    )
    throw new HTTPException(400, { res })
  }
  if ('access_token' in response) {
    return {
      access_token: response.data.access_token,
      token_type: response.data.token_type,
    }
  }
  return null
}

export default app
