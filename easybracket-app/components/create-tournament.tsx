"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Calendar, MapPin, Trophy, ArrowLeft } from "lucide-react"

interface CreateTournamentProps {
  onTournamentCreated: (tournament: any) => void
  onBack: () => void
}

export function CreateTournament({ onTournamentCreated, onBack }: CreateTournamentProps) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    bracket_type: "single-elimination" as const,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create new tournament object
      const newTournament = {
        id: Date.now().toString(), // Simple ID for demo
        name: formData.name,
        date: formData.date,
        location: formData.location,
        status: 'setup' as const,
        bracket_type: formData.bracket_type,
        created_by: 'user', // Will be replaced with actual user ID
        teams: [],
        matches: [],
        solo_players: [],
        created_at: new Date().toISOString(),
      }

      // In a real app, you'd save this to Supabase here
      // const { data, error } = await supabase
      //   .from('tournaments')
      //   .insert([newTournament])
      //   .select()
      //   .single()

      toast.success("Tournament created successfully!")
      onTournamentCreated(newTournament)
    } catch (error: any) {
      toast.error("Failed to create tournament")
      console.error('Error creating tournament:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-blue-100">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-2xl text-gray-900">Create New Tournament</CardTitle>
                <CardDescription className="text-gray-700">
                  Set up your tournament details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Tournament Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Summer Cornhole Championship"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="e.g., Sunset Beach Park"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bracket_type">Bracket Type</Label>
                <Select
                  value={formData.bracket_type}
                  onValueChange={(value: any) => setFormData({ ...formData, bracket_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bracket type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-elimination">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Single Elimination
                      </div>
                    </SelectItem>
                    <SelectItem value="double-elimination">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Double Elimination
                      </div>
                    </SelectItem>
                    <SelectItem value="round-robin">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Round Robin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Tournament"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 