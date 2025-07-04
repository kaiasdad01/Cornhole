"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Save, Clock, Edit3, Plus, Sun, Cloud, CloudRain } from "lucide-react"

interface Tournament {
  name: string
  date: string
  location: string
  teams: Array<{ id: string; name: string; players: string[] }>
  matches?: Array<{
    id: string
    team1: string
    team2: string
    score1: number
    score2: number
    status: "completed" | "in-progress" | "upcoming"
    round: string
    time?: string
    court?: string
    weather?: string
    notes?: string
  }>
}

interface AdminPortalProps {
  tournament: Tournament
}

export function AdminPortal({ tournament }: AdminPortalProps) {
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [editingMatch, setEditingMatch] = useState<any>(null)
  const [matches, setMatches] = useState(tournament.matches || [])

  const startEditMatch = (match: any) => {
    setEditingMatch({ ...match })
    setSelectedMatch(match)
  }

  const saveMatch = () => {
    if (!editingMatch) return
    
    // Update the matches array
    const updatedMatches = matches.map(match => 
      match.id === editingMatch.id ? editingMatch : match
    )
    setMatches(updatedMatches)
    
    // In a real app, this would save to the backend
    console.log("Saving match:", editingMatch)
    setEditingMatch(null)
    setSelectedMatch(null)
  }

  const createNewMatch = () => {
    const newMatch = {
      id: Date.now().toString(),
      team1: "",
      team2: "",
      score1: 0,
      score2: 0,
      status: "upcoming" as const,
      round: "Round 1",
      time: "",
      court: "Court A",
      weather: "sunny",
      notes: "",
    }
    setEditingMatch(newMatch)
    setSelectedMatch(newMatch)
  }

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "sunny":
        return <Sun className="h-4 w-4 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-4 w-4 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-4 w-4 text-blue-500" />
      default:
        return <Sun className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600">{tournament.name} - Tournament Management</p>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Settings className="mr-1 h-3 w-3" />
            Admin Access
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Match List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Match Management</CardTitle>
                    <CardDescription>Click on any match to edit scores, times, and notes</CardDescription>
                  </div>
                  <Button onClick={createNewMatch} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Match
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {matches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No matches scheduled yet</p>
                    <p className="text-sm">Click "Add Match" to create the first match</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedMatch?.id === match.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedMatch(match)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                match.status === "completed"
                                  ? "default"
                                  : match.status === "in-progress"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {match.status === "completed"
                                ? "Final"
                                : match.status === "in-progress"
                                  ? "Live"
                                  : "Scheduled"}
                            </Badge>
                            <span className="text-sm text-gray-600">{match.round}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditMatch(match)
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{match.team1}</div>
                            <div className="text-sm text-gray-600">vs</div>
                            <div className="font-medium">{match.team2}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold">
                              {match.score1} - {match.score2}
                            </div>
                            {match.time && (
                              <div className="text-sm text-gray-600 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {match.time}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            {match.weather && getWeatherIcon(match.weather)}
                            <span>{match.court}</span>
                          </div>
                          {match.notes && <div className="text-xs text-gray-500 max-w-xs truncate">{match.notes}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Match Editor */}
          <div className="lg:col-span-1">
            {editingMatch ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Edit Match</CardTitle>
                  <CardDescription>Update match details and scores</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="team1">Team 1</Label>
                    <Input
                      id="team1"
                      value={editingMatch.team1}
                      onChange={(e) => setEditingMatch({ ...editingMatch, team1: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team2">Team 2</Label>
                    <Input
                      id="team2"
                      value={editingMatch.team2}
                      onChange={(e) => setEditingMatch({ ...editingMatch, team2: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="score1">Score 1</Label>
                      <Input
                        id="score1"
                        type="number"
                        value={editingMatch.score1}
                        onChange={(e) => setEditingMatch({ ...editingMatch, score1: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="score2">Score 2</Label>
                      <Input
                        id="score2"
                        type="number"
                        value={editingMatch.score2}
                        onChange={(e) => setEditingMatch({ ...editingMatch, score2: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editingMatch.status}
                      onValueChange={(value) => setEditingMatch({ ...editingMatch, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Scheduled</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="round">Round</Label>
                    <Input
                      id="round"
                      value={editingMatch.round}
                      onChange={(e) => setEditingMatch({ ...editingMatch, round: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      value={editingMatch.time || ""}
                      onChange={(e) => setEditingMatch({ ...editingMatch, time: e.target.value })}
                      placeholder="e.g., 2:30 PM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="court">Court</Label>
                    <Input
                      id="court"
                      value={editingMatch.court || ""}
                      onChange={(e) => setEditingMatch({ ...editingMatch, court: e.target.value })}
                      placeholder="e.g., Court A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weather">Weather</Label>
                    <Select
                      value={editingMatch.weather || "sunny"}
                      onValueChange={(value) => setEditingMatch({ ...editingMatch, weather: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunny">Sunny</SelectItem>
                        <SelectItem value="cloudy">Cloudy</SelectItem>
                        <SelectItem value="rainy">Rainy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={editingMatch.notes || ""}
                      onChange={(e) => setEditingMatch({ ...editingMatch, notes: e.target.value })}
                      placeholder="Add match notes..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveMatch} className="flex-1">
                      <Save className="mr-2 h-4 w-4" />
                      Save Match
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingMatch(null)
                        setSelectedMatch(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Match Details</CardTitle>
                  <CardDescription>Select a match to edit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Edit3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No match selected</p>
                    <p className="text-sm">Click on a match from the list to edit</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
