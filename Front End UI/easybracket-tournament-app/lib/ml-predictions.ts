import { SimpleLinearRegression } from 'ml-regression'

interface TeamStats {
  id: string
  name: string
  wins: number
  losses: number
  totalPointsScored: number
  totalPointsAllowed: number
  averageMargin: number
}

interface MatchPrediction {
  team1WinProbability: number
  team2WinProbability: number
  predictedScore1: number
  predictedScore2: number
  confidence: 'high' | 'medium' | 'low'
}

export class MLPredictionService {
  static calculateTeamStats(matches: any[], teamId: string): TeamStats {
    const teamMatches = matches.filter(m => 
      (m.team1_id === teamId || m.team2_id === teamId) && m.status === 'completed'
    )
    
    let wins = 0
    let losses = 0
    let totalPointsScored = 0
    let totalPointsAllowed = 0
    
    for (const match of teamMatches) {
      const isTeam1 = match.team1_id === teamId
      const ourScore = isTeam1 ? match.team1_score : match.team2_score
      const theirScore = isTeam1 ? match.team2_score : match.team1_score
      
      totalPointsScored += ourScore
      totalPointsAllowed += theirScore
      
      if (ourScore > theirScore) wins++
      else losses++
    }
    
    const averageMargin = teamMatches.length > 0 
      ? (totalPointsScored - totalPointsAllowed) / teamMatches.length 
      : 0
    
    return {
      id: teamId,
      name: '', // Will be filled by caller
      wins,
      losses,
      totalPointsScored,
      totalPointsAllowed,
      averageMargin
    }
  }
  
  static predictMatch(team1Stats: TeamStats, team2Stats: TeamStats): MatchPrediction {
    // Simple ELO-like rating system
    const team1Rating = this.calculateTeamRating(team1Stats)
    const team2Rating = this.calculateTeamRating(team2Stats)
    
    // Calculate win probabilities using logistic function
    const ratingDiff = team1Rating - team2Rating
    const team1WinProb = 1 / (1 + Math.pow(10, -ratingDiff / 400))
    const team2WinProb = 1 - team1WinProb
    
    // Predict scores based on historical averages and opponent strength
    const baseScore = 21 // Cornhole target score
    const team1PredictedScore = Math.round(
      baseScore * team1WinProb + 
      (team1Stats.totalPointsScored / Math.max(team1Stats.wins + team1Stats.losses, 1)) * 0.3
    )
    const team2PredictedScore = Math.round(
      baseScore * team2WinProb + 
      (team2Stats.totalPointsScored / Math.max(team2Stats.wins + team2Stats.losses, 1)) * 0.3
    )
    
    // Determine confidence based on rating difference and sample size
    const sampleSize = Math.min(team1Stats.wins + team1Stats.losses, team2Stats.wins + team2Stats.losses)
    const confidence = 
      Math.abs(ratingDiff) > 200 && sampleSize >= 3 ? 'high' :
      Math.abs(ratingDiff) > 100 && sampleSize >= 2 ? 'medium' : 'low'
    
    return {
      team1WinProbability: Math.round(team1WinProb * 100) / 100,
      team2WinProbability: Math.round(team2WinProb * 100) / 100,
      predictedScore1: Math.max(0, team1PredictedScore),
      predictedScore2: Math.max(0, team2PredictedScore),
      confidence
    }
  }
  
  private static calculateTeamRating(stats: TeamStats): number {
    const winRate = stats.wins / Math.max(stats.wins + stats.losses, 1)
    const pointDifferential = stats.averageMargin
    
    // Base rating + win rate bonus + point differential bonus
    return 1000 + (winRate * 500) + (pointDifferential * 10)
  }
  
  static generateTournamentPredictions(matches: any[], teams: any[]): any[] {
    const teamStats = teams.map(team => ({
      ...this.calculateTeamStats(matches, team.id),
      name: team.name
    }))
    
    const upcomingMatches = matches.filter(m => m.status === 'scheduled')
    
    return upcomingMatches.map(match => {
      const team1Stats = teamStats.find(t => t.id === match.team1_id)!
      const team2Stats = teamStats.find(t => t.id === match.team2_id)!
      
      return {
        matchId: match.id,
        ...this.predictMatch(team1Stats, team2Stats)
      }
    })
  }
} 