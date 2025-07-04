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
}

interface PostTournamentReportProps {
  tournament: Tournament
}

// Sample final tournament data
const finalResults = [
  { place: 1, team: "Taylor & Jordan", wins: 4, losses: 0, pointDiff: 24 },
  { place: 2, team: "Sarah & Mike", wins: 3, losses: 1, pointDiff: 12 },
  { place: 3, team: "Casey & Riley", wins: 2, losses: 2, pointDiff: -3 },
  { place: 4, team: "Alex & Jamie", wins: 1, losses: 3, pointDiff: -8 },
]

const matchResults = [
  { round: "Round 1", team1: "Sarah & Mike", team2: "Alex & Jamie", score1: 21, score2: 18, winner: "Sarah & Mike" },
  {
    round: "Round 1",
    team1: "Taylor & Jordan",
    team2: "Chris & Dana",
    score1: 21,
    score2: 15,
    winner: "Taylor & Jordan",
  },
  {
    round: "Round 1",
    team1: "Casey & Riley",
    team2: "Morgan & Avery",
    score1: 21,
    score2: 12,
    winner: "Casey & Riley",
  },
  {
    round: "Semifinals",
    team1: "Taylor & Jordan",
    team2: "Casey & Riley",
    score1: 21,
    score2: 16,
    winner: "Taylor & Jordan",
  },
  {
    round: "Semifinals",
    team1: "Sarah & Mike",
    team2: "Quinn & Blake",
    score1: 21,
    score2: 19,
    winner: "Sarah & Mike",
  },
  {
    round: "Final",
    team1: "Taylor & Jordan",
    team2: "Sarah & Mike",
    score1: 21,
    score2: 17,
    winner: "Taylor & Jordan",
  },
]

const upsetData = [
  {
    match: "Casey & Riley vs Morgan & Avery",
    expectedWinner: "Morgan & Avery",
    actualWinner: "Casey & Riley",
    upsetFactor: 3,
  },
  {
    match: "Sarah & Mike vs Quinn & Blake",
    expectedWinner: "Quinn & Blake",
    actualWinner: "Sarah & Mike",
    upsetFactor: 2,
  },
]

const pointDifferentialChart = [
  { team: "Taylor & Jordan", differential: 24, fill: "#22c55e" },
  { team: "Sarah & Mike", differential: 12, fill: "#3b82f6" },
  { team: "Casey & Riley", differential: -3, fill: "#f59e0b" },
  { team: "Alex & Jamie", differential: -8, fill: "#ef4444" },
]

const winsLossesData = [
  { name: "Wins", value: 65, fill: "#22c55e" },
  { name: "Losses", value: 35, fill: "#ef4444" },
]

export function PostTournamentReport({ tournament }: PostTournamentReportProps) {
  const shareResults = (method: "text" | "email") => {
    const results =
      `🏆 ${tournament.name} Results!\n\n` +
      `🥇 Champions: ${finalResults[0].team}\n` +
      `🥈 Runner-up: ${finalResults[1].team}\n` +
      `🥉 3rd Place: ${finalResults[2].team}\n\n` +
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

        {/* Final Standings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-orange-600" />
              Final Standings
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                              : "bg-gray-400"
                      }`}
                    >
                      {result.place}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{result.team}</div>
                      <div className="text-sm text-gray-600">
                        {result.wins}-{result.losses} record
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${result.pointDiff >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {result.pointDiff >= 0 ? "+" : ""}
                      {result.pointDiff}
                    </div>
                    <div className="text-sm text-gray-600">Point Diff</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Match Results */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Match Results</CardTitle>
            <CardDescription>Game-by-game breakdown of the entire tournament</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Round 1", "Semifinals", "Final"].map((round) => (
                <div key={round}>
                  <h3 className="font-bold text-lg mb-3 text-gray-800">{round}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {matchResults
                      .filter((match) => match.round === round)
                      .map((match, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div
                                className={`font-medium ${match.winner === match.team1 ? "text-green-700" : "text-gray-600"}`}
                              >
                                {match.team1}
                              </div>
                              <div className="text-sm text-gray-500">vs</div>
                              <div
                                className={`font-medium ${match.winner === match.team2 ? "text-green-700" : "text-gray-600"}`}
                              >
                                {match.team2}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">
                                <span className={match.winner === match.team1 ? "text-green-700" : "text-gray-600"}>
                                  {match.score1}
                                </span>
                                <span className="text-gray-400 mx-1">-</span>
                                <span className={match.winner === match.team2 ? "text-green-700" : "text-gray-600"}>
                                  {match.score2}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tournament Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Point Differential Analysis</CardTitle>
              <CardDescription>How teams performed relative to opponents</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  differential: {
                    label: "Point Differential",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pointDifferentialChart}>
                    <XAxis dataKey="team" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="differential" fill="fill" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tournament Overview</CardTitle>
              <CardDescription>Overall wins vs losses distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  wins: {
                    label: "Wins",
                    color: "#22c55e",
                  },
                  losses: {
                    label: "Losses",
                    color: "#ef4444",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={winsLossesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {winsLossesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tournament Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Tournament Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="font-bold text-lg">Biggest Victory</div>
                <div className="text-sm text-gray-600">Casey & Riley vs Morgan & Avery</div>
                <div className="text-xs text-blue-700 mt-1">9-point margin</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="font-bold text-lg">Closest Match</div>
                <div className="text-sm text-gray-600">Sarah & Mike vs Quinn & Blake</div>
                <div className="text-xs text-orange-700 mt-1">2-point thriller</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <Medal className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="font-bold text-lg">Most Consistent</div>
                <div className="text-sm text-gray-600">Taylor & Jordan</div>
                <div className="text-xs text-purple-700 mt-1">Never lost a set</div>
              </div>
            </div>

            {upsetData.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-lg mb-3">Tournament Upsets</h3>
                <div className="space-y-2">
                  {upsetData.map((upset, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="font-medium text-red-800">{upset.match}</div>
                      <div className="text-sm text-red-600">
                        Expected: {upset.expectedWinner} • Actual: {upset.actualWinner}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Share Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-green-600" />
              Share Tournament Results
            </CardTitle>
            <CardDescription>Share the results with participants and friends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button onClick={() => shareResults("text")} className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="mr-2 h-4 w-4" />
                Share via Text
              </Button>
              <Button
                onClick={() => shareResults("email")}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <Mail className="mr-2 h-4 w-4" />
                Share via Email
              </Button>
              <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
