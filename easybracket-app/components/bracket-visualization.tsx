"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Target } from "lucide-react"

interface Team {
  id: string
  name: string
  players: string[]
  seed?: number
}

interface Match {
  id: string
  team1_id: string
  team2_id: string
  team1_score?: number
  team2_score?: number
  status: "scheduled" | "in-progress" | "completed"
  round: string
  round_number: number
  match_number: number
  winner_id?: string
}

interface BracketVisualizationProps {
  tournament: {
    id: string
    name: string
    teams: Team[]
    matches?: any[]
  }
  onMatchUpdate?: (matchId: string, updates: any) => void
  isAdmin?: boolean
}

export function BracketVisualization({ tournament, onMatchUpdate, isAdmin = false }: BracketVisualizationProps) {
  const [matches, setMatches] = useState<Match[]>(tournament.matches || [])
  const [editingMatch, setEditingMatch] = useState<string | null>(null)
  const [scores, setScores] = useState<{ [key: string]: { team1: number; team2: number } }>({})

  // Generate bracket if no matches exist
  useEffect(() => {
    if (!matches.length && tournament.teams.length > 0) {
      generateBracket()
    }
  }, [tournament.teams, matches.length])

  const generateBracket = () => {
    const teams = [...tournament.teams]
    const numRounds = Math.ceil(Math.log2(teams.length))
    const totalMatches = teams.length - 1
    const newMatches: Match[] = []

    // Fill teams to power of 2
    while (teams.length < Math.pow(2, numRounds)) {
      teams.push({
        id: `bye-${teams.length}`,
        name: "BYE",
        players: []
      })
    }

    // Generate first round matches
    for (let i = 0; i < teams.length / 2; i++) {
      const match: Match = {
        id: `match-${i + 1}`,
        team1_id: teams[i * 2].id,
        team2_id: teams[i * 2 + 1].id,
        status: "scheduled",
        round: "Round 1",
        round_number: 1,
        match_number: i + 1
      }
      newMatches.push(match)
    }

    // Generate subsequent rounds
    for (let round = 2; round <= numRounds; round++) {
      const matchesInRound = Math.pow(2, numRounds - round)
      for (let i = 0; i < matchesInRound; i++) {
        const match: Match = {
          id: `match-${newMatches.length + 1}`,
          team1_id: "",
          team2_id: "",
          status: "scheduled",
          round: `Round ${round}`,
          round_number: round,
          match_number: i + 1
        }
        newMatches.push(match)
      }
    }

    setMatches(newMatches)
  }

  const getTeamById = (teamId: string): Team | undefined => {
    return tournament.teams.find(team => team.id === teamId)
  }

  const handleScoreChange = (matchId: string, team: 'team1' | 'team2', value: string) => {
    const numValue = parseInt(value) || 0
    setScores(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: numValue
      }
    }))
  }

  const saveMatchScore = (matchId: string) => {
    const match = matches.find(m => m.id === matchId)
    const score = scores[matchId]
    
    if (!match || !score) return

    const updatedMatch: Match = {
      ...match,
      team1_score: score.team1,
      team2_score: score.team2,
      status: score.team1 > 0 || score.team2 > 0 ? "completed" : "scheduled",
      winner_id: score.team1 > score.team2 ? match.team1_id : 
                score.team2 > score.team1 ? match.team2_id : undefined
    }

    const updatedMatches = matches.map(m => m.id === matchId ? updatedMatch : m)
    setMatches(updatedMatches)
    setEditingMatch(null)
    
    if (onMatchUpdate) {
      onMatchUpdate(matchId, updatedMatch)
    }
  }

  const startMatch = (matchId: string) => {
    const updatedMatches = matches.map(m => 
      m.id === matchId ? { ...m, status: "in-progress" as const } : m
    )
    setMatches(updatedMatches)
  }

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "in-progress": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getRounds = () => {
    const rounds = new Set(matches.map(m => m.round_number))
    return Array.from(rounds).sort()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Tournament Bracket</h1>
          <p className="text-gray-600">{tournament.name}</p>
          <div className="flex justify-center gap-4 text-sm text-gray-600">
            <span>{tournament.teams.length} Teams</span>
            <span>•</span>
            <span>{matches.filter(m => m.status === "completed").length} Matches Completed</span>
            <span>•</span>
            <span>{matches.filter(m => m.status === "in-progress").length} In Progress</span>
          </div>
        </div>

        {/* Bracket Display */}
        <div className="overflow-x-auto">
          <div className="flex gap-8 min-w-max p-4">
            {getRounds().map((roundNumber) => {
              const roundMatches = matches.filter(m => m.round_number === roundNumber)
              const roundName = roundMatches[0]?.round || `Round ${roundNumber}`
              
              return (
                <div key={roundNumber} className="flex flex-col gap-4 min-w-[280px]">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg text-gray-900">{roundName}</h3>
                    <p className="text-sm text-gray-600">{roundMatches.length} matches</p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {roundMatches.map((match) => {
                      const team1 = getTeamById(match.team1_id)
                      const team2 = getTeamById(match.team2_id)
                      const isEditing = editingMatch === match.id
                      const currentScores = scores[match.id] || { team1: match.team1_score || 0, team2: match.team2_score || 0 }
                      
                      return (
                        <Card key={match.id} className="w-full">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={getMatchStatusColor(match.status)}>
                                {match.status === "completed" ? "Final" : 
                                 match.status === "in-progress" ? "Live" : "Scheduled"}
                              </Badge>
                              <span className="text-xs text-gray-500">Match {match.match_number}</span>
                            </div>
                            
                            <div className="space-y-2">
                              {/* Team 1 */}
                                                             <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                 <div className="flex-1">
                                   <div className="font-medium">{team1?.name || "TBD"}</div>
                                   {team1?.players && team1.players.length > 0 && (
                                     <div className="text-xs text-gray-600">{team1.players.join(" & ")}</div>
                                   )}
                                 </div>
                                {isEditing ? (
                                  <Input
                                    type="number"
                                    min="0"
                                    value={currentScores.team1}
                                    onChange={(e) => handleScoreChange(match.id, 'team1', e.target.value)}
                                    className="w-16 text-center"
                                  />
                                ) : (
                                  <div className="text-lg font-bold text-right min-w-[3rem]">
                                    {match.team1_score || 0}
                                  </div>
                                )}
                              </div>
                              
                              {/* Team 2 */}
                                                             <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                 <div className="flex-1">
                                   <div className="font-medium">{team2?.name || "TBD"}</div>
                                   {team2?.players && team2.players.length > 0 && (
                                     <div className="text-xs text-gray-600">{team2.players.join(" & ")}</div>
                                   )}
                                 </div>
                                {isEditing ? (
                                  <Input
                                    type="number"
                                    min="0"
                                    value={currentScores.team2}
                                    onChange={(e) => handleScoreChange(match.id, 'team2', e.target.value)}
                                    className="w-16 text-center"
                                  />
                                ) : (
                                  <div className="text-lg font-bold text-right min-w-[3rem]">
                                    {match.team2_score || 0}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            {isAdmin && (
                              <div className="flex gap-2 mt-3">
                                {match.status === "scheduled" && (
                                  <Button
                                    size="sm"
                                    onClick={() => startMatch(match.id)}
                                    className="flex-1"
                                  >
                                    Start Match
                                  </Button>
                                )}
                                
                                {isEditing ? (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => saveMatchScore(match.id)}
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingMatch(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingMatch(match.id)}
                                    className="flex-1"
                                  >
                                    Edit Score
                                  </Button>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
} 