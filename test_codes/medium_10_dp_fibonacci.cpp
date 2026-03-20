// MEDIUM 10: Dynamic Programming — Fibonacci
#include <iostream>
using namespace std;

int main() {
  int n = 9;
  int dp[10];
  dp[0] = 0;
  dp[1] = 1;
  cout << "dp[0] = 0" << endl;
  cout << "dp[1] = 1" << endl;
  for (int i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
    cout << "dp[" << i << "] = " << dp[i-1] << " + " << dp[i-2]
         << " = " << dp[i] << endl;
  }
  cout << "Fibonacci(" << n << ") = " << dp[n] << endl;
  return 0;
}
