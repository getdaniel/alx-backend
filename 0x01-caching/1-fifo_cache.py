#!/usr/bin/env python3
""" FIFO Caching."""


from base_caching import BaseCaching
from collections import OrderedDict


class FIFOCache(BaseCaching):
    """Implementation of FIFO caching."""
    def __init__(self):
        """Initialize the cache."""
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Assign to the dictionary."""
        if key is None or item is None:
            return
        self.cache_data[key] = item
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            first_key, _ = self.cache_data.popitem(False)
            print("DISCARD:", first_key)

    def get(self, key):
        """ Return the value in self.cache_data."""
        return self.cache_data.get(key, None)
