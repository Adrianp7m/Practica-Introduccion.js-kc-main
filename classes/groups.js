export const TEAM_A = 0
export const TEAM_B = 1

export default class GroupStage {
    constructor(name, teams=[], config={}) {
        this.name = name
        this.setup(config)
        this.setupTeams(teams)
        this.summaries = []
        this.summariesGroup = []
    }

    setup(config) {
        const defaultConfig = { teamsXgroup: 4 }
        this.config = Object.assign(defaultConfig, config)
    }

    setupTeams(teamNames) {
        this.teams = []
        for (const teamName of teamNames) {
            const team = this.customizeTeam(teamName)
            this.teams.push(team)
        }
        this.teams.shuffle()
    }

    customizeTeam(teamName) {
        return {
            name: teamName,
            group: 0,
            matchesWon: 0,
            matchesDrawn: 0,
            matchesLost: 0
        }
    }

    generateGroups(){
        
        if (this.teams.length % this.config.teamsXgroup != 0){
            console.log(`Los equipos son ${this.teams.length} imposible hacer grupos de ${this.config.teamsXgroup}`)
            throw TypeError(`Los equipos son ${this.teams.length} imposible hacer grupos de ${this.config.teamsXgroup}`);
        } else{
            this.groupsName()
            let i = 0
            let x = 0
            this.teams.forEach(team => {
                if (i % this.config.teamsXgroup == 0){
                    console.log(' ')
                    console.log('--------------------')
                    console.log(`Grupo ${this.range[x]}`)
                    console.log('--------------------')
                    x++
                }
                i++
                team.group = this.range[x-1]
                console.log(team.name, team.group)
            });
            
        }
    }

    //Función para generar los grupos
    groupsName () {
        this.range=[]
        let start = 65
        let end = (this.teams.length/this.config.teamsXgroup) + start -1
        let step = 1

        while (step > 0 ? end >= start : end <= start) {
            this.range.push(String.fromCharCode(start))
            start += step
        }
    }

    createRound() {
        const groupsStage = []
        this.initSchedule(groupsStage)
        this.setTeamsA(groupsStage)
        this.setTeamsB(groupsStage)
        this.fixLastTeamSchedule(groupsStage)
        return groupsStage
    }

    
    initSchedule(groupsStage) {
        const numberOfMatchDays = this.config.teamsXgroup - 1
        const numberOfMatchesPerMatchDay = this.config.teamsXgroup / 2
        const numberOfGroups= this.range.length
        console.log(`numberOfMatchDays= ${this.config.teamsXgroup - 1} numberOfMatchesPerMatchDay= ${this.config.teamsXgroup / 2} numberOfGroups= ${this.range.length} Total Equipos= ${this.teams.length}`)
        
        for (let k = 0; k<numberOfGroups; k++){
            const round2=[]

            for (let i = 0; i < numberOfMatchDays; i++) {
                const matchDay = []  // jornada vacía
                for (let j = 0; j < numberOfMatchesPerMatchDay; j++) {
                    const match = [`Equipo A Gr: ${this.range[k]}  dia ${i} partido ${j}`, `Equipo B Gr: ${this.range[k]}  dia ${i} partido ${j}`]  // partido
                    matchDay.push(match)
                }
                
                round2.push(matchDay)  
                // añadimos la jornada a la planificación
            }
           
            groupsStage.push(round2)
        }
           
    }
   
    setTeamsA(groupsStage) {
        
        let groupIndex = 0
      
        groupsStage.forEach(round =>{
            const teamNames = this.getTeamNamesGroup(this.range[groupIndex])
            groupIndex++
            const maxTeamsA = teamNames.length - 2
            let teamIndex = 0
            round.forEach(matchDay => { 
                // por cada partido de cada jornada
                matchDay.forEach(match => { 
                    // establecer el equipo A
                    match[TEAM_A] = teamNames[teamIndex]
                    teamIndex++
                    if (teamIndex > maxTeamsA) {
                        teamIndex = 0
                    }
                })
            })
        })
    }

   
    setTeamsB(groupsStage) {
        
        let groupIndex = 0
        // Por cada grupo
        groupsStage.forEach(round =>{
            const teamNames = this.getTeamNamesGroup(this.range[groupIndex])
            groupIndex++
            const maxTeamsB = teamNames.length - 2
            let teamIndex = maxTeamsB
            // Por cada jornada
            round.forEach(matchDay => {
                let firstMatchFound = false
                
                matchDay.forEach(match => {
                   
                    if (!firstMatchFound) {
                        firstMatchFound = true
                    } else {
                        match[TEAM_B] = teamNames[teamIndex]
                        teamIndex--
                        if (teamIndex < 0) {
                            teamIndex = maxTeamsB
                        }
                    }
                })
            })
        })
    }

    fixLastTeamSchedule(groupsStage) {
        let groupIndex = 0
        groupsStage.forEach(round =>{
            let matchDayNumber = 1
            const teamNames = this.getTeamNamesGroup(this.range[groupIndex])
            groupIndex++
            const lastTeamName = teamNames[teamNames.length - 1]
            round.forEach(matchDay => {
                const firstMatch = matchDay[0]
                if (matchDayNumber % 2 == 0) { 
                    firstMatch[TEAM_B] = firstMatch[TEAM_A]
                    firstMatch[TEAM_A] = lastTeamName
                } else { 
                    firstMatch[TEAM_B] = lastTeamName
                }
                matchDayNumber++
            })
        })
    }
    
    scheduleMatchDays() {
            const newRound = this.createRound()
            this.matchGropusSchedule = newRound    
            
   }

    start(){
        console.log(' ')
        console.log("COMIENZA LA FASE DE GRUPOS!!!")

        for(const round of this.matchGropusSchedule ){
            for (const matchDay of round) {
                const matchDaySummary = {
                    results: [],
                    standings: undefined
                }
                for (const match of matchDay) {
                    const result = this.play(match)
                    
                    this.updateTeams(result)  
                    matchDaySummary.results.push(result)
                }
              
                this.getStandings(matchDaySummary.results)
                matchDaySummary.standings = this.teams.map(team => Object.assign({}, team))
                
                this.summaries.push(matchDaySummary)
            }
            this.summariesGroup.push(this.summaries)
            this.summaries = []
        }  
    }

    getTeamNamesGroup(group) {
        
        const teamsInGroup = this.teams.filter(gr => gr.group == group).map(team => team.name)
        return teamsInGroup
    }

   

}

// Desordeno los equipos
Array.prototype.shuffle = function()
{
	let i = this.length;
	while (i)
	{
		let j = Math.floor(Math.random() * i);
		let t = this[--i];
		this[i] = this[j];
		this[j] = t;
	}
	return this;
}