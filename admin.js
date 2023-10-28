const {Kafka} = require("kafkajs")

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
const admin = redpanda.admin()

admin.connect().then(() => {
  admin.createTopics({
    topics: [{
      topic,
      numPartitions: 1,
      replicationFactor: -1
    }]
  })
  .then(resp => {
    resp ? console.log("Created topic") :
      console.log("Failed to create topic")
  })
  .finally(() => admin.disconnect())
})

