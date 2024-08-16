const Pool = require("pg").Pool;
const pool = new Pool({
    user:'postgres', // default postgres
    //host: '192.168.0.2\\DESARROLLO'
    host:'localhost',//localhost
    database:'G4System',  
    // password:'G4_2023sP',  
    password:'',  
    port:'5432' //default port
});

module.exports = pool;