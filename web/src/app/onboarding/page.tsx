'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [url, setUrl] = useState('')
  const [siteType, setSiteType] = useState('client')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const handleFinish = async () => {
    setIsSubmitting(true)
    
    // Save site and user info to Supabase auth metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        website_url: url,
        website_type: siteType
      }
    })

    if (error) {
      console.error('Error updating user:', error)
      setIsSubmitting(false)
      return
    }

    // Redirect to dynamic domain or dashboard root
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-2xl shadow-sm border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome to Commas</CardTitle>
          <CardDescription>
            Let's get your workspace set up in just a few steps.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="mt-6">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-semibold">1. Connect Your Website</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Website URL</label>
                <Input 
                  placeholder="https://example.com" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Website Type</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSiteType('agency')}
                    className={`flex-1 py-4 border rounded-lg text-center transition-colors ${siteType === 'agency' ? 'border-[#E06719] bg-orange-50 text-[#E06719]' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <span className="block font-semibold">Agency Site</span>
                    <span className="text-xs opacity-80">My own website</span>
                  </button>
                  <button 
                    onClick={() => setSiteType('client')}
                    className={`flex-1 py-4 border rounded-lg text-center transition-colors ${siteType === 'client' ? 'border-[#E06719] bg-orange-50 text-[#E06719]' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <span className="block font-semibold">Client Site</span>
                    <span className="text-xs opacity-80">A client I manage</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-semibold">2. Personal Information</h3>
              <p className="text-sm text-slate-500">
                How should we address you in the dashboard?
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input 
                    placeholder="John" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input 
                    placeholder="Doe" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6 mt-6">
          {step > 1 ? (
            <Button variant="ghost" onClick={handleBack} disabled={isSubmitting}>Back</Button>
          ) : (
            <div></div> // Placeholder to keep Next button on the right
          )}
          
          {step === 1 ? (
            <Button className="bg-[#E06719] hover:bg-[#c95d17] text-white" onClick={handleNext} disabled={!url}>
              Next Step
            </Button>
          ) : (
            <Button className="bg-[#E06719] hover:bg-[#c95d17] text-white" onClick={handleFinish} disabled={!firstName || !lastName || isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Finish & Enter Dashboard'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
