const {Kafka} = require("kafkajs")

require('dotenv').config()

const brokers = [process.env.REDPANDA_BROKERS]
const mechanism = process.env.REDPANDA_SASL_MECHANISM
const username = process.env.REDPANDA_SASL_USERNAME
const password = process.env.REDPANDA_SASL_PASSWORD
const topic = process.env.TOPIC
const groupId = process.env.GROUP

const redpanda = new Kafka({
  brokers,
  ssl: {},
  sasl: {
    mechanism,
    username,
    password,
  }
})
const consumer = redpanda.consumer({ groupId })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({
    topic,
    fromBeginning: true
  })
  await consumer.run({
    eachMessage: async ({topic, partition, message}) => {
      const topicInfo = `topic: ${topic} (${partition}|${message.offset})`
      const messageInfo = `key: ${message.key}, value: ${message.value}`
      console.log(`Message consumed: ${topicInfo}, ${messageInfo}`)
    },
  })
}

run().catch(console.error)

process.once("SIGINT", async () => {
  try {
    await consumer.disconnect()
    console.log("Consumer disconnected")
  } finally {
    process.kill(process.pid, "SIGINT")
  }
})
