const express = require("express")
const randomWord = require("random-words")
const XLSX = require('xlsx')
const bodyParser = require("body-parser")
const { Botact } = require("botact")
const app = express()
const bot = new Botact
({
    token: "cccd94bb8a38b201f49fc6324bb09e9dfc92ac8e1f002584cc9b523bf6399ca372f03ba04a10954bd6f86",
    confirmation: "58d11087"
})

let days = 
{
    0 : 'Понедельник',
    1 : 'Вторник',
    2 : 'Среда',
    3 : 'Четверг',
    4 : 'Пятница'
}

let random = (min, max) => 
{
    return Math.floor(Math.random() * (max - min + 1)) + min
}

let spreadsheets = XLSX.readFile('ИС,О,ТМ.xls')
let sheet_names = 'Речная'
let sheet_data = spreadsheets.Sheets[sheet_names]
let group_data = []
let true_schedule = {}
for(let day = 0; day < 5; day++)
{
    group_data.push([])
    for(let row = 7; row < 15; row++)
    {
        let lessonNo = row - 6
        if(sheet_data['P'+(row+10*day)])
        {
            if(sheet_data['Q'+(row+10*day)])
            {
                group_data[day].push(lessonNo+' para = '+sheet_data['P'+(row+10*day)].v.replace('\n', ' ')+' '+sheet_data['Q'+(row+10*day)].v)
            }
            else
            {
                group_data[day].push(lessonNo+' para = '+sheet_data['P'+(row+10*day)].v.replace('\n', ' '))
                
            }
        }
    }
}
for(let i = 0; i < group_data.length; i++)
{
    true_schedule[days[i]] = group_data[i]
}
let output_message = ''
for(let day in true_schedule)
{
    output_message += day+'\n'
    for(let para of true_schedule[day])
    {
        output_message += ': '+para+'\n'
    }
    output_message += '\n'
}

bot.on((ctx) => {
    ctx.sendMessage(ctx.message.from_id, output_message, 
    JSON.stringify({
        one_time: false,
        buttons: [[{
            action: {
                type: 'text',
                button: 'Hello, world!',
                payload: 'Hi'
            },
            color: 'positive'
        }]],
        inline: true
    }))
});

app.use(bodyParser.json())

app.post("/", bot.listen)
app.listen(80)

