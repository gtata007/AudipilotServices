const Pool = require('pg').Pool
function getConnection(){
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: '5432',
    database: 'postgres',
    password: 'welcome1'
})
// pool.connect;
return pool;
}
module.exports={
    getConnection,
}