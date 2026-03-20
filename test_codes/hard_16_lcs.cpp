// HARD 16: Dynamic Programming — Longest Common Subsequence
#include <iostream>
#include <string>
using namespace std;

int main() {
  string X = "ABCBDAB";
  string Y = "BDCAB";
  int m = X.size(), n = Y.size();
  int dp[8][6] = {};

  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      if (X[i-1] == Y[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
        cout << "Match X[" << i-1 << "]=" << X[i-1]
             << " Y[" << j-1 << "]=" << Y[j-1]
             << " -> dp[" << i << "][" << j << "]=" << dp[i][j] << endl;
      } else {
        dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  cout << "LCS of \"" << X << "\" and \"" << Y << "\" = " << dp[m][n] << endl;
  return 0;
}
