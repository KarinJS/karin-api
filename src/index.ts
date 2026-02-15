import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { BASE_ROUTE } from '@/router'
import { prettyJSON } from 'hono/pretty-json'
import { requestId } from 'hono/request-id'
import Auth from '@/auth'

const app = new Hono()

app.use(requestId())
app.use(prettyJSON())


app.get(BASE_ROUTE, (c) => {
  return c.text('Hello Karin!')
})

app.route('/', Auth)

serve(
  {
    fetch: app.fetch,
    port: process.env.HTTP_PORT ? Number(process.env.HTTP_PORT) : 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
