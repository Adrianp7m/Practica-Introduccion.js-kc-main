

export default class playOffs {
    constructor(name, teams=[], config={}) {
        this.name = name
        this.setupTeamsA(teams)
    }

    setupTeamsA(teamNames) {
        

        this.fTeamsA = []
        let numTeams = teamNames.length/2
        for (let i = 0; i < numTeams ; i +=2 ) {
            let team =[] 
            team = teamNames[i]
            team[i,0] = 'A'
            this.fTeamsA.push(team)
            team = teamNames[i + numTeams]
            team[i,0] = 'A'
            this.fTeamsA.push(team)  
        }
        for (let i = 1; i < numTeams + 1 ; i +=2 ) {
            let team =[] 
            team = teamNames[i]
            team[i,0] = 'B'
            this.fTeamsA.push(team)
            team = teamNames[i + numTeams]
            team[i,0] = 'B'
            this.fTeamsA.push(team)  
        }
        console.log('')
        console.log('Reparto de equipos en dos grupos')
        console.table(this.fTeamsA)
       
    }

    play(match){
        let goals_A = 0
        let goals_B = 0
        //No puede haber empate
        while (goals_A == goals_B) {
            goals_A = Math.abs(this.generateGoals() - this.generateGoals())
            goals_B = Math.abs(this.generateGoals() - this.generateGoals())
        }
        let winner = ''
        let loser = ''
        
        if(goals_A > goals_B){
            winner = match[0]
            loser = match[1]
        } else {
            winner = match[1]
            loser = match[0]
        }
        return{
            a_Team: match[0],
            goals_A,
            b_Team: match[1],
            goals_B,
            winner,
            loser
        }
    }
    
    generateGoals(){
        // Generamos goles de forma aleatoria
        return Math.round(Math.random() * 10)
    }

    generateRounds(teamsG = []){
        this.matches = []
        let match = []
        let matchResult = []
        for (let i = 0; i < teamsG.length ; i +=2 ) {
            matchResult = []
            match = []
            match = [teamsG[i],teamsG[i+1]]
            matchResult = this.play(match)
            this.matches.push(matchResult)
        }
    }


    
}