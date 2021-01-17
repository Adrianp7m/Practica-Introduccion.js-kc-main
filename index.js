

import { worldTeams } from './teams.js'
import PointsWorldCup from './classes/PointsWorldCup.js'
import KnockoutStage from './classes/playOffs.js'

try {
    console.log(worldTeams)
    const config = { rounds: 1 }
    const worldCup = new PointsWorldCup('Group Stage', worldTeams, config)

   // const teamNames = worldCup.teams.map(team => team.name)

    

    worldCup.generateGroups()
    
    console.table(worldCup.teams)

    
    worldCup.scheduleMatchDays()

    
    let groupIndex = 0
    console.log(" ")
    console.log("Comienza la fase final")
    console.log("-------------------------------------------------------")
    
    worldCup.matchGropusSchedule.forEach(round =>{
        const groupName = worldCup.range[groupIndex]
        groupIndex++
        console.log(" ")
        console.log(`GRUPO ${groupName}`)
        console.log("----------------------")
        

        let i = 1
        round.forEach(matchDay => {
            console.log(" ")
            console.log(`JORNADA ${i}`)
            matchDay.forEach(match => {
                const home = match[0] != null ? match[0] : 'Undefined'
                const away = match[1] != null ? match[1] : 'Undefined'
                console.log(`${home} vs ${away}`)
            })
            i++
        })
    })

    // Comenzamos La Eliminatoria del Mundial
    worldCup.start()

    
    
    let i = 1
    const teamGroup = []
    const worldCupElements = worldCup.summariesGroup.length
    worldCup.summariesGroup.forEach(summaryGroup => {
        console.log(' ')
        console.log(`RESUMEN GRUPO ${worldCup.range[i-1]}`)
        console.log('----------------------------')
        let j = 1
        summaryGroup.forEach(summary => {
            console.log(`Jornada ${j} del grupo ${worldCup.range[i-1]}` )
            j++
            summary.results.forEach(result =>{
                console.log(`${result.a_Team} ${result.goals_A} - ${result.goals_B} ${result.b_Team}`)
            
            })
            const tableGroup = summary.standings.filter((gr => gr.group == worldCup.range[i-1])).map(team => {
            return {
                Group: team.group,
                Team: team.name,
                Points: team.points,
                PlayedMatches: team.matchesWon + team.matchesDrawn + team.matchesLost,
                Won: team.matchesWon,
                Drawn: team.matchesDrawn,
                Lost: team.matchesLost,
                GoalsFor: team.goalsFor,
                GoalsAgainst: team.goalsAgainst,
                GoalsDiff: team.goalsFor - team.goalsAgainst
            }
        })

        
        console.table(tableGroup)
        
        
        if (worldCupElements/worldCup.range.length == j-3){
            for (let x = 0; x < 2; x++){
                console.log(`${x+1}ª posición para el grupo ${tableGroup[x].Group} es ${tableGroup[x].Team}`)
                const match = [tableGroup[x].Group,tableGroup[x].Team]
                teamGroup.push(match)
            }
        }
        
        })
        i++
        
    })
    
    console.log('')
    console.log('Equipos que pasan a la final')
    console.table(teamGroup)
    
    const worldFinal = new KnockoutStage('Finales',teamGroup)
    worldFinal.generateRounds( worldFinal.fTeamsA)
    const quarter=[]
   
    
        console.log(' ')
        console.log('======COMIENZA LA FASE DE ELIMINATORIAS======')
        console.log(' ')
        console.log('======OCTAVOS DE FINAL======')
        console.log(' ')

    worldFinal.matches.forEach(teamResult01 => {
        console.log(`${teamResult01.a_Team[1]} ${teamResult01.goals_A} - ${teamResult01.goals_B} ${teamResult01.b_Team[1]} => ${teamResult01.winner[1]}`)
        quarter.push([teamResult01.winner[0],teamResult01.winner[1]])
    })

    worldFinal.generateRounds(quarter)
    const semiFinals = []
    

    console.log(' ')
        console.log('======CUARTOS DE FINAL======')
        console.log(' ')

    worldFinal.matches.forEach(teamResult02 => {
        console.log(`${teamResult02.a_Team[1]} ${teamResult02.goals_A} - ${teamResult02.goals_B} ${teamResult02.b_Team[1]} => ${teamResult02.winner[1]}`)
        semiFinals.push([teamResult02.winner[0],teamResult02.winner[1]])
    })
    

    worldFinal.generateRounds(semiFinals)
    const finals = []
    const place34 = []
    

    console.log(' ')
        console.log('======SEMIFINALES======')
        console.log(' ')

    worldFinal.matches.forEach(teamResult03 => {
        console.log(`${teamResult03.a_Team[1]} ${teamResult03.goals_A} - ${teamResult03.goals_B} ${teamResult03.b_Team[1]} => ${teamResult03.winner[1]}`)
        finals.push([teamResult03.winner[0],teamResult03.winner[1]])
        place34.push([teamResult03.loser[0],teamResult03.loser[1]])
    })

    worldFinal.generateRounds(place34)
    console.log(' ')
        console.log('======TERCER Y CUARTO PUESTO======')
        console.log(' ')
    worldFinal.matches.forEach(teamResult04 => {
        console.log(`${teamResult04.a_Team[1]} ${teamResult04.goals_A} - ${teamResult04.goals_B} ${teamResult04.b_Team[1]} => ${teamResult04.winner[1]}`)
        console.log(' ')
    
    })

    worldFinal.generateRounds(finals)
    console.log(' ')
        console.log('======F I N A L======')
        console.log(' ')
    let winnerText=''
    worldFinal.matches.forEach(teamResult05 => {
        console.log(`${teamResult05.a_Team[1]} ${teamResult05.goals_A} - ${teamResult05.goals_B} ${teamResult05.b_Team[1]} => ${teamResult05.winner[1]}`)

      
        console.log('****** CAMPEÓN DEL MUNDO ******')
        console.log((' '+teamResult05.winner[1].toUpperCase()+' ' ))

        winnerText = teamResult05.winner[1].toUpperCase()
    })





} catch (error) {
    console.error('ERROR: ',error)
}