import os
import json
import asyncio
import logging
from aiokafka import AIOKafkaProducer, AIOKafkaConsumer

logger = logging.getLogger("ai-engine")

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

class KafkaClient:
    def __init__(self):
        self.producer = None
        self.loop = asyncio.get_event_loop()

    async def start_producer(self):
        self.producer = AIOKafkaProducer(
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        await self.producer.start()
        logger.info("Kafka Producer started")

    async def stop_producer(self):
        if self.producer:
            await self.producer.stop()
            logger.info("Kafka Producer stopped")

    async def emit_event(self, topic: str, data: dict):
        if not self.producer:
            await self.start_producer()
        try:
            await self.producer.send_and_wait(topic, data)
            logger.info(f"Event emitted to topic {topic}")
        except Exception as e:
            logger.error(f"Failed to emit event: {e}")

    async def consume_events(self, topics: list, handler_func):
        consumer = AIOKafkaConsumer(
            *topics,
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            group_id="ai-engine-group",
            value_deserializer=lambda m: json.loads(m.decode('utf-8'))
        )
        await consumer.start()
        logger.info(f"Kafka Consumer started for topics: {topics}")
        try:
            async for msg in consumer:
                logger.info(f"Received message on topic {msg.topic}")
                await handler_func(msg.topic, msg.value)
        finally:
            await consumer.stop()

kafka_client = KafkaClient()
