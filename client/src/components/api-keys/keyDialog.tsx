import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/dialog'
import axios from 'axios';
import { useSession } from 'next-auth/react';

const KeyDialog = ({ isOpen, setIsOpen, apiKeys, setApiKeys }: { isOpen: boolean, setIsOpen: (open: boolean) => void, apiKeys: any, setApiKeys: (keys: any) => void }) => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
 
  const [showKeys, setShowKeys] = useState({
    groq: false,
    gemini: false,
    openai: false,
    anthropic: false
  });
  
  const handleSave = async() => {
    setLoading(true);
    Promise.all([
      apiKeys.groq && axios.post('/api/api-key', {
        apiKey: apiKeys.groq,
        provider: 'groq',
        userId:session?.user.id
      }),
      apiKeys.gemini && axios.post('/api/api-key', {
        apiKey: apiKeys.gemini,
        provider: 'gemini',
        userId: session?.user.id
      }),
      apiKeys.openai && axios.post('/api/api-key', {
        apiKey: apiKeys.openai,
        provider: 'openai',
        userId: session?.user.id
      }),
      apiKeys.anthropic && axios.post('/api/api-key', {
        apiKey: apiKeys.anthropic,
        provider: 'anthropic',
        userId: session?.user.id
      })
    ]);
    setLoading(false);
    setIsOpen(false);
  };



  const handleInputChange = (key: keyof typeof apiKeys, value: string) => {
    setApiKeys((prev:any) => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleShowKey = (key: keyof typeof showKeys) => {
    setShowKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>Open Key Dialog</DialogTrigger>
      <DialogContent>
        <DialogTitle>API Keys</DialogTitle>
        <DialogDescription>
          <div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Groq API Key</label>
              <div className="relative">
                <input
                  type={showKeys.groq ? "text" : "password"}
                  value={apiKeys.groq}
                  onChange={(e) => handleInputChange('groq', e.target.value)}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => toggleShowKey('groq')}
                >
                  {showKeys.groq ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Gemini API Key Input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gemini API Key</label>
              <div className="relative">
                <input
                  type={showKeys.gemini ? "text" : "password"}
                  value={apiKeys.gemini}
                  onChange={(e) => handleInputChange('gemini', e.target.value)}
                  placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => toggleShowKey('gemini')}
                >
                  {showKeys.gemini ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* OpenAI API Key Input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
              <div className="relative">
                <input
                  type={showKeys.openai ? "text" : "password"}
                  value={apiKeys.openai}
                  onChange={(e) => handleInputChange('openai', e.target.value)}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => toggleShowKey('openai')}
                >
                  {showKeys.openai ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Anthropic API Key Input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Anthropic API Key</label>
              <div className="relative">
                <input
                  type={showKeys.anthropic ? "text" : "password"}
                  value={apiKeys.anthropic}
                  onChange={(e) => handleInputChange('anthropic', e.target.value)}
                  placeholder="sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => toggleShowKey('anthropic')}
                >
                  {showKeys.anthropic ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 bg-zinc-900 border-t border-gray-100">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Save Keys
            </button>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default KeyDialog