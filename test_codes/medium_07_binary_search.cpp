// MEDIUM 7: Binary Search
#include <iostream>
using namespace std;

int main() {
  int arr[] = {1, 3, 5, 7, 9, 11, 13};
  int n = 7;
  int target = 7;
  int low = 0, high = n - 1;

  while (low <= high) {
    int mid = low + (high - low) / 2;
    cout << "low=" << low << " mid=" << mid << " high=" << high
         << " arr[mid]=" << arr[mid] << endl;
    if (arr[mid] == target) {
      cout << "Found at index: " << mid << endl;
      return 0;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  cout << "Not found" << endl;
  return 0;
}
