#!/usr/bin/env python3
""" Basic Dictionary."""


from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """ Implements Basic cache."""
    def put(self, key, item):
        """Assign to the dictionary."""
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """Return the value in self.cache_data linked to key."""
        return self.cache_data.get(key, None)
