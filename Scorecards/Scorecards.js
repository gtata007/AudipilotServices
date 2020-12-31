// const db = require('./database');
// const {sql} = require('@databases/pg');
const Pool = require('pg').Pool
const camelcaseKeys = require('camelcase-keys')
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: '5432',
    database: 'postgres',
    password: 'welcome1'
})

const fetchAllScoreCards = (request, response) => {
    pool.query('SELECT id,title,ticket_id,status FROM audipilot.scorecards ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(camelcaseKeys(results.rows))
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
        response.status(200).json(camelcaseKeys(results.rows))
        console.log(`response returned for score card id ${scorecardid}`)
    })
}
const createScoreCarddummy = (request, response) => {
    const { scorecardTitle, ticketId, agentName, ticketDate, totalWeightage, sectionsData } = request.body
    console.log(`${scorecardtitle}.,${agentname}.,${sectionsdata}.`)
    pool.query('INSERT INTO audipilot.scorecards (title,ticket_id, agent_name,ticket_date,total_weightage,sections_data) VALUES ($1, $2,$3,$4, $5,$6)', [scorecardTitle, ticketId, agentName, ticketDate, totalWeightage, sectionsData], (error, results) => {
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
        set.push(camel_to_snake(key) + ' = ($' + (i + 1) + ')');
    });
    query.push(set.join(', '));

    // Add the WHERE statement to look up by id
    query.push('WHERE title = ' + "'"+card.title+"'");

    // Return a complete query string
    return query.join(' ');
}
function camel_to_snake (str){
    return str[0].toLowerCase() + str.slice(1, str.length).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
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
       console.log('Key recieved ',key)
      
        set.push(camel_to_snake(key));
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