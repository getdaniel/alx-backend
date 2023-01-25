#!/usr/bin/env python3
""" LFU Caching."""


from base_caching import BaseCaching
from collections import OrderedDict


class LFUCache(BaseCaching):
    """Implementation of FIFO caching."""
    def __init__(self):
        """Initialize the cache."""
        super().__init__()
        self.cache_data = OrderedDict()
        self.keys_frequency = []

    def put(self, key, item):
        """Assign to the dictionary."""
        if key is None or item is None:
            return
        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                lfu_key, _ = self.keys_frequency[-1]
                self.cache_data.pop(lfu_key)
                self.keys_frequency.pop()
                print("DISCARD:", lfu_key)
            self.cache_data[key] = item
            insert_index = len(self.keys_frequency)
            for indx, keys_frequency in enumerate(self.keys_frequency):
                if keys_frequency[1] == 0:
                    insert_index = indx
                    break
            self.keys_frequency.insert(insert_index, [key, 0])
        else:
            self.cache_data[key] = item
            self.reorder_items(key)

    def get(self, key):
        """ Return the value in self.cache_data."""
        if key is not None and key in self.cache_data:
            self.reorder_items(key)
        return self.cache_data.get(key, None)

    def reorder_items(self, lfu_key):
        """ Reorders the items in the cache."""
        max_positions = []
        lfu_frequency = 0
        lfu_position = 0
        insert_position = 0
        for index, key_frequency in enumerate(self.keys_frequency):
            if key_frequency[0] == lfu_key:
                lfu_frequency = key_frequency[1] + 1
                lfu_position = index
                break
            elif len(max_positions) == 0:
                max_positions.append(index)
            elif key_frequency[1] < self.keys_frequency[max_positions[-1]][1]:
                max_positions.append(index)
        max_positions.reverse()

        for position in max_positions:
            if self.keys_frequency[position][1] > lfu_frequency:
                break
            insert_position = position
        self.keys_frequency.pop(lfu_position)
        self.keys_frequency.insert(insert_position, [lfu_key, lfu_frequency])
