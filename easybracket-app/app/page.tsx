"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Trophy, Plus, Settings, LogIn, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { DatabaseService } from "@/lib/database"
import { TeamEntry } from "@/components/team-entry"
import { BracketBuilder } from "@/components/bracket-builder"
import { LiveDashboard } from "@/components/live-dashboard"
import { AdminPortal } from "@/components/admin-portal"
import { PostTournamentReport } from "@/components/post-tournament-report"
import { EmailAuth } from "@/components/email-auth"
import { CreateTournament } from "@/components/create-tournament"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/toaster"

type Page = "home" | "teams" | "bracket" | "live" | "admin" | "report" | "create-tournament" | "auth"

export default function EasyBracketApp() {
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [tournament, setTournament] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('App initializing...')
    
    // Check if Supabase is available
    if (supabase) {
      console.log('Supabase is available')
      // Check for existing session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setIsAdmin(!!session?.user)
        setLoading(false)
      })

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ?? null)
          setIsAdmin(!!session?.user)
        }
      )

      return () => subscription.unsubscribe()
    } else {
      console.log('Supabase not available - running in demo mode')
      // No Supabase - just set loading to false
      setLoading(false)
    }
  }, [])

  const handleAuthSuccess = () => {
    setCurrentPage("home")
  }

  const handleCreateTournament = (newTournament: any) => {
    setTournament(newTournament)
    setCurrentPage("home")
  }

  const signOut = async () => {
    if (!supabase) {
      toast.error("Authentication not available")
      return
    }
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error: any) {
      toast.error(`Sign Out Error: ${error.message}`)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  // Render different pages based on currentPage
  if (currentPage === "create-tournament") {
    return <CreateTournament onTournamentCreated={handleCreateTournament} onBack={() => setCurrentPage("home")} />
  }

  if (currentPage === "teams") {
    return (
      <TeamEntry 
        tournament={tournament} 
        setTournament={setTournament} 
        onNext={() => setCurrentPage("bracket")}
      />
    )
  }

  if (currentPage === "bracket") {
    return (
      <BracketBuilder 
        tournament={tournament} 
        onNext={() => setCurrentPage("live")}
      />
    )
  }

  if (currentPage === "live") {
    return <LiveDashboard tournament={tournament} />
  }

  if (currentPage === "admin") {
    return isAdmin ? (
      <AdminPortal tournament={tournament} />
    ) : (
      <div className="text-center py-8">
        <p>Admin access required</p>
        <Button onClick={() => setCurrentPage("auth")} className="mt-4">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In to Continue
        </Button>
      </div>
    )
  }

  if (currentPage === "auth") {
    return <EmailAuth onSuccess={handleAuthSuccess} />
  }

  if (currentPage === "report") {
    return <PostTournamentReport tournament={tournament} />
  }

  // Default home page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => setCurrentPage("home")} className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-orange-500" />
            <span className="font-bold">EasyBracket</span>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant={currentPage === "teams" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentPage("teams")}
            >
              Teams
            </Button>
            <Button
              variant={currentPage === "bracket" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentPage("bracket")}
            >
              Bracket
            </Button>
            <Button
              variant={currentPage === "live" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentPage("live")}
            >
              Live
            </Button>
            {isAdmin && (
              <Button
                variant={currentPage === "admin" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage("admin")}
              >
                Admin
              </Button>
            )}
            <Button
              variant={currentPage === "report" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentPage("report")}
            >
              Report
            </Button>
            
            {/* Auth Button */}
            {user ? (
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setCurrentPage("auth")}>
                <LogIn className="h-4 w-4 mr-2" />
                Admin Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4 py-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="h-8 w-8 text-orange-500" />
              <h1 className="text-4xl font-bold text-gray-900">EasyBracket</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The simplest way to manage your casual sports tournaments. Perfect for Cornhole, Pickleball, and more!
            </p>
          </div>

          {!tournament ? (
            // No tournament - show create button
            <div className="text-center space-y-8 py-16">
              <Button
                onClick={() => setCurrentPage("create-tournament")}
                className="bg-orange-500 hover:bg-orange-600 text-white h-14 px-8"
                size="lg"
              >
                <Plus className="mr-2 h-6 w-6" />
                Create Your First Tournament
              </Button>
            </div>
          ) : (
            // Has tournament - show tournament info
            <>
              {/* Current Tournament Card */}
              <Card className="border-2 border-orange-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-blue-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl text-gray-900">{tournament.name}</CardTitle>
                      <CardDescription className="text-gray-700 mt-2">
                        <div className="flex flex-col sm:flex-row gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{tournament.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{tournament.location}</span>
                          </div>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {tournament.status === 'setup' ? 'Setup' : 
                       tournament.status === 'active' ? 'Active' : 'Completed'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold text-blue-600">{tournament.teams?.length || 0}</div>
                      <div className="text-sm text-gray-600">Teams Registered</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Trophy className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                      <div className="text-2xl font-bold text-orange-600">
                        {tournament.matches?.filter((m: any) => m.status === 'completed').length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Matches Played</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Settings className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold text-green-600">
                        {tournament.status === 'setup' ? 'Setup' : 
                         tournament.status === 'active' ? 'Live' : 'Done'}
                      </div>
                      <div className="text-sm text-gray-600">Tournament Status</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      onClick={() => setCurrentPage("teams")}
                      className="bg-orange-500 hover:bg-orange-600 text-white h-12"
                      size="lg"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      {isAdmin ? 'Manage Teams' : 'View Teams'}
                    </Button>
                    <Button
                      onClick={() => setCurrentPage("bracket")}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-50 h-12"
                      size="lg"
                    >
                      <Trophy className="mr-2 h-5 w-5" />
                      View Bracket
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 border-blue-200 hover:bg-blue-50 bg-transparent"
                  onClick={() => setCurrentPage("live")}
                >
                  <Trophy className="h-6 w-6 text-blue-600" />
                  <span className="text-sm">Live Dashboard</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 border-green-200 hover:bg-green-50 bg-transparent"
                  onClick={() => setCurrentPage("admin")}
                >
                  <Settings className="h-6 w-6 text-green-600" />
                  <span className="text-sm">Admin Portal</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 border-purple-200 hover:bg-purple-50 bg-transparent"
                  onClick={() => setCurrentPage("report")}
                >
                  <Calendar className="h-6 w-6 text-purple-600" />
                  <span className="text-sm">Tournament Report</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 border-orange-200 hover:bg-orange-50 bg-transparent"
                  onClick={() => setCurrentPage("create-tournament")}
                >
                  <Plus className="h-6 w-6 text-orange-600" />
                  <span className="text-sm">New Tournament</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
