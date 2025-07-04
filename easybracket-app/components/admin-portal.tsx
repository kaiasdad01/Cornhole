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
}

interface AdminPortalProps {
  tournament: Tournament
}

// Sample matches for admin management
const sampleMatches = [
  {
    id: 1,
    team1: "Sarah & Mike",
    team2: "Alex & Jamie",
    score1: 21,
    score2: 18,
    status: "completed",
    round: "Round 1",
    time: "2:30 PM",
    court: "Court A",
    weather: "sunny",
    notes: "Great match, close finish",
  },
  {
    id: 2,
    team1: "Chris & Dana",
    team2: "Taylor & Jordan",
    score1: 15,
    score2: 21,
    status: "completed",
    round: "Round 1",
    time: "3:00 PM",
    court: "Court B",
    weather: "cloudy",
    notes: "",
  },
  {
    id: 3,
    team1: "Casey & Riley",
    team2: "Morgan & Avery",
    score1: 12,
    score2: 8,
    status: "in-progress",
    round: "Round 1",
    time: "3:30 PM",
    court: "Court A",
    weather: "sunny",
    notes: "",
  },
]

export function AdminPortal({ tournament }: AdminPortalProps) {
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [editingMatch, setEditingMatch] = useState<any>(null)

  const startEditMatch = (match: any) => {
    setEditingMatch({ ...match })
    setSelectedMatch(match)
  }

  const saveMatch = () => {
    // In a real app, this would save to the backend
    console.log("Saving match:", editingMatch)
    setEditingMatch(null)
    setSelectedMatch(null)
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
                <CardTitle>Match Management</CardTitle>
                <CardDescription>Click on any match to edit scores, times, and notes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleMatches.map((match) => (
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
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {match.time}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {getWeatherIcon(match.weather)}
                          <span>{match.court}</span>
                        </div>
                        {match.notes && <div className="text-xs text-gray-500 max-w-xs truncate">{match.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
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
                    <Label>Teams</Label>
                    <div className="text-sm font-medium">
                      {editingMatch.team1} vs {editingMatch.team2}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="score1">{editingMatch.team1.split(" ")[0]} Score</Label>
                      <Input
                        id="score1"
                        type="number"
                        value={editingMatch.score1}
                        onChange={(e) =>
                          setEditingMatch({
                            ...editingMatch,
                            score1: Number.parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="score2">{editingMatch.team2.split(" ")[0]} Score</Label>
                      <Input
                        id="score2"
                        type="number"
                        value={editingMatch.score2}
                        onChange={(e) =>
                          setEditingMatch({
                            ...editingMatch,
                            score2: Number.parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Match Time</Label>
                    <Input
                      id="time"
                      value={editingMatch.time}
                      onChange={(e) =>
                        setEditingMatch({
                          ...editingMatch,
                          time: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="court">Court</Label>
                    <Select
                      value={editingMatch.court}
                      onValueChange={(value) =>
                        setEditingMatch({
                          ...editingMatch,
                          court: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Court A">Court A</SelectItem>
                        <SelectItem value="Court B">Court B</SelectItem>
                        <SelectItem value="Court C">Court C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weather">Weather</Label>
                    <Select
                      value={editingMatch.weather}
                      onValueChange={(value) =>
                        setEditingMatch({
                          ...editingMatch,
                          weather: value,
                        })
                      }
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
                    <Label htmlFor="notes">Match Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any notes about this match..."
                      value={editingMatch.notes}
                      onChange={(e) =>
                        setEditingMatch({
                          ...editingMatch,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={saveMatch} className="flex-1">
                      <Save className="mr-2 h-4 w-4" />
                      Save
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
            ) : selectedMatch ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Match Details</CardTitle>
                  <CardDescription>
                    {selectedMatch.team1} vs {selectedMatch.team2}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      {selectedMatch.score1} - {selectedMatch.score2}
                    </div>
                    <Badge
                      variant={
                        selectedMatch.status === "completed"
                          ? "default"
                          : selectedMatch.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {selectedMatch.status === "completed"
                        ? "Final"
                        : selectedMatch.status === "in-progress"
                          ? "Live"
                          : "Scheduled"}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Round:</span>
                      <span className="font-medium">{selectedMatch.round}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{selectedMatch.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Court:</span>
                      <span className="font-medium">{selectedMatch.court}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Weather:</span>
                      <div className="flex items-center gap-1">
                        {getWeatherIcon(selectedMatch.weather)}
                        <span className="capitalize">{selectedMatch.weather}</span>
                      </div>
                    </div>
                    {selectedMatch.notes && (
                      <div className="pt-2 border-t border-gray-100">
                        <span className="text-gray-600 text-xs">Notes:</span>
                        <p className="text-sm mt-1">{selectedMatch.notes}</p>
                      </div>
                    )}
                  </div>

                  <Button onClick={() => startEditMatch(selectedMatch)} className="w-full">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Match
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                  <CardDescription>Select a match to edit or use quick actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-transparent" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Match
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Tournament Settings
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Save className="mr-2 h-4 w-4" />
                    Export Results
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tournament Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Tournament Settings</CardTitle>
            <CardDescription>Manage global tournament settings and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Default Match Duration</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Scoring System</Label>
                <Select defaultValue="21">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="21">First to 21</SelectItem>
                    <SelectItem value="15">First to 15</SelectItem>
                    <SelectItem value="11">First to 11</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Auto-advance Winners</Label>
                <Select defaultValue="yes">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Live Updates</Label>
                <Select defaultValue="enabled">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
