"""Hardware helpers for Arduino / sensor / robot challenges: serial + MQTT + a fake source for demos."""
import json
import random
import time
from typing import Callable, Iterator

from .. import config


def read_serial(port: str | None = None, baud: int = 115200) -> Iterator[str]:
    """Yield lines from an Arduino UNO Q / any serial device."""
    import serial

    with serial.Serial(port or config.SERIAL_PORT, baud, timeout=1) as ser:
        while True:
            line = ser.readline().decode(errors="ignore").strip()
            if line:
                yield line


def mqtt_subscribe(topic: str, on_message: Callable[[str, dict], None]) -> None:
    import paho.mqtt.client as mqtt

    def _on_msg(_c, _u, msg):
        try:
            payload = json.loads(msg.payload.decode())
        except Exception:
            payload = {"raw": msg.payload.decode(errors="ignore")}
        on_message(msg.topic, payload)

    c = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    c.on_message = _on_msg
    c.connect(config.MQTT_HOST, config.MQTT_PORT)
    c.subscribe(topic)
    c.loop_forever()


def mqtt_publish(topic: str, payload: dict) -> None:
    import paho.mqtt.publish as publish

    publish.single(topic, json.dumps(payload), hostname=config.MQTT_HOST, port=config.MQTT_PORT)


def fake_sensor(n: int = 0, hz: float = 5.0) -> Iterator[dict]:
    """Simulated sensor stream (with occasional spikes) so the demo works without hardware."""
    i = 0
    while n == 0 or i < n:
        spike = 8 if random.random() < 0.03 else 0
        yield {"t": time.time(), "value": 20 + random.gauss(0, 0.5) + spike}
        i += 1
        time.sleep(1 / hz)
