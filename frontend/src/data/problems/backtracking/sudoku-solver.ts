import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'sudoku-solver',
  title: 'Sudoku Solver',
  difficulty: 'Hard',
  category: 'Backtracking',
  url: 'https://leetcode.com/problems/sudoku-solver/',
  description: 'Write a program to solve a Sudoku puzzle by filling the empty cells.\\n\\nA sudoku solution must satisfy all of the following rules:\\n1. Each of the digits `1-9` must occur exactly once in each row.\\n2. Each of the digits `1-9` must occur exactly once in each column.\\n3. Each of the digits `1-9` must occur exactly once in each of the 9 `3x3` sub-boxes of the grid.\\n\\nThe `.` character indicates empty cells.',
  examples: [
    {
      input: 'board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
      output: '[["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]',
      explanation: 'The input board is shown above and its solution is below.'
    }
  ],
  constraints: [
    'board.length == 9',
    'board[i].length == 9',
    'board[i][j] is a digit or \'.\'.',
    'It is guaranteed that the input board has only one solution.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    bool isValid(vector<vector<char>>& board, int row, int col, char c) {
        for (int i = 0; i < 9; i++) {
            if (board[i][col] == c) return false;
            if (board[row][i] == c) return false;
            if (board[3 * (row / 3) + i / 3][3 * (col / 3) + i % 3] == c) return false;
        }
        return true;
    }
    bool solve(vector<vector<char>>& board) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == '.') {
                    for (char c = '1'; c <= '9'; c++) {
                        if (isValid(board, i, j, c)) {
                            board[i][j] = c;
                            if (solve(board)) return true;
                            board[i][j] = '.';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
public:
    void solveSudoku(vector<vector<char>>& board) {
        solve(board);
    }
};

int main() {
    Solution sol;
    vector<vector<char>> b = {{'5','3','.','.','7','.','.','.','.'},{'6','.','.','1','9','5','.','.','.'},{'.','9','8','.','.','.','.','6','.'},{'8','.','.','.','6','.','.','.','3'},{'4','.','.','8','.','3','.','.','1'},{'7','.','.','.','2','.','.','.','6'},{'.','6','.','.','.','.','2','8','.'},{'.','.','.','4','1','9','.','.','5'},{'.','.','.','.','8','.','.','7','9'}};
    sol.solveSudoku(b);
    for (auto& r : b) { for (char c : r) cout << c << " "; cout << endl; }
    return 0;
}`,
};

export default problem;
