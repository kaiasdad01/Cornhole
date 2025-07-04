"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Clock, TrendingUp, Users, Target, Zap } from "lucide-react"

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
  }>
}

interface LiveDashboardProps {
  tournament: Tournament
}

const pointDifferentialData = [
  { team: "Sarah & Mike", differential: 3 },
  { team: "Taylor & Jordan", differential: 6 },
  { team: "Alex & Jamie", differential: -3 },
  { team: "Chris & Dana", differential: -6 },
]

const tournamentProgressData = [
  { round: "R1", completed: 2, total: 4 },
  { round: "R2", completed: 0, total: 2 },
  { round: "SF", completed: 0, total: 1 },
  { round: "F", completed: 0, total: 1 },
]

export function LiveDashboard({ tournament }: LiveDashboardProps) {
  const [selectedView, setSelectedView] = useState<"overview" | "bracket" | "stats">("overview")

  // Use actual tournament data instead of sample data
  const matches = tournament.matches || []
  const completedMatches = matches.filter((m) => m.status === "completed")
  const inProgressMatches = matches.filter((m) => m.status === "in-progress")
  const upcomingMatches = matches.filter((m) => m.status === "upcoming")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Live Tournament Dashboard</h1>
          <p className="text-gray-600">{tournament.name}</p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Clock className="mr-1 h-3 w-3" />
              Live
            </Badge>
            <Badge variant="outline">Round 1 of 4</Badge>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center">
          <div className="bg-white p-1 rounded-lg border border-gray-200">
            <Button
              variant={selectedView === "overview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedView("overview")}
            >
              Overview
            </Button>
            <Button
              variant={selectedView === "bracket" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedView("bracket")}
            >
              Bracket
            </Button>
            <Button
              variant={selectedView === "stats" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedView("stats")}
            >
              Stats
            </Button>
          </div>
        </div>

        {selectedView === "overview" && (
          <>
            {/* Tournament Progress */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{completedMatches.length}</div>
                      <div className="text-sm text-gray-600">Matches Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{inProgressMatches.length}</div>
                      <div className="text-sm text-gray-600">In Progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-600">{tournament.teams.length}</div>
                      <div className="text-sm text-gray-600">Teams Active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {matches.length > 0 ? Math.round((completedMatches.length / matches.length) * 100) : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Tournament Progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Current Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inProgressMatches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No matches currently in progress</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inProgressMatches.map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{match.team1}</span>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              <Clock className="mr-1 h-3 w-3" />
                              Live
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">vs</div>
                          <div className="font-medium">{match.team2}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-600">
                            {match.score1} - {match.score2}
                          </div>
                          <div className="text-sm text-gray-600">{match.round}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Results */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedMatches.map((match) => (
                    <div
                      key={match.id}
                      className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            Final
                          </Badge>
                          <div className="text-sm text-gray-600">{match.round}</div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-medium ${match.score1 > match.score2 ? "text-green-700" : "text-gray-600"}`}
                            >
                              {match.team1}
                            </span>
                            <span
                              className={`font-bold text-lg ${match.score1 > match.score2 ? "text-green-700" : "text-gray-600"}`}
                            >
                              {match.score1}
                            </span>
                          </div>

                          <div className="flex items-center justify-center">
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">VS</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span
                              className={`font-medium ${match.score2 > match.score1 ? "text-green-700" : "text-gray-600"}`}
                            >
                              {match.team2}
                            </span>
                            <span
                              className={`font-bold text-lg ${match.score2 > match.score1 ? "text-green-700" : "text-gray-600"}`}
                            >
                              {match.score2}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Upcoming Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingMatches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming matches scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingMatches.map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{match.team1}</div>
                          <div className="text-sm text-gray-600">vs</div>
                          <div className="font-medium">{match.team2}</div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            {match.round}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {selectedView === "bracket" && (
          <Card>
            <CardHeader>
              <CardTitle>Tournament Bracket</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center text-gray-500 py-8">
                  <Trophy className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Bracket view coming soon</p>
                  <p className="text-sm">Tournament bracket visualization will be available here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedView === "stats" && (
          <Card>
            <CardHeader>
              <CardTitle>Tournament Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center text-gray-500 py-8">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Statistics view coming soon</p>
                  <p className="text-sm">Detailed tournament statistics will be available here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
