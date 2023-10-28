const os = require("os")
const {Kafka, CompressionTypes} = require("kafkajs")

require('dotenv').config()

const brokers = [process.env.REDPANDA_BROKERS]
const mechanism = process.env.REDPANDA_SASL_MECHANISM
const username = process.env.REDPANDA_SASL_USERNAME
const password = process.env.REDPANDA_SASL_PASSWORD
const topic = process.env.TOPIC

const redpanda = new Kafka({
  brokers,
  ssl: {},
  sasl: {
    mechanism,
    username,
    password,
  }
})
const producer = redpanda.producer()

const sendMessage = (msg) => {
  return producer.send({
    topic,
    compression: CompressionTypes.GZIP,
    messages: [{
      // Messages with the same key are sent to the same topic partition for
      // guaranteed ordering
      key: os.hostname(),
      value: JSON.stringify(msg)
    }]
  })
  .catch(e => {
    console.error(`Unable to send message: ${e.message}`, e)
  })
}

const run = async () => {
  await producer.connect()
  for (let i = 0; i < 100; i++) {
    sendMessage(`message ${i}`).then((resp) => {
      console.log(`Message sent: ${JSON.stringify(resp)}`)
    })
  }
}

run().catch(console.error)

process.once("SIGINT", async () => {
  try {
    await producer.disconnect()
    console.log("Producer disconnected")
  } finally {
    process.kill(process.pid, "SIGINT")
  }
})
