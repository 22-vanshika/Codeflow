import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'daily-temperatures',
  title: 'Daily Temperatures',
  difficulty: 'Medium',
  category: 'Stack',
  url: 'https://leetcode.com/problems/daily-temperatures/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> res(n, 0);
        stack<int> st; // indices
        for (int i = 0; i < n; i++) {
            while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
                int idx = st.top(); st.pop();
                res[idx] = i - idx;
            }
            st.push(i);
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> temps = {73,74,75,71,69,72,76,73};
    auto res = sol.dailyTemperatures(temps);
    for (int d : res) cout << d << " "; // 1 1 4 2 1 1 0 0
    cout << endl;
    return 0;
}`,
};

export default problem;
