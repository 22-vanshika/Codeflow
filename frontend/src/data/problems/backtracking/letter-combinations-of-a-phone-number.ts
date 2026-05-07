import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'letter-combinations-of-a-phone-number',
  title: 'Letter Combinations of a Phone Number',
  difficulty: 'Medium',
  category: 'Backtracking',
  url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    unordered_map<char, string> keyMap = {
        {'2',"abc"},{'3',"def"},{'4',"ghi"},{'5',"jkl"},
        {'6',"mno"},{'7',"pqrs"},{'8',"tuv"},{'9',"wxyz"}
    };
    void backtrack(string& digits, int i, string& curr, vector<string>& res) {
        if (i == (int)digits.size()) { res.push_back(curr); return; }
        for (char c : keyMap[digits[i]]) {
            curr.push_back(c);
            backtrack(digits, i + 1, curr, res);
            curr.pop_back();
        }
    }
public:
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return {};
        vector<string> res; string curr;
        backtrack(digits, 0, curr, res);
        return res;
    }
};

int main() {
    Solution sol;
    auto res = sol.letterCombinations("23");
    for (auto& s : res) cout << s << " "; // ad ae af bd be bf cd ce cf
    cout << endl;
    return 0;
}`,
};

export default problem;
