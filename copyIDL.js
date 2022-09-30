const fs = require('fs');
const idl = require('./target/idl/anchor_blog.json');

fs.writeFileSync('./app/public/idl.json', JSON.stringify(idl));
