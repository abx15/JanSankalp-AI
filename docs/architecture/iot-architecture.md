# IoT & Satellite Predictive Infrastructure Monitoring

## Architecture & Connection Guide

This document describes how all IoT, Satellite, and Vision services connect to the JanSankalp AI Engine.

---

## System Architecture

```
                       ┌──────────────────────────────────────────────────────────────┐
                       │              JanSankalp AI Engine (FastAPI)                  │
  ┌──────────────┐     │  ┌──────────────────┐   ┌────────────────┐                  │
  │ Water Sensor │────▶│  │ IoT Ingestion    │   │ Vision Service │                  │
  │ Air Sensor   │────▶│  │ /iot/ingest      │   │ /vision/analyze│                  │
  │ Smart Meter  │────▶│  └────────┬─────────┘   └───────┬────────┘                  │
  └──────────────┘     │           │                      │                           │
                       │           ▼                      ▼                           │
  ┌──────────────┐     │   ┌──────────────────────────────────────────────────────┐  │
  │ Satellite    │────▶│   │             Apache Kafka Streaming                   │  │
  │ CCTV Feeds   │────▶│   │  Topics: sensor_telemetry | vision_event             │  │
  └──────────────┘     │   └────────────────────────┬─────────────────────────────┘  │
                       │                            │                                 │
                       │              ┌─────────────▼─────────────────┐              │
                       │              │   stream_processor.py          │              │
                       │              │  - Flood Risk Evaluation       │              │
                       │              │  - Auto-Escalation Logic       │              │
                       │              │  - Predictive Risk Engine      │              │
                       │              └──────────────┬────────────────┘              │
                       │                             │                                │
                       │              ┌──────────────▼────────────────┐              │
                       │              │  Risk Engine                  │              │
                       │              │  /analytics/infrastructure     │              │
                       │              └───────────────────────────────┘              │
                       └──────────────────────────────────────────────────────────────┘
                                              │
                                              ▼
                         ┌──────────────────────────────────────────────────────┐
                         │             Next.js Admin Dashboard                  │
                         │         InfraDashboard.tsx                           │
                         │  • Live Risk Heatmap  • Sensor Status               │
                         │  • Flood Alerts       • Maintenance Suggestions      │
                         └──────────────────────────────────────────────────────┘
```

---

## API Endpoints

| Method | Endpoint                    | Description                               |
| ------ | --------------------------- | ----------------------------------------- |
| `POST` | `/iot/ingest`               | Ingest data from a physical sensor        |
| `POST` | `/vision/analyze`           | Run CV model on CCTV or Satellite image   |
| `GET`  | `/analytics/infrastructure` | Get live infrastructure health & risk map |

### Sensor Ingestion Example

```bash
curl -X POST "http://localhost:10000/iot/ingest" \
  -H "Content-Type: application/json" \
  -d '{"sensor_id": "WL-001", "sensor_type": "water_level", "value": 4.8, "unit": "meters", "lat": 12.97, "lng": 77.59}'
```

### Vision Analysis Example

```bash
curl -X POST "http://localhost:10000/vision/analyze" \
  -H "Content-Type: application/json" \
  -d '{"source_type": "SATELLITE", "image_url": "https://...", "lat": 12.97, "lng": 77.59}'
```

---

## Kafka Topics

| Topic              | Producer              | Consumer              | Description          |
| ------------------ | --------------------- | --------------------- | -------------------- |
| `sensor_telemetry` | `iot_service.py`      | `stream_processor.py` | Raw sensor readings  |
| `vision_event`     | `vision_service.py`   | `stream_processor.py` | CV detection results |
| `system_alert`     | `stream_processor.py` | Next.js via Webhook   | Flood/Power alerts   |

---

## AI Models

| Model                  | Technology                | Task                                         |
| ---------------------- | ------------------------- | -------------------------------------------- |
| Pothole Detector       | HuggingFace Vision (BLIP) | Road damage from satellite tiles             |
| Garbage Overflow       | Custom YOLO               | CCTV garbage bin fill-level                  |
| Streetlight Failure    | Anomaly Detection         | Brightness threshold analysis                |
| Flood Risk Predictor   | Weighted ML Model         | Water level + rainfall forecast → risk score |
| Power Outage Clusterer | Geospatial Clustering     | Smart meter anomaly mapping                  |

---

## Environment Variables

Add to `ai-engine/.env`:

```env
# Sensor Configs
IOT_BRIDGE_URL=http://localhost:8080   # Your IoT gateway (MQTT/HTTP bridge)
SATELLITE_API_KEY=your_key_here       # Planet.com or Google Earth API
CCTV_STREAM_URL=rtsp://camera-ip:554  # Optional RTSP feed

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
```

Add to `.env.local` (Next.js):

```env
NEXT_PUBLIC_AI_ENGINE_URL=http://localhost:10000
```

---

## Sensor Data Format

All sensors should POST data in this JSON contract:

```json
{
  "sensor_id": "WL-001",
  "sensor_type": "water_level | air_quality | smart_meter",
  "value": 4.2,
  "unit": "meters | AQI | kWh",
  "lat": 12.9716,
  "lng": 77.5946,
  "timestamp": "2026-02-21T10:00:00Z"
}
```
