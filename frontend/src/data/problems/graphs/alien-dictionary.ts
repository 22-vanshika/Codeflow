import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'alien-dictionary',
  title: 'Alien Dictionary',
  difficulty: 'Hard',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/alien-dictionary/',
  description: 'There is a new alien language that uses the English alphabet. However, the order of the letters is unknown to you.\\n\\nYou are given a list of strings `words` from the alien language\'s dictionary, where the strings in `words` are **sorted lexicographically** by the rules of this new language.\\n\\nReturn a string of the unique letters in the new alien language sorted in **lexicographically increasing order** by the new language\'s rules. If there is no solution, return `""`. If there are multiple solutions, return **any of them**.',
  examples: [
    {
      input: 'words = ["wrt","wrf","er","ett","rftt"]',
      output: '"wertf"'
    },
    {
      input: 'words = ["z","x"]',
      output: '"zx"'
    },
    {
      input: 'words = ["z","x","z"]',
      output: '""',
      explanation: 'The order is invalid, so return "".'
    }
  ],
  constraints: [
    '1 <= words.length <= 100',
    '1 <= words[i].length <= 100',
    'words[i] consists of only lowercase English letters.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    string alienOrder(vector<string>& words) {
        unordered_map<char, unordered_set<char>> adj;
        unordered_map<char, int> count;
        for (string& w : words) for (char c : w) count[c] = 0;
        
        for (int i = 0; i < (int)words.size() - 1; i++) {
            string s = words[i], t = words[i+1];
            int len = min(s.size(), t.size());
            if (s.size() > t.size() && s.substr(0, len) == t) return "";
            for (int j = 0; j < len; j++) {
                if (s[j] != t[j]) {
                    if (!adj[s[j]].count(t[j])) {
                        adj[s[j]].insert(t[j]);
                        count[t[j]]++;
                    }
                    break;
                }
            }
        }
        
        queue<char> q;
        for (auto& p : count) if (p.second == 0) q.push(p.first);
        string res = "";
        while (!q.empty()) {
            char c = q.front(); q.pop();
            res += c;
            for (char next : adj[c]) {
                if (--count[next] == 0) q.push(next);
            }
        }
        return res.size() == count.size() ? res : "";
    }
};

int main() {
    Solution sol;
    vector<string> w = {"wrt","wrf","er","ett","rftt"};
    cout << sol.alienOrder(w) << endl; // wertf
    return 0;
}`,
};

export default problem;
