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
  const [byokEmail, setByokEmail] = useState('')
  const [byokKey, setByokKey] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const handleFinish = async () => {
    // In a real app, this would save to Supabase via an API route or server action
    // We will mock the subscription and redirect to dashboard
    
    // Save site and BYOK securely...
    
    // Redirect to dynamic domain or dashboard root
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-2xl shadow-sm border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome to Comma</CardTitle>
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
              <h3 className="text-lg font-semibold">2. Connect Free Data Sources</h3>
              <p className="text-sm text-slate-500">
                Comma uses these free integrations to pull in your sitemaps, indexation status, and traffic data so we don't have to guess.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 justify-start px-4">
                  <div className="w-8 h-8 rounded bg-slate-100 mr-4 flex items-center justify-center">G</div>
                  <div className="text-left">
                    <div className="font-semibold">Google Search Console</div>
                    <div className="text-xs text-slate-500">Not Connected</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-16 justify-start px-4">
                  <div className="w-8 h-8 rounded bg-slate-100 mr-4 flex items-center justify-center">A</div>
                  <div className="text-left">
                    <div className="font-semibold">Google Analytics 4</div>
                    <div className="text-xs text-slate-500">Not Connected</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-16 justify-start px-4">
                  <div className="w-8 h-8 rounded bg-slate-100 mr-4 flex items-center justify-center">M</div>
                  <div className="text-left">
                    <div className="font-semibold">Microsoft Webmaster</div>
                    <div className="text-xs text-slate-500">Not Connected</div>
                  </div>
                </Button>

                <Button variant="outline" className="h-16 justify-start px-4">
                  <div className="w-8 h-8 rounded bg-slate-100 mr-4 flex items-center justify-center">W</div>
                  <div className="text-left">
                    <div className="font-semibold">CMS (WordPress/Webflow)</div>
                    <div className="text-xs text-slate-500">Not Connected</div>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-semibold">3. Google Indexing BYOK</h3>
              <p className="text-sm text-slate-500">
                To bypass standard rate limits (200 URLs/day), provide your own Google Service Account JSON credentials.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service Account Email</label>
                  <Input 
                    placeholder="indexing-agent@your-project.iam.gserviceaccount.com" 
                    value={byokEmail}
                    onChange={(e) => setByokEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Private Key</label>
                  <textarea 
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n"
                    value={byokKey}
                    onChange={(e) => setByokKey(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6 mt-6">
          {step > 1 ? (
            <Button variant="ghost" onClick={handleBack}>Back</Button>
          ) : (
            <div></div> // Placeholder to keep Next button on the right
          )}
          
          {step < 3 ? (
            <Button className="bg-[#E06719] hover:bg-[#c95d17] text-white" onClick={handleNext} disabled={step === 1 && !url}>
              Next Step
            </Button>
          ) : (
            <Button className="bg-[#E06719] hover:bg-[#c95d17] text-white" onClick={handleFinish}>
              Finish & Extract Site
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
