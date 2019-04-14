const express = require('express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
router.use(bodyParser.urlencoded({ extended: false }))



let APlayer=""
let BPlayer=""
let ABPlayers=[]
let dates=[]
let subANewPlayer=[]
let subBNewPlayer=[]

//scoring to database
function inputScores(playerName,matchDate,score){

    db.any('SELECT golfer FROM "steveq_test" WHERE golfer=$1',[playerName])
    .then((player)=>{
     if(player!=""){
       //console.log(player)
       db.one('SELECT q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11 FROM "steveq_test" WHERE golfer = $1', [playerName])
    .then ((quota)=>{
        //console.log(quota)
        let updatedQuotaList = Object.values(quota)
        updatedQuotaList.unshift(score)
        updatedQuotaList.pop()
        updatedQuotaList.push(playerName)
        //console.log(matchDate)
        db.none('UPDATE "steveq_test" SET q1=$1,q2=$2,q3=$3,q4=$4,q5=$5,q6=$6,q7=$7,q8=$8,q9=$9,q10=$10,q11=$11 WHERE golfer=$12',updatedQuotaList)
    .then(()=>{
      //console.log("Hello")
        db.none('INSERT INTO sandbox_steve (p_name,p_date,p_score) VALUES($1,$2,$3)',[playerName,matchDate,score])
    })
    .then(()=>{
      console.log("inputs ok")
    })

        }).catch(error => console.log(error))
      }
      else{
         db.one('INSERT INTO "steveq_test"(golfer, q1) VALUES($1, $2) RETURNING id', [playerName, score])
          .then((data) => {
            db.none('INSERT INTO sandbox_steve (p_name,p_date,p_score) VALUES($1,$2,$3)',[playerName,matchDate,score])
        console.log("new dude entered")

    }).catch(error => console.log(error))



      }
    })
  }



//calculate quotas
function calculateQuotas(){

    db.any('SELECT * FROM "steveq_test"')
    .then ((quotas)=>{
      //clears the array
      thisWeeksQuotas.length=0
      for(index=0;index<quotas.length;index++){
      let quota=quotas[index]

        
        if(quota.q1==null){
          let thisWeekQuota=5
          let quotapush = {name:quota.golfer,quota:thisWeekQuota,newbie:"*"}
          thisWeeksQuotas.push(quotapush)

       
      }
        else if(quota.q2==null){
          let thisWeekQuota=quota.q1+3
        let quotapush = {name:quota.golfer,quota:thisWeekQuota,newbie:"*"}
        thisWeeksQuotas.push(quotapush)
       
      }
      else if(quota.q3==null){
        if(quota.q1>=quota.q2){
          let thisWeekQuota=quota.q1
          let quotapush = {name:quota.golfer,quota:thisWeekQuota,newbie:"*"}
        thisWeeksQuotas.push(quotapush)
          
        }
        else{thisWeekQuota=quota.q2
        let quotapush = {name:quota.golfer,quota:thisWeekQuota,newbie:"*"}
        thisWeeksQuotas.push(quotapush)
       
      }
    }
      else if(quota.q4==null){
        let thisWeekQuota=Math.round((quota.q1+quota.q2+quota.q3)/3)
        let quotapush = {name:quota.golfer,quota:thisWeekQuota,newbie:"*"}
        thisWeeksQuotas.push(quotapush)
        

      }
      else if(quota.q5==null){
        let thisWeekQuota=Math.round((quota.q1+quota.q2+quota.q3+quota.q4)/4)
        let quotapush = {name:quota.golfer,quota:thisWeekQuota,newbie:"*"}
        thisWeeksQuotas.push(quotapush)
        
      }
      else if(quota.q6==null){
        let thisWeekQuota=Math.round((quota.q1+quota.q2+quota.q3+quota.q4+quota.q5)/5)
        let quotapush = {name:quota.golfer,quota:thisWeekQuota,newbie:"*"}
        thisWeeksQuotas.push(quotapush)
        
      }
      else if(quota.q7==null){
        let thisWeekQuota=Math.round((quota.q1+quota.q2+quota.q3+quota.q4+quota.q5+quota.q6)/6)
        let quotapush = {name:quota.golfer,quota:thisWeekQuota,newbie:"*"}
        thisWeeksQuotas.push(quotapush)
        
      }
      else if(quota.q8==null){
        let thisWeekQuota=Math.round((quota.q1+quota.q2+quota.q3+quota.q4+quota.q5+quota.q6+quota.q7)/7)
        let quotapush = {name:quota.golfer,quota:thisWeekQuota,newbie:"*"}
        thisWeeksQuotas.push(quotapush)
        
      }
      else if(quota.q9==null){
        let thisWeekQuota=Math.round((quota.q1+quota.q2+quota.q3+quota.q4+quota.q5+quota.q6+quota.q7+quota.q8)/8 )
        let quotapush = {name:quota.golfer,quota:thisWeekQuota,newbie:"*"}
        thisWeeksQuotas.push(quotapush)
        
      }
      else if(quota.q10==null){
        let thisWeekQuota=Math.round((quota.q1+quota.q2+quota.q3+quota.q4+quota.q5+quota.q6+quota.q7+quota.q8+quota.q9)/9 )
        let quotapush = {name:quota.golfer,quota:thisWeekQuota,newbie:"*"}
        thisWeeksQuotas.push(quotapush)
        
      }
      else if(quota.q11==null){
        let thisWeekQuota=Math.round((quota.q1+quota.q2+quota.q3+quota.q4+quota.q5+quota.q6+quota.q7+quota.q8+quota.q9+quota.q10)/10 )
        let quotapush = {name:quota.golfer,quota:thisWeekQuota,newbie:"*"}
        thisWeeksQuotas.push(quotapush)
       
      }
      else{let thisWeekQuota=Math.round((quota.q1+quota.q2+quota.q3+quota.q4+quota.q5+quota.q6+quota.q7+quota.q8+quota.q9+quota.q10)/10)
        let quotapush = {name:quota.golfer,quota:thisWeekQuota}
        thisWeeksQuotas.push(quotapush)
        
      }
      
    }


  })
  }

//looping through the teams to create teamPlayer1 and 2
function getTeams(){
    ABPlayers.length=0
    db.any('SELECT team,player_one,player_two FROM teams')
    .then((teams)=>{
        // console.log('this is teams list')
        // console.log(teams)
        for (i=0; i < teams.length; i++){
            let team = teams[i].team
            let teamPlayer1 =teams[i].player_one
            let teamPlayer2 = teams[i].player_two
            // console.log("this from getteams")
            // console.log(teamPlayer1)
            // console.log(teamPlayer2)
            //console.log("in for loop of getTeams()")
            ABPlayer(team,teamPlayer1,teamPlayer2)

        }

        })


}



//checks to see who is A player or B Player
function ABPlayer(team,teamPlayer1,teamPlayer2){
    //console.log("pushing to array")
    let teamNumber=team
    let thisweekplayer1 = thisWeeksQuotas.filter(quota=>quota.name==teamPlayer1)
    let thisweekplayer2 = thisWeeksQuotas.filter(quota=>quota.name==teamPlayer2)

    if(thisweekplayer1[0].quota >= thisweekplayer2[0].quota){
         APlayer= teamPlayer1
         BPlayer= teamPlayer2
         APlayerQuota=thisweekplayer1[0].quota
         BPlayerQuota=thisweekplayer2[0].quota

    }else{
         APlayer=teamPlayer2
         BPlayer=teamPlayer1
         APlayerQuota=thisweekplayer2[0].quota
         BPlayerQuota=thisweekplayer1[0].quota
        //  console.log("this is second case")
        //  console.log(APlayerQuota)
        // console.log(BPlayerQuota)

    }

   let ABPlayersPush = {teamNumber:teamNumber,APlayer:APlayer, APlayerQuota:APlayerQuota,BPlayer:BPlayer,BPlayerQuota:BPlayerQuota}
   ABPlayers.push(ABPlayersPush)


}


function checkForASub(APlayer,origAPlayer){
    subBNewPlayer.length=0
  
if (APlayer != origAPlayer) {

  let newAPlayer = thisWeeksQuotas.filter(quota=>quota.name==APlayer)
  newAPlayerQuota=newAPlayer[0].quota
  subANewPlayer.push(newAPlayerQuota)
  // console.log("this is new player quota")
  // console.log(newAPlayerQuota)
  
}
else  {
    let newAPlayer = thisWeeksQuotas.filter(quota=>quota.name==APlayer)
      newAPlayerQuota=newAPlayer[0].quota
      subANewPlayer.push(newAPlayerQuota)
      // console.log("this is new player quota")
      // console.log(newAPlayerQuota)
      // console.log("Bsubno Asub")      
      // console.log("Asubno Asub")

}
}

function checkForBSub(BPlayer,origBPlayer){
      subBNewPlayer.length=0
  
      if (BPlayer != origBPlayer) {
  
      let newBPlayer = thisWeeksQuotas.filter(quota=>quota.name==BPlayer)
     newBPlayerQuota=newBPlayer[0].quota
      subBNewPlayer.push(newBPlayerQuota)
    // console.log("this is new a player quota")
    // console.log(newBPlayerQuota)
    
    }
      else  {
     let newBPlayer = thisWeeksQuotas.filter(quota=>quota.name==BPlayer)
      newBPlayerQuota=newBPlayer[0].quota
      subBNewPlayer.push(newBPlayerQuota)
    // console.log("this is new b player quota")
    // console.log(newBPlayerQuota)
    // console.log("Bsubno Asub")
  
  }
  }
//this isnt used yet
// router.get('/next-weeks-matches',(req,res)=>{

//     getTeams()
//     //console.log(ABPlayers)

//        // console.log(x)




//     res.render('next-weeks-matches',{ABPlayers:ABPlayers})

// })
router.get('/team-sign-in',(req,res)=>{
  res.render('sign-in-team')
})

router.post('/team-sign-in',(req,res)=>{
    calculateQuotas()

    let teamNumber=parseInt(req.body.teamNumber)
    let password = req.body.password
    let week = parseInt(req.body.week)
    //console.log(teamNumber)
    //console.log(password)

    
    dates.length=0
    if(thisWeeksQuotas.length==0){
      res.render('sign-in-team',{message:"Sorry server busy please try again"})

    }else{
    

       //console.log(thisWeeksQuotas)
        db.one('SELECT date FROM week_date WHERE id=$1',[week])
         .then((date)=>{dates.push(date)
        //console.log(dates)
          })
         .then(

          db.one('SELECT team,hash, player_one, player_two FROM teams WHERE team = $1',[teamNumber])
            .then((hash)=>{
        //console.log(hash)
               bcrypt.compare(password,hash.hash,function(err,result){
                  if (result==true){
                     console.log("success")
                    let team = hash.team
                    let teamPlayer1 =hash.player_one
                    let teamPlayer2 = hash.player_two
                //console.log("this from gettneweams")
                 //console.log(teamPlayer1)
                 //console.log(teamPlayer2)
                      ABPlayers.length=0


                      ABPlayer(team,teamPlayer1,teamPlayer2)
                      //console.log(ABPlayers)

                      let thisTeam= ABPlayers.filter(team=>team.teamNumber==teamNumber)

                //console.log("this is this team")
                //console.log(thisTeam)

                      res.render('input-scores',{thisTeam:thisTeam,date:dates})

                  }else{
                      console.log("wrong Password")
                      res.render('sign-in-team',{message:"Incorrect Password"})

            }
        })
    })
    )
  }
})

let players =
{
  t1P1: {
    name: "",
    teamNumber: 0,
    quota: 0,
    overUnder: 0,
    played: true,
    score: 0
  },
  t1P2: {
    name: "",
    teamNumber: 0,
    quota: 0,
    overUnder: 0,
    played: true,
    score: 0
  },
  t2P1: {
    name: "",
    teamNumber: 0,
    quota: 0,
    overUnder: 0,
    played: true
  },
  t2P2: {
    name: "",
    teamNumber: 0,
    quota: 0,
    overUnder: 0,
    played: true
  }
}
let teamOnePoints = 0
let teamTwoPoints = 0
let teamOneOldPoints = 0
let teamTwoOldPoints = 0
let teamOneOverUnder = 0
let teamTwoOverUnder = 0
//inputs first teams score
router.post('/input-score',(req,res)=>{

    let oppTeamNumber=parseInt(req.body.opposition)
    let teamNumber=parseInt(req.body.teamNumber)
    let APlayer= req.body.playerName1
    let BPlayer= req.body.playerName2
    let APlayerScore=parseInt(req.body.score1)
    let BPlayerScore=parseInt(req.body.score2)
    let date=req.body.date
    let origAPlayer = req.body.origAPlayer
    let origBPlayer = req.body.origBPlayer
    // console.log(req.body.origAPlayer)
    // console.log(req.body.origBPlayer)
  console.log(oppTeamNumber)

  
  checkForASub(APlayer,origAPlayer)
  checkForBSub(BPlayer,origBPlayer)
   console.log("TEAM 1 Status")
   console.log('Aplayer status')
   console.log(isNoShow(req.body.onePlayed))
   console.log('bplayer status')
   console.log(isNoShow(req.body.twoPlayed))
  //console.log(subANewPlayer[0])
  //onsole.log(subBNewPlayer[0])

  
    t1APlayer = players.t1P1
    t1BPlayer = players.t1P2
    t1APlayer.teamNumber = teamNumber
    t1BPlayer.teamNumber = teamNumber
    t1APlayer.name = APlayer
    t1BPlayer.name = BPlayer
    t1APlayer.score= APlayerScore
    t1BPlayer.score= BPlayerScore
    t1APlayer.quota = subANewPlayer[0]
    t1BPlayer.quota = subBNewPlayer[0]
    t1APlayer.played = isNoShow(req.body.onePlayed)
    t1BPlayer.played = isNoShow(req.body.twoPlayed)
    t1APlayer.overUnder = APlayerScore - t1APlayer.quota
    t1BPlayer.overUnder = BPlayerScore - t1BPlayer.quota


    //Must enter second team number
    if(isNaN(oppTeamNumber)){
      console.log('entering second team')
     
      res.render('input-scores',{message:"must enter opposing team",dateredo:dates, t1APlayer:t1APlayer, t1BPlayer:t1BPlayer })
    }else{
      
      db.one('SELECT team,player_one,player_two FROM teams where team = $1',oppTeamNumber)
      .then((teams)=>{
         //console.log(getTeams)
         let team = teams.team
         let teamPlayer1 =teams.player_one
         let teamPlayer2 = teams.player_two
 
         ABPlayers.length=0
         ABPlayer(team,teamPlayer1,teamPlayer2)
 
             let otherTeam= ABPlayers.filter(team=>team.teamNumber==oppTeamNumber)
 
             res.render('input-second',{otherTeam:otherTeam, date:dates, t1APlayer:t1APlayer, t1BPlayer:t1BPlayer})
 
                  })
      
  

    }
    if(isNaN(APlayerScore)){
      console.log("Player One did not enter a score")
    } else{
      inputScores(APlayer,date,APlayerScore)
    }
    if(isNaN(BPlayerScore)){
      console.log("Player Two did not enter a score")
    } else{
      inputScores(BPlayer,date,BPlayerScore)
    }

    
    

   
            })


//inputs opponents score
router.post('/input-second',(req,res)=>{
        let teamNumber=parseInt(req.body.teamNumber)
        let date=req.body.date
        let APlayer= req.body.playerName1
        let BPlayer= req.body.playerName2
        let APlayerScore=parseInt(req.body.score1)
        let BPlayerScore=parseInt(req.body.score2)
        let t1APlayer = players.t1P1
        let t1BPlayer = players.t1P2
        let origAPlayer = req.body.origAPlayer
        let origBPlayer = req.body.origBPlayer
        t2APlayer = players.t2P1
        t2BPlayer = players.t2P2
        t2APlayer.teamNumber = teamNumber
        t2BPlayer.teamNumber = teamNumber
        t2APlayer.name = APlayer
        t2BPlayer.name = BPlayer
        t1APlayer.quota = subANewPlayer[0]
        t1BPlayer.quota = subBNewPlayer[0]
        t2APlayer.played = isNoShow(req.body.threePlayed)
        t2BPlayer.played = isNoShow(req.body.fourPlayed)
        t2APlayer.overUnder = APlayerScore - t2APlayer.quota
        t2BPlayer.overUnder = BPlayerScore - t2BPlayer.quota
        t1APlayer = players.t1P1
        t1BPlayer = players.t1P2
        teamOneOverUnder = t1APlayer.overUnder + t1BPlayer.overUnder
        teamTwoOverUnder = t2APlayer.overUnder + t2BPlayer.overUnder


        checkForASub(APlayer,origAPlayer)
        checkForBSub(BPlayer,origBPlayer)
        console.log("TEAM 2 Status")
        console.log('Aplayer status')
        console.log(req.body.threePlayed)
        console.log(t2APlayer.played)
        console.log('bplayer status')
        console.log(t2BPlayer.played)
        console.log(req.body.fourPlayed)
        //console.log(subBNewPlayer[0])

        if(isNaN(APlayerScore)){
          console.log("Player One did not enter a score")
        } else{
          inputScores(APlayer,date, APlayerScore)
        }
        if(isNaN(BPlayerScore)){
          console.log("Player Two did not enter a score")
        } else{
          inputScores(BPlayer,date,BPlayerScore)
        }
        db.one('SELECT points FROM teams WHERE team = $1;', [t1APlayer.teamNumber]).then((points)=>{
          teamOneOldPoints = points.points
          db.one('SELECT points FROM teams WHERE team = $1;', [t2APlayer.teamNumber]).then((points) => {
            teamTwoOldPoints = points.points
            //console.log("team one: " + teamOneOldPoints, "team two: " +  teamTwoOldPoints)
            playerPoints(t1APlayer, t2APlayer)
            playerPoints(t1BPlayer, t2BPlayer)
            teamPoints(t1APlayer,t1BPlayer,t2APlayer,t2BPlayer)
            console.log("team one: " + teamOnePoints, "team two: " +  teamTwoPoints)
            
            let teamOnePointsToSend = parseFloat(teamOnePoints) + parseFloat(teamOneOldPoints)
            let teamTwoPointsToSend = parseFloat(teamTwoPoints) + parseFloat(teamTwoOldPoints)
            db.none('UPDATE teams SET points = $1 WHERE team = $2', [teamOnePointsToSend,t1APlayer.teamNumber])
            .then(()=>{
              db.none('UPDATE teams SET points = $1 WHERE team = $2', [teamTwoPointsToSend,t2APlayer.teamNumber])
              .then(()=>{
                teamOnePoints = 0
                teamTwoPoints = 0

              })
              res.render('sign-in-team',{message:`Team: ${t1APlayer.teamNumber}: ${teamOnePoints} Team: ${t2APlayer.teamNumber}: ${teamTwoPoints} Points `})
            })
          })
        })
    })





   

//Functions to calculate points awarded per team
function isNoShow(boxValue) {
  console.log("firing boxvalue function")
  console.log(boxValue)
  if (boxValue == 'false') {
    return false
  }
  else{
    return true
  }
}
function playerPoints(playerOne, playerTwo) {
  
  if(playerOne.played == false && playerTwo.played == false){
    playerOne.overUnder = -3
    playerTwo.overUnder = -3
    teamOnePoints += 0
    teamTwoPoints += 0
  } else if (playerOne.played == false){
    playerOne.overUnder = -3
    if(playerOne.overUnder > playerTwo.overUnder){
      teamOnePoints += 0
    } else if (playerOne.overUnder < playerTwo.overUnder) {
      teamTwoPoints += 3
    } else {
      teamOnePoints += 0
      teamTwoPoints += 1.5
    }
  } else if(playerTwo.played == false){
    playerTwo.overUnder = -3
    if(playerOne.overUnder > playerTwo.overUnder){
      teamOnePoints += 3
    } else if (playerOne.overUnder < playerTwo.overUnder) {
      teamTwoPoints += 0
    } else {
      teamOnePoints += 1.5
      teamTwoPoints += 0
    }
  } else if(playerOne.overUnder > playerTwo.overUnder){
    teamOnePoints += 3
  } else if (playerOne.overUnder < playerTwo.overUnder) {
    teamTwoPoints += 3
  } else {
    teamOnePoints += 1.5
    teamTwoPoints += 1.5
  }
}
// //function simpleTeamPoints(teamOneAPlayer,TeamOneBPlayer,TeamTwoAPlayer,TeamTwoAPlayer){
//   if(teamOnePoints==teamTwoPoints){
//     if(){

//     }
//   }
//   console.log("new function")
// }
function teamPoints(teamOnePlayerOne,teamOnePlayerTwo,teamTwoPlayerOne,teamTwoPlayerTwo) {
  //this looks correct 
  if (teamOnePlayerOne.played == false){
    //team one cannot make points here
    if(teamOnePlayerTwo.played == false){
      //correct
      if (teamTwoPlayerOne.played == false && teamTwoPlayerTwo.played == false){
        //no points awarded in this case
        teamOnePoints = 0
        teamTwoPoints = 0
      }// this looks wrong dont think you can get one point 
      else if(teamTwoPlayerOne.played == false && teamTwoPlayerTwo.played == true){
        if (teamOneOverUnder > teamTwoOverUnder){
          //no points for team two either in this case cos they lost against no shows
          teamOnePoints += 0
          teamTwoPoints += 0
          
        } else if (teamOneOverUnder < teamTwoOverUnder) {
          //only one player playing so correct
          teamTwoPoints += 2
        } else {
          //this is tied with no show situation so ok 
          teamOnePoints += 0
          teamTwoPoints += 1
          //console.log("how did this situation occur")
        }
      }
      else if(teamTwoPlayerOne.played == true && teamTwoPlayerTwo.played == false){
        if (teamOneOverUnder > teamTwoOverUnder){
          //no points for team two either in this case cos they lost against no shows
          teamOnePoints += 0
          teamTwoPoints += 0
          
        } else if (teamOneOverUnder < teamTwoOverUnder) {
          //only one player playing so correct
          teamTwoPoints += 2
        } else {
          //this is tied with no show situation so ok 
          teamOnePoints += 0
          teamTwoPoints += 1
          //console.log("how did this situation occur")
        }
      }
      else {
        if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 0
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 4
      } else {
        //tied situation 
        teamOnePoints += 0
        teamTwoPoints += 2
      }
    }
    //team 1 player 2 playing
    } else if(teamTwoPlayerOne.played == false && teamTwoPlayerTwo.played == false){
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 2
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 0
      } else {
        //tie
        teamOnePoints += 1
        teamTwoPoints += 0
      }
    } 
    //looks like it triggers if one or none play so this gould be an issue think it needs to be if player 1 ns and player 2 show or player 1 show and player2 ns
    else if(teamTwoPlayerOne.played == false && teamTwoPlayerTwo.played == true){
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 2
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 2
      } else {
        teamOnePoints += 1
        teamTwoPoints += 1
      }
    }
    //added another case
    else if(teamTwoPlayerOne.played == true && teamTwoPlayerTwo.played == false){
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 2
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 2
      } else {
        teamOnePoints += 1
        teamTwoPoints += 1
      }
    }
    else{
      // teamm 1 1 player team 2 2 players
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 2
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 4
      } else {
        teamOnePoints += 1
        teamTwoPoints += 2
      }
    }
  } else if (teamOnePlayerTwo.played == false){
    if(teamOnePlayerOne.played == false){
      if (teamTwoPlayerOne.played == false && teamTwoPlayerTwo.played == false){
        teamOnePoints = 0
        teamTwoPoints = 0
      }
      else if(teamTwoPlayerOne.played == false || teamTwoPlayerTwo.played == false){
        if (teamOneOverUnder > teamTwoOverUnder){
          teamOnePoints += 0
        } else if (teamOneOverUnder < teamTwoOverUnder) {
          teamTwoPoints += 2
        } else {
          teamOnePoints += 0
          teamTwoPoints += 1
        }
      }
      else {
        if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 0
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 4
      } else {
        teamOnePoints += 0
        teamTwoPoints += 2
      }
    }
  } else if(teamTwoPlayerOne.played == false && teamTwoPlayerTwo.played == false){
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 2
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 0
      } else {
        teamOnePoints += 1
        teamTwoPoints += 0
      }
    }
    //added another case 
    else if(teamTwoPlayerOne.played == false && teamTwoPlayerTwo.played == true){
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 2
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 2
      } else {
        teamOnePoints += 1
        teamTwoPoints += 1
      }
    }
    else if(teamTwoPlayerOne.played == true && teamTwoPlayerTwo.played == false){
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 2
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 2
      } else {
        teamOnePoints += 1
        teamTwoPoints += 1
      }
    }
    else{
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 2
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 4
      } else {
        teamOnePoints += 1
        teamTwoPoints += 2
      }
    }
  } else if (teamTwoPlayerOne.played == false){
    if(teamTwoPlayerTwo.played == false){
      if (teamOnePlayerOne.played == false && teamOnePlayerTwo.played == false){
        teamOnePoints = 0
        teamTwoPoints = 0
      }
      //added another test case
      else if(teamOnePlayerOne.played == false && teamOnePlayerTwo.played == true){
        if (teamOneOverUnder > teamTwoOverUnder){
          teamOnePoints += 2
        } else if (teamOneOverUnder < teamTwoOverUnder) {
          teamTwoPoints += 0
        } else {
          teamOnePoints += 1
          teamTwoPoints += 0
        }
      }
      else if(teamOnePlayerOne.played == true && teamOnePlayerTwo.played == false){
        if (teamOneOverUnder > teamTwoOverUnder){
          teamOnePoints += 2
        } else if (teamOneOverUnder < teamTwoOverUnder) {
          teamTwoPoints += 0
        } else {
          teamOnePoints += 1
          teamTwoPoints += 0
        }
      }
      else {
        if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 4
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 0
      } else {
        teamOnePoints += 2
        teamTwoPoints += 0
      }
    }
  } else if(teamOnePlayerOne.played == false && teamOnePlayerTwo.played == false){
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 0
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 2
      } else {
        teamOnePoints += 1
        teamTwoPoints += 0
      }
    }
    //added another test case
    else if(teamOnePlayerOne.played == false && teamOnePlayerTwo.played == false){
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 2
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 2
      } else {
        teamOnePoints += 1
        teamTwoPoints += 1
      }
    }
    else if(teamOnePlayerOne.played == true && teamOnePlayerTwo.played == false){
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 2
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 2
      } else {
        teamOnePoints += 1
        teamTwoPoints += 1
      }
    }
    else{
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 4
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 2
      } else {
        teamOnePoints += 2
        teamTwoPoints += 1
      }
    }
  }
  else if (teamTwoPlayerTwo.played == false){
    if(teamTwoPlayerOne.played == false){
      if (teamOnePlayerOne.played == false && teamOnePlayerTwo.played == false){
        teamOnePoints = 0
        teamTwoPoints = 0
      }
      //another case to fix eroneous 1 point
      else if(teamOnePlayerOne.played == false && teamOnePlayerTwo.played == true){
        if (teamOneOverUnder > teamTwoOverUnder){
          teamOnePoints += 2
        } else if (teamOneOverUnder < teamTwoOverUnder) {
          teamTwoPoints += 0
        } else {
          teamOnePoints += 1
          teamTwoPoints += 0
        }
      }
      else if(teamOnePlayerOne.played == true && teamOnePlayerTwo.played == false){
        if (teamOneOverUnder > teamTwoOverUnder){
          teamOnePoints += 2
        } else if (teamOneOverUnder < teamTwoOverUnder) {
          teamTwoPoints += 0
        } else {
          teamOnePoints += 1
          teamTwoPoints += 0
        }
      }
      else {
        if(teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 4
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 0
      } else {
        teamOnePoints += 2
        teamTwoPoints += 0
      }
      }
    } else if(teamOnePlayerOne.played == false && teamOnePlayerTwo.played == false){
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 0
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 2
      } else {
        teamOnePoints += 1
        teamTwoPoints += 0
      }
    }
    //anothere 1 point fix
    else if(teamOnePlayerOne.played == false && teamOnePlayerTwo.played == true){
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 2
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 2
      } else {
        teamOnePoints += 1
        teamTwoPoints += 1
      }
    }
    else if(teamOnePlayerOne.played == true && teamOnePlayerTwo.played == false){
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 2
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 2
      } else {
        teamOnePoints += 1
        teamTwoPoints += 1
      }
    }
    else{
      if (teamOneOverUnder > teamTwoOverUnder){
        teamOnePoints += 4
      } else if (teamOneOverUnder < teamTwoOverUnder) {
        teamTwoPoints += 2
      } else {
        teamOnePoints += 2
        teamTwoPoints += 1
      }
    }
  }
  else {
    if (teamOneOverUnder > teamTwoOverUnder){
      teamOnePoints += 4
    } else if (teamOneOverUnder < teamTwoOverUnder) {
      teamTwoPoints += 4
    } else {
      teamOnePoints += 2
      teamTwoPoints += 2
    }
  }
}

module.exports = router
