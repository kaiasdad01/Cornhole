"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Trash2, Edit3, Shuffle } from "lucide-react"

interface Tournament {
  name: string
  date: string
  location: string
  teams: Array<{ id: string; name: string; players: string[] }>
}

interface TeamEntryProps {
  tournament: Tournament
  setTournament: (tournament: Tournament) => void
  onNext: () => void
  isAdmin?: boolean
}

export function TeamEntry({ tournament, setTournament, onNext, isAdmin = false }: TeamEntryProps) {
  const [player1, setPlayer1] = useState("")
  const [player2, setPlayer2] = useState("")
  const [teamName, setTeamName] = useState("")
  const [soloPlayers, setSoloPlayers] = useState<string[]>([])
  const [newSoloPlayer, setNewSoloPlayer] = useState("")

  const addTeam = () => {
    if (player1.trim() && player2.trim()) {
      const defaultTeamName = `${player1} / ${player2}`
      const finalTeamName = teamName.trim() || defaultTeamName

      const newTeam = {
        id: Date.now().toString(),
        name: finalTeamName,
        players: [player1.trim(), player2.trim()],
      }

      setTournament({
        ...tournament,
        teams: [...tournament.teams, newTeam],
      })

      setPlayer1("")
      setPlayer2("")
      setTeamName("")
    }
  }

  const addSoloPlayer = () => {
    if (newSoloPlayer.trim()) {
      setSoloPlayers([...soloPlayers, newSoloPlayer.trim()])
      setNewSoloPlayer("")
    }
  }

  const autoGroupSoloPlayers = () => {
    const newTeams = []
    for (let i = 0; i < soloPlayers.length - 1; i += 2) {
      const player1 = soloPlayers[i]
      const player2 = soloPlayers[i + 1]
      newTeams.push({
        id: Date.now().toString() + i,
        name: `${player1} / ${player2}`,
        players: [player1, player2],
      })
    }

    setTournament({
      ...tournament,
      teams: [...tournament.teams, ...newTeams],
    })

    // Keep any remaining solo player
    if (soloPlayers.length % 2 === 1) {
      setSoloPlayers([soloPlayers[soloPlayers.length - 1]])
    } else {
      setSoloPlayers([])
    }
  }

  const removeTeam = (teamId: string) => {
    setTournament({
      ...tournament,
      teams: tournament.teams.filter((team) => team.id !== teamId),
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Team Registration</h1>
          <p className="text-gray-600">{tournament.name}</p>
        </div>

        {isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Entry Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Add Team
                </CardTitle>
                <CardDescription>Enter both players to create a team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="player1">Player 1</Label>
                  <Input
                    id="player1"
                    placeholder="Enter player name"
                    value={player1}
                    onChange={(e) => setPlayer1(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="player2">Player 2</Label>
                  <Input
                    id="player2"
                    placeholder="Enter player name"
                    value={player2}
                    onChange={(e) => setPlayer2(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name (Optional)</Label>
                  <Input
                    id="teamName"
                    placeholder={player1 && player2 ? `${player1} / ${player2}` : "Custom team name"}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
                <Button
                  onClick={addTeam}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!player1.trim() || !player2.trim()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Team
                </Button>
              </CardContent>
            </Card>

            {/* Solo Players Pool */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shuffle className="h-5 w-5 text-orange-600" />
                  Solo Players Pool
                </CardTitle>
                <CardDescription>Add individual players to auto-group into teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter player name"
                    value={newSoloPlayer}
                    onChange={(e) => setNewSoloPlayer(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSoloPlayer()}
                  />
                  <Button onClick={addSoloPlayer} disabled={!newSoloPlayer.trim()} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {soloPlayers.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {soloPlayers.map((player, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {player}
                          <button
                            onClick={() => setSoloPlayers(soloPlayers.filter((_, i) => i !== index))}
                            className="ml-2 text-gray-500 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>

                    {soloPlayers.length >= 2 && (
                      <Button
                        onClick={autoGroupSoloPlayers}
                        variant="outline"
                        className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
                      >
                        <Shuffle className="mr-2 h-4 w-4" />
                        Auto-Group into Teams ({Math.floor(soloPlayers.length / 2)} teams)
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Teams List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Registered Teams ({tournament.teams.length})</span>
              {tournament.teams.length > 0 && isAdmin && (
                <Button onClick={onNext} className="bg-green-600 hover:bg-green-700">
                  Create Bracket →
                </Button>
              )}
            </CardTitle>
            {!isAdmin && (
              <CardDescription className="text-blue-600">
                👁️ Public View - You can see all registered teams but cannot make changes
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {tournament.teams.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No teams registered yet</p>
                <p className="text-sm">Add your first team above to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tournament.teams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{team.name}</div>
                      <div className="text-sm text-gray-600">{team.players.join(" & ")}</div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-red-600"
                          onClick={() => removeTeam(team.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
