"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestButtons() {
  const handleClick = (buttonName: string) => {
    console.log(`${buttonName} clicked!`)
    alert(`${buttonName} clicked successfully!`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Button Test Page</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Basic Button Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => handleClick("Primary Button")}
              className="w-full"
            >
              Primary Button
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => handleClick("Outline Button")}
              className="w-full"
            >
              Outline Button
            </Button>
            
            <Button 
              variant="secondary"
              onClick={() => handleClick("Secondary Button")}
              className="w-full"
            >
              Secondary Button
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navigation Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => handleClick("Teams Button")}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Teams Button
            </Button>
            
            <Button 
              onClick={() => handleClick("Bracket Button")}
              variant="outline"
              className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Bracket Button
            </Button>
            
            <Button 
              onClick={() => handleClick("Live Button")}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Live Button
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Open your browser's developer console (F12) to see click events logged.
              If buttons don't work, check for JavaScript errors in the console.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 