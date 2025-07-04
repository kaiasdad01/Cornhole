import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export class PDFExportService {
  static async generateTournamentReport(
    tournament: any,
    teams: any[],
    matches: any[]
  ): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Title
    pdf.setFontSize(20)
    pdf.text('Tournament Report', pageWidth / 2, 20, { align: 'center' })
    
    // Tournament Info
    pdf.setFontSize(16)
    pdf.text(tournament.name, pageWidth / 2, 35, { align: 'center' })
    
    pdf.setFontSize(12)
    pdf.text(`Date: ${tournament.date}`, 20, 50)
    pdf.text(`Location: ${tournament.location}`, 20, 57)
    pdf.text(`Teams: ${teams.length}`, 20, 64)
    
    const completedMatches = matches.filter(m => m.status === 'completed')
    pdf.text(`Matches Played: ${completedMatches.length}`, 20, 71)
    
    // Results Section
    let yPosition = 85
    pdf.setFontSize(14)
    pdf.text('Final Results', 20, yPosition)
    
    // Sort teams by performance (wins, then point differential)
    const teamStats = teams.map(team => {
      const teamMatches = completedMatches.filter(m => 
        m.team1_id === team.id || m.team2_id === team.id
      )
      
      let wins = 0
      let pointsFor = 0
      let pointsAgainst = 0
      
      teamMatches.forEach(match => {
        const isTeam1 = match.team1_id === team.id
        const ourScore = isTeam1 ? match.team1_score : match.team2_score
        const theirScore = isTeam1 ? match.team2_score : match.team1_score
        
        pointsFor += ourScore
        pointsAgainst += theirScore
        if (ourScore > theirScore) wins++
      })
      
      return {
        ...team,
        wins,
        losses: teamMatches.length - wins,
        pointsFor,
        pointsAgainst,
        differential: pointsFor - pointsAgainst
      }
    }).sort((a, b) => {
      if (a.wins !== b.wins) return b.wins - a.wins
      return b.differential - a.differential
    })
    
    // Team standings
    yPosition += 10
    pdf.setFontSize(10)
    teamStats.forEach((team, index) => {
      const text = `${index + 1}. ${team.name} (${team.wins}-${team.losses}, +${team.differential})`
      pdf.text(text, 25, yPosition)
      yPosition += 7
    })
    
    // Match Results
    yPosition += 10
    pdf.setFontSize(14)
    pdf.text('Match Results', 20, yPosition)
    yPosition += 10
    
    pdf.setFontSize(9)
    completedMatches.forEach(match => {
      const team1 = teams.find(t => t.id === match.team1_id)?.name || 'Unknown'
      const team2 = teams.find(t => t.id === match.team2_id)?.name || 'Unknown'
      
      const text = `${team1} ${match.team1_score} - ${match.team2_score} ${team2}`
      pdf.text(text, 25, yPosition)
      yPosition += 6
      
      // Check if we need a new page
      if (yPosition > pageHeight - 20) {
        pdf.addPage()
        yPosition = 20
      }
    })
    
    // Save the PDF
    pdf.save(`${tournament.name.replace(/\s+/g, '_')}_Report.pdf`)
  }
  
  static async exportBracketImage(elementId: string, filename: string): Promise<void> {
    const element = document.getElementById(elementId)
    if (!element) return
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('l', 'mm', 'a4')
    
    const imgWidth = 297 // A4 landscape width
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(filename)
  }
} 