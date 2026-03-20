// HARD 12: Dynamic Programming — 0/1 Knapsack
#include <iostream>
using namespace std;

int main() {
  int weights[] = {1, 2, 3, 5};
  int values[]  = {1, 6, 10, 16};
  int n = 4, W = 7;
  int dp[5][8] = {};

  for (int i = 1; i <= n; i++) {
    for (int w = 0; w <= W; w++) {
      // Don't take item i
      dp[i][w] = dp[i-1][w];
      // Take item i if it fits
      if (weights[i-1] <= w) {
        int withItem = dp[i-1][w - weights[i-1]] + values[i-1];
        if (withItem > dp[i][w]) {
          dp[i][w] = withItem;
        }
      }
    }
  }
  cout << "Max value in knapsack: " << dp[n][W] << endl;
  return 0;
}
