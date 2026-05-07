import time
from collections import OrderedDict
from typing import Any, Optional

class TTLCache:
    def __init__(self, maxsize: int = 500, default_ttl: int = 600):
        self.maxsize = maxsize
        self.default_ttl = default_ttl
        self.cache = OrderedDict()

    def get(self, key: str) -> Optional[Any]:
        if key not in self.cache:
            return None
        
        value, expiry = self.cache[key]
        if time.time() > expiry:
            del self.cache[key]
            return None
        
        # Move to end (LRU)
        self.cache.move_to_end(key)
        return value

    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        if len(self.cache) >= self.maxsize:
            self.cache.popitem(last=False)
        
        expiry = time.time() + (ttl if ttl is not None else self.default_ttl)
        self.cache[key] = (value, expiry)
        self.cache.move_to_end(key)

    def delete(self, key: str):
        if key in self.cache:
            del self.cache[key]

    def clear(self):
        self.cache.clear()

# Global instances for different purposes
repo_tree_cache = TTLCache(maxsize=100, default_ttl=600)  # 10 min
analysis_cache = TTLCache(maxsize=1000, default_ttl=1800) # 30 min
