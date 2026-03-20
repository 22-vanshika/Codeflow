// MEDIUM 06_b: Two Sum — Optimized (Hash Map)
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    unordered_map<int, int> map; // value -> index

    for (int i = 0; i < nums.size(); i++) {
        int val = nums[i];
        int complement = target - val;
        
        cout << "Checking map for complement: " << complement << endl;
        if (map.count(complement)) {
            cout << "Found indices: " << map[complement] << " and " << i << endl;
            return 0;
        }
        
        cout << "Adding " << val << " at index " << i << " to map" << endl;
        map[val] = i;
    }
    
    cout << "Not found" << endl;
    return 0;
}
