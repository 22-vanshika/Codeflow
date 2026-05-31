import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'lru-cache',
  title: 'LRU Cache',
  difficulty: 'Medium',
  category: 'Linked List',
  url: 'https://leetcode.com/problems/lru-cache/',
  description: 'Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\\n\\nImplement the `LRUCache` class:\\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.\\n- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\\n- `void put(int key, int value)` Update the value of the `key` if the key exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, **evict** the least recently used key.\\n\\nThe functions `get` and `put` must each run in `O(1)` average time complexity.',
  examples: [
    {
      input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
      output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
      explanation: 'LRUCache lRUCache = new LRUCache(2);\\nlRUCache.put(1, 1); // cache is {1=1}\\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\\nlRUCache.get(1);    // return 1\\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\\nlRUCache.get(2);    // returns -1 (not found)\\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\\nlRUCache.get(1);    // return -1 (not found)\\nlRUCache.get(3);    // return 3\\nlRUCache.get(4);    // return 4'
    }
  ],
  constraints: [
    '1 <= capacity <= 3000',
    '0 <= key <= 10^4',
    '0 <= value <= 10^5',
    'At most 2 * 10^5 calls will be made to get and put.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class LRUCache {
    int cap;
    list<pair<int, int>> l;
    unordered_map<int, list<pair<int, int>>::iterator> m;
public:
    LRUCache(int capacity) : cap(capacity) {}
    
    int get(int key) {
        if (m.find(key) == m.end()) return -1;
        l.splice(l.begin(), l, m[key]);
        return m[key]->second;
    }
    
    void put(int key, int value) {
        if (m.find(key) != m.end()) {
            l.splice(l.begin(), l, m[key]);
            m[key]->second = value;
            return;
        }
        if ((int)l.size() == cap) {
            int d_key = l.back().first;
            l.pop_back();
            m.erase(d_key);
        }
        l.push_front({key, value});
        m[key] = l.begin();
    }
};

int main() {
    LRUCache cache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    cout << cache.get(1) << endl;    // 1
    cache.put(3, 3);                 // evicts 2
    cout << cache.get(2) << endl;    // -1
    return 0;
}`,
};

export default problem;
