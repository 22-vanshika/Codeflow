// MEDIUM 6: Two Sum — Brute Force
#include <iostream>
using namespace std;

int main() {
  int nums[] = {2, 7, 11, 15};
  int target = 9;
  int n = 4;

  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (nums[i] + nums[j] == target) {
        cout << "Indices: [" << i << ", " << j << "]" << endl;
        cout << "Values:  [" << nums[i] << " + " << nums[j] << " = " << target << "]" << endl;
        return 0;
      }
    }
  }
  cout << "No pair found" << endl;
  return 0;
}
