# SafeNetQ-Core

<p align="center">
  <img src="https://img.shields.io/badge/Power%20Grid-AI%20Monitoring-0A66C2?style=for-the-badge&logo=bolt&logoColor=white" alt="Power Grid AI Monitoring" />
  <img src="https://img.shields.io/badge/IoT-Smart%20Protection-16A34A?style=for-the-badge&logo=server&logoColor=white" alt="Smart Protection" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MQTT-3C7DF7?style=for-the-badge&logo=apachekafka&logoColor=white" alt="MQTT" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js" />
</p>

<p align="center">
  <b>Real-time fault detection and monitoring for modern power distribution systems</b>
</p>

SafeNetQ-Core is an IoT-driven smart-grid protection system focused on detecting high-impedance faults (HIF) in electrical networks. The project combines live telemetry, cloud-connected MQTT messaging, and an operator dashboard to monitor device health, fault status, and power-line conditions in real time.

## Overview

SafeNetQ monitors parameters such as voltage, current, THD, peak current, and fault state across distributed feeder nodes. It provides a command-center dashboard where operators can:

- visualize device health across a live geographic network
- inspect analog-style electrical metrics
- identify fault conditions instantly
- add or remove devices from the managed network
- stream telemetry from IoT devices through a resilient broker pipeline

## System Architecture

```mermaid
flowchart LR
    A[ESP32 / Edge Device] --> B[MQTT Broker]
    B --> C[Node.js WebSocket Bridge]
    C --> D[React Dashboard]
    D --> E[Operator / Monitoring Console]
    D --> F[Geo Network + Analytics]
```

## Current Implementation Status

### Completed

- Live dashboard interface for power-system monitoring
- Device cards and status panels for grid nodes
- Geographic map view for feeder and substation simulated locations
- Real-time simulated telemetry for voltage and current
- Fault detection highlighting with red/green operational state
- Node management features to add and remove devices
- MQTT/WebSocket middleware for streaming telemetry
- JSON telemetry contract for payload structure and fault state expectations

### In Progress / Planned

- ESP32 hardware integration and live field data acquisition
- Real machine-learning-based fault classification
- Automated relay trip logic and interlock handling
- Persistent database storage for historical events
- Authentication and role-based access control
- Cloud deployment and remote observability

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Chart.js, Leaflet |
| Backend | Node.js |
| Messaging | MQTT, WebSocket |
| Data Model | JSON telemetry payloads |
| Monitoring | Real-time status dashboards |

## Project Structure

```text
SafeNetQ-Core/
├── frontend/              # React dashboard application
│   ├── public/
│   └── src/
├── server.js              # MQTT + WebSocket bridge
├── api-contract.json      # Telemetry and inference schema
├── .env                   # Local environment variables
├── package.json           # Backend dependencies
├── README.md              # Project documentation
└── .gitignore
```

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 18+
- npm
- Git

## Local Setup

### 1) Clone the repository

```bash
git clone https://github.com/techie-hrushik027/SafeNetQ-Core.git
cd SafeNetQ-Core
```

### 2) Install backend dependencies

```bash
npm install
```

### 3) Configure environment variables

Create a `.env` file in the project root:

```env
MQTT_BROKER_URL=mqtt://test.mosquitto.org
MQTT_TOPIC=safenetq/telemetry
MQTT_USERNAME=
MQTT_PASSWORD=
WS_PORT=8080
```

If using a private broker, replace with your actual credentials:

```env
MQTT_BROKER_URL=mqtts://your-hivemq-host:8883
MQTT_TOPIC=safenetq/telemetry
MQTT_USERNAME=your-username
MQTT_PASSWORD=your-password
WS_PORT=8080
```

### 4) Start the middleware server

```bash
node server.js
```

### 5) Start the frontend

```bash
cd frontend
npm install
npm start
```

Open the app at:

```text
http://localhost:3000
```

## Use Cases

- Smart-substation monitoring
- Feeder line fault detection
- Power distribution visualization
- Industrial IoT dashboarding for utilities
- Edge AI and predictive maintenance workflows

## Resume-Friendly Project Summary

SafeNetQ-Core is a power-grid monitoring and fault-detection project built around a live operator dashboard for electrical infrastructure. It simulates distributed line nodes, visualizes voltage/current behavior, highlights fault conditions, and provides a Node.js MQTT/WebSocket bridge for real-time telemetry streaming. The project demonstrates a practical smart-grid monitoring workflow suitable for IoT-based power protection systems, utilities, and energy analytics applications.

## Roadmap

1. Hardware integration with ESP32 edge devices
2. Machine learning model for HIF classification
3. Relay automation and trip logic
4. Historical logs and analytics database
5. Secure industrial deployment and cloud monitoring

## License

This repository is currently intended for educational, prototype, and research-oriented development.

---

<p align="center">
  <i>Built for resilient, intelligent, and real-time power infrastructure monitoring.</i>
</p>

