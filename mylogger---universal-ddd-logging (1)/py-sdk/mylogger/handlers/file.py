import json
from typing import List
from ..core.record import LogRecord
from ..core.interfaces import LogHandler

class FileHandler(LogHandler):
    def __init__(self, path: str):
        self.path = path

    def handle(self, record: LogRecord) -> None:
        with open(self.path, "a") as f:
            f.write(json.dumps(record.to_dict()) + "\n")

    def flush(self, batch: List[LogRecord]) -> None:
        with open(self.path, "a") as f:
            for record in batch:
                f.write(json.dumps(record.to_dict()) + "\n")
