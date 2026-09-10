require('dotenv').config();

const mqtt = require('mqtt');
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const port = process.env.WS_PORT || 8080;
const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://test.mosquitto.org';
const mqttTopic = process.env.MQTT_TOPIC || 'safenetq/telemetry';

const mqttOptions = {};
if (process.env.MQTT_USERNAME) mqttOptions.username = process.env.MQTT_USERNAME;
if (process.env.MQTT_PASSWORD) mqttOptions.password = process.env.MQTT_PASSWORD;

const mqttClient = mqtt.connect(brokerUrl, mqttOptions);

mqttClient.on('connect', () => {
    console.log(`Successfully connected to MQTT broker: ${brokerUrl}`);
    mqttClient.subscribe(mqttTopic, (err) => {
        if (err) {
            console.error('Failed to subscribe to topic:', err);
        } else {
            console.log(`Subscribed to topic: ${mqttTopic}`);
        }
    });
});

mqttClient.on('message', (topic, message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
        }
    });
});

mqttClient.on('error', (err) => {
    console.error('MQTT connection error:', err.message);
});

server.listen(port, () => {
    console.log(`Middleware WebSocket stream active on port ${port}.`);
});