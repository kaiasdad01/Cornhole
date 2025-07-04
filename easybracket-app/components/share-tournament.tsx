"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Check } from "lucide-react"

interface ShareTournamentProps {
  tournament: any
}

export function ShareTournament({ tournament }: ShareTournamentProps) {
  const [copied, setCopied] = useState(false)
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-blue-600" />
          Share Tournament
        </CardTitle>
        <CardDescription>
          Share this link with spectators to let them follow the tournament live
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Public Tournament Link</div>
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={copyToClipboard}
              className="shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">Public viewers can:</div>
            <ul className="text-xs space-y-1">
              <li>• View tournament brackets and results</li>
              <li>• Follow live match updates</li>
              <li>• See team rosters and statistics</li>
              <li>• Access tournament reports</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="text-sm text-orange-800">
            <div className="font-medium mb-1">Note:</div>
            <div className="text-xs">
              This tournament is currently stored locally in your browser. 
              In production with a database, this link would work for everyone.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}