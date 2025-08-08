"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mic, MicOff, Copy, Trash2, Download, Check } from 'lucide-react'

// Supported languages for speech recognition
const SUPPORTED_LANGUAGES = [
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "es-ES", name: "Spanish (Spain)" },
    { code: "es-MX", name: "Spanish (Mexico)" },
    { code: "fr-FR", name: "French (France)" },
    { code: "de-DE", name: "German (Germany)" },
    { code: "it-IT", name: "Italian (Italy)" },
    { code: "pt-BR", name: "Portuguese (Brazil)" },
    { code: "ru-RU", name: "Russian" },
    { code: "ja-JP", name: "Japanese" },
    { code: "ko-KR", name: "Korean" },
    { code: "zh-CN", name: "Chinese (Mandarin)" },
    { code: "hi-IN", name: "Hindi (India)" },
    { code: "ar-SA", name: "Arabic (Saudi Arabia)" },
    { code: "nl-NL", name: "Dutch (Netherlands)" },
    { code: "sv-SE", name: "Swedish (Sweden)" },
    { code: "da-DK", name: "Danish (Denmark)" },
    { code: "no-NO", name: "Norwegian (Norway)" },
    { code: "fi-FI", name: "Finnish (Finland)" },
    { code: "pl-PL", name: "Polish (Poland)" },
]

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
    resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string
    message: string
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    start(): void
    stop(): void
    abort(): void
    onstart: ((this: SpeechRecognition, ev: Event) => void) | null
    onend: ((this: SpeechRecognition, ev: Event) => void) | null
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition
        webkitSpeechRecognition: new () => SpeechRecognition
    }
}

export default function SpeechToTextApp() {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [interimTranscript, setInterimTranscript] = useState("")
    const [selectedLanguage, setSelectedLanguage] = useState("en-US")
    const [isSupported, setIsSupported] = useState(true)
    const [error, setError] = useState("")
    const [confidence, setConfidence] = useState<number | null>(null)
    const [copySuccess, setCopySuccess] = useState(false)
    const [downloadSuccess, setDownloadSuccess] = useState(false)

    const recognitionRef = useRef<SpeechRecognition | null>(null)

    useEffect(() => {
        // Check if speech recognition is supported
        if (typeof window !== "undefined") {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (!SpeechRecognition) {
                setIsSupported(false)
                setError("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.")
                return
            }

            // Initialize speech recognition
            const recognition = new SpeechRecognition()
            recognition.continuous = true
            recognition.interimResults = true
            recognition.lang = selectedLanguage

            recognition.onstart = () => {
                setIsListening(true)
                setError("")
            }

            recognition.onend = () => {
                setIsListening(false)
                setInterimTranscript("")
            }

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let finalTranscript = ""
                let interimText = ""

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i]
                    if (result.isFinal) {
                        finalTranscript += result[0].transcript
                        setConfidence(result[0].confidence)
                    } else {
                        interimText += result[0].transcript
                    }
                }

                if (finalTranscript) {
                    setTranscript(prev => prev + finalTranscript + " ")
                }
                setInterimTranscript(interimText)
            }

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                setError(`Speech recognition error: ${event.error}`)
                setIsListening(false)

                if (event.error === "not-allowed") {
                    setError("Microphone access denied. Please allow microphone access and try again.")
                } else if (event.error === "no-speech") {
                    setError("No speech detected. Please try speaking again.")
                }
            }

            recognitionRef.current = recognition
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
    }, [selectedLanguage])

    const startListening = async () => {
        if (!recognitionRef.current || !isSupported) return

        try {
            // Request microphone permission
            await navigator.mediaDevices.getUserMedia({ audio: true })

            setError("")
            recognitionRef.current.lang = selectedLanguage
            recognitionRef.current.start()
        } catch {
            setError("Microphone access denied. Please allow microphone access and try again.")
        }
    }

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
        }
    }

    const clearTranscript = () => {
        setTranscript("")
        setInterimTranscript("")
        setConfidence(null)
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(transcript)
            setCopySuccess(true)
            setTimeout(() => setCopySuccess(false), 2000)
        } catch (err) {
            // Handle error silently or show error state
            console.error('Failed to copy to clipboard:', err)
        }
    }

    const downloadTranscript = () => {
        try {
            const element = document.createElement("a")
            const file = new Blob([transcript], { type: "text/plain" })
            element.href = URL.createObjectURL(file)
            element.download = `transcript-${new Date().toISOString().split('T')[0]}.txt`
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)

            setDownloadSuccess(true)
            setTimeout(() => setDownloadSuccess(false), 2000)
        } catch (err) {
            console.error('Failed to download transcript:', err)
        }
    }

    if (!isSupported) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-red-600">Not Supported</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Alert>
                            <AlertDescription>
                                Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari for the best experience.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto space-y-6 my-12">
                <div className="text-center space-y-2 mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">Speech to Text</h1>
                    <p className="text-lg text-gray-600">Convert your speech to text in multiple languages</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Language Selection
                        </CardTitle>
                        <CardDescription>
                            Choose your preferred language for speech recognition
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent>
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <SelectItem key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Recording Controls</span>
                            {isListening && (
                                <Badge variant="secondary" className="animate-pulse">
                                    Listening...
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4 justify-center">
                            <Button
                                onClick={isListening ? stopListening : startListening}
                                size="lg"
                                variant={isListening ? "destructive" : "default"}
                                className="flex items-center gap-2"
                            >
                                {isListening ? (
                                    <>
                                        <MicOff className="h-5 w-5" />
                                        Stop Recording
                                    </>
                                ) : (
                                    <>
                                        <Mic className="h-5 w-5" />
                                        Start Recording
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={clearTranscript}
                                variant="outline"
                                size="lg"
                                disabled={!transcript}
                                className="flex items-center gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear
                            </Button>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Transcript</span>
                            <div className="flex gap-2">
                                <Button
                                    onClick={copyToClipboard}
                                    variant="outline"
                                    size="sm"
                                    disabled={!transcript}
                                    className={`flex items-center gap-1 transition-colors ${copySuccess ? 'bg-green-100 text-green-700 border-green-300' : ''}`}
                                >
                                    {copySuccess ? (
                                        <>
                                            <Check className="h-4 w-4 animate-pulse" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={downloadTranscript}
                                    variant="outline"
                                    size="sm"
                                    disabled={!transcript}
                                    className={`flex items-center gap-1 transition-colors ${downloadSuccess ? 'bg-green-100 text-green-700 border-green-300' : ''}`}
                                >
                                    {downloadSuccess ? (
                                        <>
                                            <Check className="h-4 w-4 animate-pulse" />
                                            Downloaded!
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4" />
                                            Download
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={transcript + interimTranscript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Your speech will appear here..."
                            className="min-h-[200px] text-lg"
                            rows={10}
                        />
                        {confidence && (
                            <Badge variant="outline" className="p-2 my-4">
                                Confidence: {Math.round(confidence * 100)}%
                            </Badge>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>How to Use</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                            <li>Select your preferred language from the dropdown above</li>
                            <li>Click &quot;Start Recording&quot; and allow microphone access when prompted</li>
                            <li>Speak clearly into your microphone</li>
                            <li>Your speech will be converted to text in real-time</li>
                            <li>Click &quot;Stop Recording&quot; when finished</li>
                            <li>Use the Copy or Download buttons to save your transcript</li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
