
import { Executor } from './src/engine/languages/cpp/executor';

const testCases = [
    {
        name: "1. Simple Addition",
        code: `
#include <iostream>
using namespace std;
int main() {
    int a = 5;
    int b = 10;
    int sum = a + b;
    cout << sum << endl;
    return 0;
}
        `
    },
    {
        name: "2. Linear Loop",
        code: `
#include <iostream>
using namespace std;
int main() {
    int n = 5;
    for(int i = 1; i <= n; i++) {
        cout << i << " ";
    }
    return 0;
}
        `
    },
    {
        name: "3. If-Else Branching",
        code: `
#include <iostream>
using namespace std;
int main() {
    int x = 10;
    if(x > 5) {
        cout << "Greater" << endl;
    } else {
        cout << "Smaller" << endl;
    }
    return 0;
}
        `
    },
    {
        name: "4. Nested Loops",
        code: `
#include <iostream>
using namespace std;
int main() {
    int n = 3;
    for(int i = 1; i <= n; i++) {
        for(int j = 1; j <= n; j++) {
            cout << i * j << " ";
        }
        cout << endl;
    }
    return 0;
}
        `
    },
    {
        name: "5. Array Sum",
        code: `
#include <iostream>
using namespace std;
int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    int sum = 0;
    for(int i = 0; i < 5; i++) {
        sum += arr[i];
    }
    cout << sum << endl;
    return 0;
}
        `
    },
    {
        name: "6. Factorial While Loop",
        code: `
#include <iostream>
using namespace std;
int main() {
    int n = 5;
    int factorial = 1;
    int i = 1;
    while(i <= n) {
        factorial *= i;
        i++;
    }
    cout << factorial << endl;
    return 0;
}
        `
    },
    {
        name: "7. Find Max in Array",
        code: `
#include <iostream>
using namespace std;
int main() {
    int arr[5] = {3, 7, 2, 9, 1};
    int max = arr[0];
    for(int i = 1; i < 5; i++) {
        if(arr[i] > max) {
            max = arr[i];
        }
    }
    cout << max << endl;
    return 0;
}
        `
    },
    {
        name: "8. Recursive Fibonacci",
        code: `
#include <iostream>
using namespace std;
int fibonacci(int n) {
    if(n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}
int main() {
    int n = 6;
    cout << fibonacci(n) << endl;
    return 0;
}
        `
    },
    {
        name: "9. Bubble Sort",
        code: `
#include <iostream>
using namespace std;
int main() {
    int arr[5] = {5, 2, 8, 1, 9};
    int n = 5;
    for(int i = 0; i < n-1; i++) {
        for(int j = 0; j < n-i-1; j++) {
            if(arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
    for(int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    return 0;
}
        `
    },
    {
        name: "10. Two Pointers",
        code: `
#include <iostream>
using namespace std;
int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    int left = 0;
    int right = 4;
    while(left < right) {
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
    for(int i = 0; i < 5; i++) {
        cout << arr[i] << " ";
    }
    return 0;
}
        `
    },
    {
        name: "11. Binary Search",
        code: `
#include <iostream>
using namespace std;
int main() {
    int arr[7] = {1, 3, 5, 7, 9, 11, 13};
    int target = 7;
    int left = 0;
    int right = 6;
    int result = -1;
    while(left <= right) {
        int mid = left + (right - left) / 2;
        if(arr[mid] == target) {
            result = mid;
            break;
        }
        if(arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    cout << result << endl;
    return 0;
}
        `
    },
    {
        name: "12. Prime Number Check",
        code: `
#include <iostream>
using namespace std;
int main() {
    int n = 17;
    int isPrime = 1;
    if(n <= 1) {
        isPrime = 0;
    } else {
        for(int i = 2; i * i <= n; i++) {
            if(n % i == 0) {
                isPrime = 0;
                break;
            }
        }
    }
    if(isPrime) {
        cout << "Prime" << endl;
    } else {
        cout << "Not Prime" << endl;
    }
    return 0;
}
        `
    }
];

async function runTests() {
    console.log("Starting Test Suite...");
    let passed = 0;
    let failed = 0;

    for (const test of testCases) {
        console.log(`\n-----------------------------------`);
        console.log(`Testing: ${test.name}`);
        try {
            const executor = new Executor();
            const generator = executor.execute(test.code);
            let steps = 0;
            for (const trace of generator) {
                steps++;
            }
            console.log(`✅ Passed! Execution completed in ${steps} steps.`);
            passed++;
        } catch (error: any) {
            console.error(`❌ Failed!`);
            console.error(`Error: ${error.message}`);
            // console.error(error.stack);
            failed++;
        }
    }

    console.log(`\n-----------------------------------`);
    console.log(`Summary: ${passed} Passed, ${failed} Failed`);
}

runTests();
