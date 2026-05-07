import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'word-search',
  title: 'Word Search',
  difficulty: 'Medium',
  category: 'Backtracking',
  url: 'https://leetcode.com/problems/word-search/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    bool dfs(vector<vector<char>>& board, string& word, int i, int j, int k) {
        if (k == (int)word.size()) return true;
        if (i < 0 || i >= (int)board.size() || j < 0 || j >= (int)board[0].size()
            || board[i][j] != word[k]) return false;
        char temp = board[i][j];
        board[i][j] = '#';
        bool found = dfs(board, word, i+1, j, k+1)
                  || dfs(board, word, i-1, j, k+1)
                  || dfs(board, word, i, j+1, k+1)
                  || dfs(board, word, i, j-1, k+1);
        board[i][j] = temp;
        return found;
    }
public:
    bool exist(vector<vector<char>>& board, string word) {
        for (int i = 0; i < (int)board.size(); i++)
            for (int j = 0; j < (int)board[0].size(); j++)
                if (dfs(board, word, i, j, 0)) return true;
        return false;
    }
};

int main() {
    Solution sol;
    cout << boolalpha;
    vector<vector<char>> board = {{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}};
    cout << sol.exist(board, "ABCCED") << endl; // true
    cout << sol.exist(board, "SEE")    << endl; // true
    cout << sol.exist(board, "ABCB")   << endl; // false
    return 0;
}`,
};

export default problem;
