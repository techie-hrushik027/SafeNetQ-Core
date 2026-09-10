# SafeNetQ-Core

SafeNetQ is an IoT edge protection system for power distribution networks. It monitors electrical line conditions, detects high-impedance faults, and displays real-time operational status through a live dashboard.

## What has been implemented so far

- A React dashboard for live viewing of power-line health
- Geo-based network map showing device locations
- Device management features for adding and removing nodes
- Real-time analog-style views for voltage, current, THD, and fault states
- Simulated telemetry generation for 40+ power nodes
- Fault-status detection and visual red/green indicators
- MQTT/WebSocket middleware for streaming telemetry from edge devices to the frontend
- JSON telemetry contract describing expected payload fields

## Tech stack

- Frontend: React + Chart.js + Leaflet
- Backend: Node.js + MQTT + WebSocket
- Messaging: MQTT topic streaming
- Data model: JSON telemetry payloads and fault inference schema

## Project structure

- `frontend/` - React dashboard and UI
- `server.js` - WebSocket/MQTT bridge
- `api-contract.json` - telemetry and device contract example
- `.env` - local environment configuration for the backend
- `README.md` - setup instructions

## Prerequisites

Install the following before running the project:

- Node.js 18+
- npm
- Git

## Local setup

### 1) Clone the project

```bash
git clone <your-repo-url>
cd SafeNetQ-Core-main
```

### 2) Install backend dependencies

```bash
npm install
```

### 3) Set up environment variables

Create a `.env` file in the project root with the following values:

```env
MQTT_BROKER_URL=mqtt://test.mosquitto.org
MQTT_TOPIC=safenetq/telemetry
MQTT_USERNAME=
MQTT_PASSWORD=
WS_PORT=8080
```

If you are using a private broker such as HiveMQ, replace the broker URL and credentials:

```env
MQTT_BROKER_URL=mqtts://your-hivemq-host:8883
MQTT_TOPIC=safenetq/telemetry
MQTT_USERNAME=your-username
MQTT_PASSWORD=your-password
WS_PORT=8080
```

### 4) Start the backend middleware

```bash
node server.js
```

You should see:

```text
Middleware WebSocket stream active on port 8080.
```

### 5) Start the frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## Notes

- The frontend can run with simulated telemetry without any MQTT broker.
- The backend is useful when you want to receive real MQTT device data.
- If you do not have a real broker, the default public test broker is used.

## Git, forks, and branches

### Branch
A branch is a separate line of work in the same repository. It lets you develop a feature without affecting the main version of the project.

Example:

```bash
git checkout -b what-have-been-implement
```

### Fork
A fork is your own copy of someone else's GitHub repository. It lives under your GitHub account and lets you make changes without affecting the original project.

Example flow:

1. Fork the repo on GitHub.
2. Clone your fork.
3. Create a feature branch.
4. Commit changes.
5. Push to your fork.
6. Open a pull request to the original repo.

## Resume-ready project summary

SafeNetQ-Core is a power-grid monitoring and fault-detection project built around a live operational dashboard for electrical infrastructure. The system visualizes distributed feeder nodes, simulates telemetry for voltage/current behavior, identifies fault conditions, and provides a Node Manager interface for deployment and device lifecycle control. A Node.js MQTT/WebSocket bridge connects edge telemetry with the frontend, demonstrating a real-time industrial monitoring workflow suitable for smart-grid and IoT monitoring use cases.

## Future enhancements

- ESP32 hardware integration
- Machine learning-based fault classification
- Relay trip logic with fail-safe automation
- Database storage for telemetry history
- Authentication and admin panels
- Cloud deployment and dashboard scaling

## License

This project is currently for educational and prototype use.
