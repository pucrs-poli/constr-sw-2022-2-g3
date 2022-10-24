const fs = require('node:fs');
if (fs.existsSync('example-env') && !fs.existsSync('.env')) {
    fs.copyFileSync('example-env', '.env')
}
