"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, TrendingUp, Share2, Download, Mail, MessageSquare } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"

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
    winner?: string
  }>
}

interface PostTournamentReportProps {
  tournament: Tournament
}

export function PostTournamentReport({ tournament }: PostTournamentReportProps) {
  // Calculate results from actual tournament data
  const matches = tournament.matches || []
  const completedMatches = matches.filter(m => m.status === "completed")
  
  // Calculate team statistics
  const teamStats = tournament.teams.map(team => {
    const teamName = team.name
    const wins = completedMatches.filter(m => m.winner === teamName).length
    const losses = completedMatches.filter(m => 
      (m.team1 === teamName || m.team2 === teamName) && m.winner !== teamName
    ).length
    
    // Calculate point differential
    let pointDiff = 0
    completedMatches.forEach(match => {
      if (match.team1 === teamName) {
        pointDiff += match.score1 - match.score2
      } else if (match.team2 === teamName) {
        pointDiff += match.score2 - match.score1
      }
    })
    
    return {
      team: teamName,
      wins,
      losses,
      pointDiff,
      totalMatches: wins + losses
    }
  }).filter(stat => stat.totalMatches > 0)
    .sort((a, b) => {
      // Sort by wins first, then by point differential
      if (b.wins !== a.wins) return b.wins - a.wins
      return b.pointDiff - a.pointDiff
    })

  const finalResults = teamStats.map((stat, index) => ({
    place: index + 1,
    ...stat
  }))

  const shareResults = (method: "text" | "email") => {
    if (finalResults.length === 0) {
      alert("No tournament results to share yet!")
      return
    }

    const results =
      `🏆 ${tournament.name} Results!\n\n` +
      `🥇 Champions: ${finalResults[0].team}\n` +
      `🥈 Runner-up: ${finalResults[1]?.team || 'TBD'}\n` +
      `🥉 3rd Place: ${finalResults[2]?.team || 'TBD'}\n\n` +
      `Thanks to all ${tournament.teams.length} teams for a great tournament!`

    if (method === "text") {
      if (navigator.share) {
        navigator.share({
          title: `${tournament.name} Results`,
          text: results,
        })
      } else {
        navigator.clipboard.writeText(results)
        alert("Results copied to clipboard!")
      }
    } else {
      const subject = encodeURIComponent(`${tournament.name} Results`)
      const body = encodeURIComponent(results)
      window.open(`mailto:?subject=${subject}&body=${body}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900">Tournament Complete!</h1>
          </div>
          <p className="text-xl text-gray-600">{tournament.name}</p>
          <p className="text-gray-500">
            {tournament.date} • {tournament.location}
          </p>
          <Badge variant="secondary" className="bg-green-100 text-green-800 text-lg px-4 py-2">
            Tournament Finished
          </Badge>
        </div>

        {/* Champions Section */}
        {finalResults.length > 0 && (
          <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Trophy className="h-8 w-8 text-yellow-500" />
                Tournament Champions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-yellow-600">{finalResults[0].team}</div>
                <div className="text-lg text-gray-600">
                  Perfect tournament: {finalResults[0].wins}-{finalResults[0].losses} record
                </div>
                <div className="flex justify-center gap-4 text-sm">
                  <div className="bg-white px-4 py-2 rounded-lg border">
                    <div className="font-bold text-lg">{finalResults[0].wins}</div>
                    <div className="text-gray-600">Wins</div>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg border">
                    <div className="font-bold text-lg">+{finalResults[0].pointDiff}</div>
                    <div className="text-gray-600">Point Diff</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Final Standings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-orange-600" />
              Final Standings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {finalResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Medal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No completed matches yet</p>
                <p className="text-sm">Tournament results will appear here once matches are completed</p>
              </div>
            ) : (
              <div className="space-y-3">
                {finalResults.map((result) => (
                  <div
                    key={result.place}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                      result.place === 1
                        ? "border-yellow-300 bg-yellow-50"
                        : result.place === 2
                          ? "border-gray-300 bg-gray-50"
                          : result.place === 3
                            ? "border-orange-300 bg-orange-50"
                            : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          result.place === 1
                            ? "bg-yellow-500"
                            : result.place === 2
                              ? "bg-gray-500"
                              : result.place === 3
                                ? "bg-orange-500"
                                : "bg-blue-500"
                        }`}
                      >
                        {result.place}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{result.team}</div>
                        <div className="text-sm text-gray-600">
                          {result.wins}W - {result.losses}L • {result.pointDiff > 0 ? '+' : ''}{result.pointDiff} pts
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{result.wins}</div>
                      <div className="text-sm text-gray-600">Wins</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Share Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              Share Results
            </CardTitle>
            <CardDescription>Share tournament results with participants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={() => shareResults("text")}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={finalResults.length === 0}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Share via Text
              </Button>
              <Button
                onClick={() => shareResults("email")}
                variant="outline"
                className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                disabled={finalResults.length === 0}
              >
                <Mail className="mr-2 h-4 w-4" />
                Share via Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Tournament Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{tournament.teams.length}</div>
                <div className="text-sm text-gray-600">Teams Participated</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{completedMatches.length}</div>
                <div className="text-sm text-gray-600">Matches Played</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">
                  {finalResults.length > 0 ? finalResults[0].team : 'TBD'}
                </div>
                <div className="text-sm text-gray-600">Champion</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
