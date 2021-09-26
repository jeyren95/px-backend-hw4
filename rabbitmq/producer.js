const amqplib = require("amqplib");
const cron = require("node-cron");

const queue = "heartbeat";

(async () => {
    // connect to rabbitmq
    const client = await amqplib.connect("amqp://localhost:5672")

    // create channel to communicate with rabbitmq
    const channel = await client.createChannel()

    // declare a queue
    await channel.assertQueue(queue)

    // send messages to queue via the channel 
    cron.schedule("* * * * *", () => {
        let date = new Date()
        let message = `I'm alive on ${date.toDateString()}, ${date.toTimeString()}`

        channel.sendToQueue(queue, Buffer.from(message))
    })

    cron.schedule("42 * * * *", () => {
        let message = "42 is the meaning to life!"
        channel.sendToQueue(queue, Buffer.from(message))
    })


})()