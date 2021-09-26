const amqplib = require("amqplib");
const fs = require("fs")
const queue = "heartbeat";

(async () => {
    // connect to rabbitmq
    const client = await amqplib.connect("amqp://localhost:5672")

    // create channel to communicate with rabbitmq 
    const channel = await client.createChannel()

    // declare queue 
    await channel.assertQueue(queue)

    // consume message
    channel.consume(queue, (message) => {
        try {
            const contents = message.content.toString() 
            console.log(contents)
            fs.appendFile("log.txt", contents + "\n", (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Appended message to file!")
                }
            })

            channel.ack(message)
    
        } catch(err) {
            console.log(err);
            channel.dack(message)
        }
    })
})()