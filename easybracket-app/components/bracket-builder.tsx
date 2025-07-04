"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Shuffle, Play, Settings, Eye } from "lucide-react"
import { BracketVisualization } from "./bracket-visualization"

interface Tournament {
  name: string
  date: string
  location: string
  teams: Array<{ id: string; name: string; players: string[] }>
}

interface BracketBuilderProps {
  tournament: Tournament
  onNext: () => void
}

export function BracketBuilder({ tournament, onNext }: BracketBuilderProps) {
  const [bracketType, setBracketType] = useState<string>("single-elimination")
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [seededTeams, setSeededTeams] = useState(tournament.teams)
  const [showBracket, setShowBracket] = useState(false)

  const bracketTypes = [
    { value: "single-elimination", label: "Single Elimination", description: "One loss and you're out" },
    { value: "double-elimination", label: "Double Elimination", description: "Two losses to be eliminated" },
    { value: "group-stage", label: "Group Stage", description: "Round-robin followed by playoffs" },
  ]

  const regions = ["Inlet Rd", "Yarmouth Ct", "The WooHoo", "Delaware Bay Oyster House"]

  const shuffleSeeds = () => {
    const shuffled = [...seededTeams].sort(() => Math.random() - 0.5)
    setSeededTeams(shuffled)
  }

  const moveTeamUp = (index: number) => {
    if (index > 0) {
      const newSeeds = [...seededTeams]
      ;[newSeeds[index], newSeeds[index - 1]] = [newSeeds[index - 1], newSeeds[index]]
      setSeededTeams(newSeeds)
    }
  }

  const moveTeamDown = (index: number) => {
    if (index < seededTeams.length - 1) {
      const newSeeds = [...seededTeams]
      ;[newSeeds[index], newSeeds[index + 1]] = [newSeeds[index + 1], newSeeds[index]]
      setSeededTeams(newSeeds)
    }
  }

  if (showBracket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setShowBracket(false)}>
              ← Back to Setup
            </Button>
            <h1 className="text-2xl font-bold">Bracket Preview</h1>
            <div></div>
          </div>
          <BracketVisualization 
            tournament={{ ...tournament, id: tournament.name, teams: seededTeams }}
            isAdmin={false}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Bracket Builder</h1>
          <p className="text-gray-600">
            {tournament.name} • {tournament.teams.length} Teams
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bracket Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Bracket Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tournament Format</label>
                  <Select value={bracketType} onValueChange={setBracketType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bracketTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bracket Region (Optional)</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region..." />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => setShowBracket(true)} 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Bracket
                  </Button>
                  <Button onClick={onNext} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                    <Play className="mr-2 h-4 w-4" />
                    Start Tournament
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bracket Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bracket Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <Badge variant="secondary">{bracketTypes.find((t) => t.value === bracketType)?.label}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Teams:</span>
                    <span className="font-medium">{tournament.teams.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rounds:</span>
                    <span className="font-medium">{Math.ceil(Math.log2(tournament.teams.length))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Matches:</span>
                    <span className="font-medium">
                      {bracketType === "single-elimination"
                        ? tournament.teams.length - 1
                        : bracketType === "double-elimination"
                          ? (tournament.teams.length - 1) * 2 - 1
                          : "TBD"}
                    </span>
                  </div>
                  {selectedRegion && (
                    <div className="flex justify-between">
                      <span>Region:</span>
                      <span className="font-medium">{selectedRegion}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Seeding */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-orange-600" />
                    Team Seeding
                  </span>
                  <Button
                    onClick={shuffleSeeds}
                    variant="outline"
                    size="sm"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
                  >
                    <Shuffle className="mr-2 h-4 w-4" />
                    Shuffle
                  </Button>
                </CardTitle>
                <CardDescription>Drag teams to reorder seeding, or use shuffle for random seeding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {seededTeams.map((team, index) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            #{index + 1}
                          </Badge>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{team.name}</div>
                          <div className="text-sm text-gray-600">{team.players.join(" & ")}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveTeamUp(index)}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveTeamDown(index)}
                          disabled={index === seededTeams.length - 1}
                          className="h-8 w-8 p-0"
                        >
                          ↓
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bracket Visualization Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Bracket Layout Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-center text-gray-500 py-8">
                <Trophy className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Bracket visualization will appear here</p>
                <p className="text-sm">Click "Start Tournament" to generate the full bracket</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
