These are example Javascript clients using Node.js v21.1.0 and KafkaJS v2.2.4.

## Steps

Follow these steps to create a SCRAM user/ACL, setup environment variables, and then run three different clients that create, produce to, and read from a topic:

1. Click the Security link from the Redpanda Cloud overview page for your cluster.
2. Click 'Create User' in the top right, enter a username and password (remember to save these details), and then click 'Create'.
3. Click 'Create ACLs' in the top right, enter your username, enter `*` for 'HOST', click 'Allow all operations', then click 'OK'.
4. Click the Overview link, then copy the second code block that contains values for setting environment variables in your terminal.
5. Paste the code block into your terminal, and then modify the mechanism, username and password values to match your previously created user (by default mechanism will be `SCRAM-SHA-256`).
6. Run `cp .env.example .env`, which copies the example file to a new `.env` file.
7. Modify the `.env` file to set appropriate names for your topic and consumer group.
8. Run `node admin` to create your topic.
9. Run `node producer` to write data to the same topic (press CTRL-C to end).
10. Run `node consumer` to read data from the topic (press CTRL-C to end).

