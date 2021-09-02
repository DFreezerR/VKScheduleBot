const bodyParser = require('body-parser')
const express = require('express')
const { Botact } = require('botact')

const app = express()
const bot = new Botact({
  confirmation: "58d11087",
  token: "cccd94bb8a38b201f49fc6324bb09e9dfc92ac8e1f002584cc9b523bf6399ca372f03ba04a10954bd6f86"
})

bot.addScene('wizard',
  ({ reply, scene: { next } }) => {
    next({ date: new Date() })
    reply('Write me something!')
  },
  ({ reply, body, session: { date }, scene: { leave } }) => {
    leave()
    reply(`You wrote: ${body} at ${date.toString()}`)
  }
)

bot.command([ 'join', 'scene' ], ({ scene: { join } }) => join('wizard'))
bot.hears([ 'first', 'two' ], ({ reply }) => reply('Numbers...'))
bot.on(({ reply }) => reply('What did you said?'))

app.use(bodyParser.json())
app.post('/', bot.listen)
app.listen(80)
