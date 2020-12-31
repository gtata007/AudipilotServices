// const dbpool  = require('../Server/configurations')
const Pool = require('pg').Pool
const camelcaseKeys = require('camelcase-keys')
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: '5432',
    database: 'postgres',
    password: 'welcome1'
})
const getUsers = (request, response) => {
    pool.query('SELECT * FROM audipilot.userlogin ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        camelcaseKeys(response.status(200).json(camelcaseKeys(results.rows)))
    })
}
const authenticateUser = (request, response) => {
    // const { uname, pwd } = request.body
    const uname = request.body.username
    console.log(`username is ${uname}.`)
    const pwd = request.body.password
    console.log(`password is ${pwd}.`)
    const query=`SELECT * FROM audipilot.userlogin WHERE username ='${uname}' and password='${pwd}'`;
    console.log(query);
    pool.query(query, (error, results) => {
        if (error) {
            console.log(pool.query.toString);
            throw error
        }
        camelcaseKeys(response.status(200).json(results.rows))
    })
}
module.exports = {
    getUsers,
    authenticateUser,
}