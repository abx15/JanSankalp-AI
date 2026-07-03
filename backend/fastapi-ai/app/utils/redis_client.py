import os
import json
import redis
import logging

logger = logging.getLogger("ai-engine.redis")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Create connection pool
try:
    redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
    logger.info(f"[Redis] Connected successfully to Redis server at {REDIS_URL}")
except Exception as e:
    logger.error(f"[Redis] Connection to Redis failed: {e}")
    redis_client = None

def publish_event(channel: str, event: str, payload: dict):
    if redis_client is None:
        logger.warning(f"[Redis] Cannot publish event. Client is not connected.")
        return False
    try:
        data = json.dumps({
            "channel": channel,
            "event": event,
            "payload": payload
        })
        redis_client.publish("realtime-events", data)
        logger.info(f"[Redis Pub] Published event '{event}' to channel '{channel}' via Redis pub/sub")
        return True
    except Exception as e:
        logger.error(f"[Redis Pub] Failed to publish event: {e}")
        return False
