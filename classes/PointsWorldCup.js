import GroupStage from './groups.js'
import {TEAM_A,TEAM_B} from './groups.js'

export default class PointsWorldCup extends GroupStage {
    constructor(name, teams=[], config={}){
        super(name, teams, config)
    }

    setup(config){
        const defaultConfig = {
            teamsXgroup: 4,
            pointsPerWin: 3,
            pointsPerDraw: 1,
            pointsPerLose: 0
        }
        this.config = Object.assign(defaultConfig, config)

    }

    customizeTeam(teamName){
        const customizedTeam = super.customizeTeam(teamName)

        return{
            points: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            ...customizedTeam
        }
    }

    generateGoals(){
        // Generamos goles de forma aleatoria
        return Math.round(Math.random() * 10)
    }

    getTeamForName(name){
        //Buscamos un equipo por su nombre
        return this.teams.find(team => team.name == name)
    }

    play(match){
        const goals_A = Math.abs(this.generateGoals() - this.generateGoals())
        const goals_B = Math.abs(this.generateGoals() - this.generateGoals())
        return{
            a_Team: match[TEAM_A],
            goals_A,
            b_Team: match[TEAM_B],
            goals_B
        }
    }

    updateTeams(result){
        const a_Team = this.getTeamForName(result.a_Team)
        const b_Team = this.getTeamForName(result.b_Team)

        if (a_Team && b_Team){

            a_Team.goalsFor += result.goals_A
            a_Team.goalsAgainst += result.goals_B
            b_Team.goalsFor += result.goals_B
            b_Team.goalsAgainst += result.goals_A

            if (result.goals_A > result.goals_B){
                a_Team.points += this.config.pointsPerWin
                a_Team.matchesWon += 1
                b_Team.points += this.config.pointsPerLose
                b_Team.matchesLost += 1
            } else if(result.goals_A < result.goals_B){
                a_Team.points += this.config.pointsPerLose
                a_Team.matchesLost += 1
                b_Team.points += this.config.pointsPerWin
                b_Team.matchesWon += 1
            } else {
                a_Team.points += this.config.pointsPerDraw
                a_Team.matchesDrawn += 1
                b_Team.points += this.config.pointsPerDraw
                b_Team.matchesDrawn += 1
            }
        }
    }

    getStandings(resultsNew){
        
        let winnerGroup = 0
        let summariesGroupGS = this.summariesGroup
        this.teams.sort(function(teamA, teamB){         
               if (teamA.group === teamB.group) {
                  
                  if (teamA.points > teamB.points){
                    
                    return -1
                } else if (teamA.points < teamB.points){
                    
                    return 1
                } else{
                   

                    winnerGroup = resultado(teamA.name, teamB.name, summariesGroupGS,resultsNew)
                    
                    if (winnerGroup == -1){
                        
                        return -1
                    }else if (winnerGroup == 1){
                        
                        return 1
                    }else {
                        const goalsDiffA = teamA.goalsFor - teamA.goalsAgainst
                        const goalsDiffB = teamB.goalsFor - teamB.goalsAgainst 
                        if (goalsDiffA > goalsDiffB) {
                            
                            return -1
                        } else if (goalsDiffA < goalsDiffB) {
                            
                            return 1
                        } else {
                            
                            const nameorderA = teamA.name.toUpperCase()
                            const nameorderB = teamB.name.toUpperCase()
                            if(nameorderA > nameorderB){
                                
                                return 1
                            }else if(nameorderA < nameorderB){
                                
                                return -1
                            }else{
                                return 0
                            }                           
                        }
                    }
                }
               }
               else{
                return teamA.group > teamB.group ? 1 : -1;
               }
               
            });
        }
}


let resultado = (teamA,teamB,summariesGroup,resultsNew=[]) => {
   
    let order = 0
    let asMaster = []
    try{
        summariesGroup.forEach(summaryGroup => {
            let j = 1
            summaryGroup.forEach(summary2 => {
                j++
                const as = summary2.results.filter(match0 => (match0.a_Team == teamA && match0.b_Team == teamB) || (match0.a_Team == teamB && match0.b_Team == teamA) )
                
                if (Object.entries(as).length == 0){ 
                    //Si el partido no se ha encontrado en summariesGroup.results, lo buscaremos en resultsNew
                    const asNew = resultsNew.filter(match01 => (match01.a_Team == teamA && match01.b_Team == teamB) || (match01.a_Team == teamB && match01.b_Team == teamA) )
                    if (Object.entries(asNew).length == 0){
                        order = 0
                     }else{
                        asMaster.push(asNew)
                     }

                }else{
                    
                    asMaster.push(as)
                }


            })
        })

        if(Object.entries(asMaster).length == 0){
           
            order = 0
            return order
        }else{
            
            const goalsA = asMaster[0][0].goals_A
            const goalsB = asMaster[0][0].goals_B
            //Si hay empate, devolvemos 0
            if(goalsA == goalsB){
                
                order = 0
                return order
            }else{
                if (asMaster[0][0].a_Team == teamA){
                    if (goalsA > goalsB){
                        
                        order = -1
                        return order
                    }else if (goalsA < goalsB){
                     
                        order = 1
                        return order
                    }
                }else{
                    if (goalsA > goalsB){
                        
                        order = 1
                        return order
                    }else if (goalsA < goalsB){
                      
                        order = -1
                        return order
                    }

                }
            }
        }

    } catch (error) {
        console.error('ERROR: ',error)
        return 0
    }
 }