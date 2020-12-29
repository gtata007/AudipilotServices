// const db = require('./database');
// const {sql} = require('@databases/pg');
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: '5432',
    database: 'postgres',
    password: 'welcome1'
})

const fetchAllScoreCards = (request, response) => {
    pool.query('SELECT id,title,ticketid,status FROM audipilot.scorecards ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getScoreCardbyId = (request, response) => {
    const scorecardid = request.params.id;
    console.log(`score card requested for ${scorecardid}`)
    const scoreCardbyIdquery = `select * from audipilot.scorecards where id=${scorecardid}`
    pool.query(scoreCardbyIdquery, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
        console.log(`response returned for score card id ${scorecardid}`)
    })
}
const createScoreCarddummy = (request, response) => {
    const { scorecardtitle, ticketid, agentname, ticketdate, totalweightage, sectionsdata } = request.body
    console.log(`${scorecardtitle}.,${agentname}.,${sectionsdata}.`)
    pool.query('INSERT INTO audipilot.scorecards (title,ticketid, agentname,ticketdate,totalweightage,sectionsdata) VALUES ($1, $2,$3,$4, $5,$6)', [scorecardtitle, ticketid, agentname, ticketdate, totalweightage, sectionsdata], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${scorecardtitle}`)
    })
}

const createScoreCard = (request, response) => {
    const scorecard = request.body
    console.log(scorecard.title)
    const query = insertScoreCardQuery(scorecard);
    console.log(' createScorecard Query :: ', query)
    var colValues = Object.keys(request.body).map(function (key) {
        return request.body[key];
    });
    console.log("columnValues :: "+colValues)
    pool.query(query, colValues, (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
        response.status(201).send(`${scorecard.title}: Score card is created`)
    })
}
const updateScoreCard = (request, response) => {
    const scorecard = request.body
    console.log(scorecard)
    const query = updateScoreCardByNameQuery(scorecard);
    console.log(' updatequery :: ', query)
    var colValues = Object.keys(request.body).map(function (key) {
        return request.body[key];
    });
    console.log(colValues);
    pool.query(query, colValues, (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
        response.status(201).send(`${scorecard.title}: Score card is updated`)
    })
}

const updateScoreCardStatus = (request, response) => {
    const { scorecardid, status } = request.body;
    console.log(`score card requested for ${scorecardid} and status ${status}`)
    const statusupdateQuery = `update audipilot.scorecards set status=${status} where id=${scorecardid}`
    pool.query(statusupdateQuery, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User modified with ID: ${scorecardid}`)
    })
}
function updateScoreCardByNameQuery(card) {
    // Setup static beginning of query
    var query = ['UPDATE audipilot.scorecards'];
    query.push('SET');

    // Create another array storing each set command
    // and assigning a number value for parameterized query
    var set = [];
    Object.keys(card).forEach(function (key, i) {
        set.push(key + ' = ($' + (i + 1) + ')');
    });
    query.push(set.join(', '));

    // Add the WHERE statement to look up by id
    query.push('WHERE title = ' + "'"+card.title+"'");

    // Return a complete query string
    return query.join(' ');
}
function insertScoreCardQuery(card) {
    // Setup static beginning of query
    var query = ['insert into audipilot.scorecards( '];
    // query.push('SET');

    // Create another array storing each set command
    // and assigning a number value for parameterized query
    var set = [];
    var ref=[];
    Object.keys(card).forEach(function (key, i) {
        set.push(key);
        ref.push(' $' + (i + 1) ); 
    });
    query.push(set.join(', '));

    // Add the WHERE statement to look up by id
    query.push(") values ");
    query.push('('+ref.join(',')+')');

    // Return a complete query string
    return query.join(' ');
}

// const getcard = await   getscoreCardByName('SCORECARD212')
// async function getscoreCardByName(title) {
//     const users = await db.query(sql`
//       SELET * FROM audipilot.scorecards
//       WHERE scorecardtitle=${title}
//     `);
//     if (users.length === 0) {
//       return null;
//     }
//     return users[0];
//   }

module.exports = {
    fetchAllScoreCards,
    getScoreCardbyId,
    createScoreCard,
    updateScoreCard,
    updateScoreCardStatus,
}