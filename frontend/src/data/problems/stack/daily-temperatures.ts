import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'daily-temperatures',
  title: 'Daily Temperatures',
  difficulty: 'Medium',
  category: 'Stack',
  url: 'https://leetcode.com/problems/daily-temperatures/',
  description: 'Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.',
  examples: [
    {
      input: 'temperatures = [73,74,75,71,69,72,76,73]',
      output: '[1,1,4,2,1,1,0,0]'
    },
    {
      input: 'temperatures = [30,40,50,60]',
      output: '[1,1,1,0]'
    }
  ],
  constraints: [
    '1 <= temperatures.length <= 10^5',
    '30 <= temperatures[i] <= 100'
  ],
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
