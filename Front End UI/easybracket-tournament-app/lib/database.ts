import { supabase } from './supabase'
import type { Tournament, Team, Match, SoloPlayer } from './supabase'

export class DatabaseService {
  // Tournament operations
  static async createTournament(tournament: Omit<Tournament, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tournaments')
      .insert(tournament)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getTournament(id: string) {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        teams(*),
        matches(*),
        solo_players(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async updateTournament(id: string, updates: Partial<Tournament>) {
    const { data, error } = await supabase
      .from('tournaments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Team operations
  static async addTeam(team: Omit<Team, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('teams')
      .insert(team)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async removeTeam(id: string) {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  static async updateTeamSeeds(teams: { id: string; seed: number }[]) {
    const updates = teams.map(team => 
      supabase
        .from('teams')
        .update({ seed: team.seed })
        .eq('id', team.id)
    )
    
    await Promise.all(updates)
  }

  // Solo player operations
  static async addSoloPlayer(player: Omit<SoloPlayer, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('solo_players')
      .insert(player)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async removeSoloPlayer(id: string) {
    const { error } = await supabase
      .from('solo_players')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  static async autoGroupSoloPlayers(tournamentId: string) {
    const { data: soloPlayers, error } = await supabase
      .from('solo_players')
      .select('*')
      .eq('tournament_id', tournamentId)
      .eq('paired', false)
      .order('created_at')
    
    if (error) throw error
    
    const teams = []
    for (let i = 0; i < soloPlayers.length - 1; i += 2) {
      const player1 = soloPlayers[i]
      const player2 = soloPlayers[i + 1]
      
      const team = await this.addTeam({
        tournament_id: tournamentId,
        name: `${player1.name} / ${player2.name}`,
        players: [player1.name, player2.name]
      })
      
      teams.push(team)
      
      // Mark players as paired
      await supabase
        .from('solo_players')
        .update({ paired: true })
        .in('id', [player1.id, player2.id])
    }
    
    return teams
  }

  // Match operations
  static async createMatches(matches: Omit<Match, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data, error } = await supabase
      .from('matches')
      .insert(matches)
      .select()
    
    if (error) throw error
    return data
  }

  static async updateMatch(id: string, updates: Partial<Match>) {
    const { data, error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getMatches(tournamentId: string) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        team1:team1_id(*),
        team2:team2_id(*)
      `)
      .eq('tournament_id', tournamentId)
      .order('round_number', { ascending: true })
      .order('match_number', { ascending: true })
    
    if (error) throw error
    return data
  }

  // Real-time subscriptions
  static subscribeTournamentChanges(tournamentId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`tournament-${tournamentId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'matches',
        filter: `tournament_id=eq.${tournamentId}`
      }, callback)
      .subscribe()
  }
} 