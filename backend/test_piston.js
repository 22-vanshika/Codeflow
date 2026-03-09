const axios = require('axios');

async function testPiston() {
    try {
        const payload = {
            compiler: 'gcc-head',
            code: '#include <iostream>\nint main() { std::cout << "Hello Wandbox!"; return 0; }',
            options: 'warning,gnu++17',
            stdin: '',
            'compiler-option-raw': ''
        };
        const response = await axios.post('https://wandbox.org/api/compile.json', payload);
        console.log(response.data);
    } catch (error) {
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        console.error('Error message:', error.message);
    }
}

testPiston();
