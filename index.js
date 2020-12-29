const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const lg = require('./Login/login')
const scorecard=require('./Scorecards/Scorecards')
const cors = require('cors')
const port = 7777

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
// Parse JSON bodies (as sent by API clients)
app.use(cors());
app.use(express.json());

app.get('/',(request,response)=>{
    response.json({info:"Node.js, Express, and Postgress API"})
})
// get user details , all user detiails and user authentication
app.get('/getAllUsers', lg.getUsers)
app.post('/authenticate-user',lg.authenticateUser)

// fetch, fetchall, create and update score card services
app.get('/all-score-cards',scorecard.fetchAllScoreCards)
app.get('/score-card-byid/:id',scorecard.getScoreCardbyId)
app.post('/create-score-card',scorecard.createScoreCard)
app.put('/update-score-card',scorecard.updateScoreCard)
app.put('/update-scorecard-status',scorecard.updateScoreCardStatus)


app.listen(port,()=>{
    console.log(`App is running on port ${port}.`)
})

