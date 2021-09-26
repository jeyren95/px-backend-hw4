require("dotenv").config()
const express = require("express")
const enableWs = require("express-ws")
const app = express()
const logger = require("morgan")
const cron = require("node-cron")

app.use(logger("common"))
enableWs(app)


app.ws("/heartbeat", (ws, req) => {
    // cron syntax => sec (optional), min, hour, day of month (1-31), month (use 1-12 or names), day of week (use names, or 0-7 where 0 or 7 = sunday)

    // send message every minute
    cron.schedule("* * * * *", () => {
        let date = new Date()
        ws.send(`I'm alive on ${date.toDateString()}, ${date.toTimeString()}`)
    })

    // send message every 42nd minute of the hour
    cron.schedule("42 * * * *", () => {
        ws.send("42 is the meaning to life!")
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})