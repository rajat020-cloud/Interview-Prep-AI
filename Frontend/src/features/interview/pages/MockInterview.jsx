import React, { useState, useEffect, useRef } from 'react'
import { useInterview } from '../hooks/useInterview'
import {
    Mic,
    MicOff,
    PhoneOff,
    Video,
    VideoOff,
    Send,
    Sparkles,
    Clock,
    Award,
    CheckCircle2,
    RefreshCw,
    Play,
    Pause,
    Volume2,
    VolumeX,
    RotateCcw,
    Camera,
    Loader2
} from 'lucide-react'
import '../style/mock.scss'

const MockInterview = () => {
    const { startMockInterview, submitMockAnswer } = useInterview()

    const [session, setSession] = useState(null)
    const [role, setRole] = useState('Full-Stack Developer')
    const [company, setCompany] = useState('AVBT Technologies')
    const [difficulty, setDifficulty] = useState('Medium')
    const [userAnswer, setUserAnswer] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [starting, setStarting] = useState(false)
    const [timerSeconds, setTimerSeconds] = useState(15 * 60)

    // Camera & Voice State
    const [isRecording, setIsRecording] = useState(false)
    const [cameraActive, setCameraActive] = useState(true)
    const [cameraError, setCameraError] = useState('')
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [isSpeaking, setIsSpeaking] = useState(false)

    const userVideoRef = useRef(null)
    const mediaStreamRef = useRef(null)
    const recognitionRef = useRef(null)

    // Countdown Timer
    useEffect(() => {
        let timer
        if (session && session.status === 'in_progress') {
            timer = setInterval(() => {
                setTimerSeconds(prev => Math.max(0, prev - 1))
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [session])

    // Setup User Webcam Video Stream
    useEffect(() => {
        if (session && session.status === 'in_progress' && cameraActive) {
            startCamera()
        } else {
            stopCamera()
        }
        return () => stopCamera()
    }, [session?.status, cameraActive])

    const startCamera = async () => {
        setCameraError('')
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
                    audio: false // audio handled separately for dictation
                })
                mediaStreamRef.current = stream
                if (userVideoRef.current) {
                    userVideoRef.current.srcObject = stream
                }
            }
        } catch (err) {
            console.warn("Camera access denied or unavailable:", err.message)
            setCameraError("Camera unavailable or permission denied. You can continue interview mode.")
        }
    }

    const stopCamera = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop())
            mediaStreamRef.current = null
        }
    }

    // Text-to-Speech (TTS) Voice Synthesis
    const speakText = (textToSpeak) => {
        if (!soundEnabled || !('speechSynthesis' in window)) return

        window.speechSynthesis.cancel() // Stop any previous speech
        const utterance = new SpeechSynthesisUtterance(textToSpeak)
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.lang = 'en-US'

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        window.speechSynthesis.speak(utterance)
    }

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel()
            setIsSpeaking(false)
        }
    }

    // Speak newly displayed question automatically
    useEffect(() => {
        if (session && session.status === 'in_progress') {
            const currentQ = session.questions?.[session.currentQuestionIndex]
            if (currentQ?.questionText) {
                speakText(currentQ.questionText)
            }
        }
        return () => stopSpeaking()
    }, [session?.currentQuestionIndex, session?.status])

    // Speech-to-text recognition setup
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = true
            recognitionRef.current.interimResults = true

            recognitionRef.current.onresult = (event) => {
                let transcript = ''
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript
                }
                setUserAnswer(prev => prev + ' ' + transcript)
            }

            recognitionRef.current.onerror = (e) => {
                console.warn("Speech recognition error:", e.error)
                setIsRecording(false)
            }
        }
    }, [])

    const toggleSpeechRecognition = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser. Please type your answer.")
            return
        }
        if (isRecording) {
            recognitionRef.current.stop()
            setIsRecording(false)
        } else {
            recognitionRef.current.start()
            setIsRecording(true)
        }
    }

    const formatTimer = (secs) => {
        const m = Math.floor(secs / 60)
        const s = secs % 60
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
    }

    const handleStart = async () => {
        setStarting(true)
        try {
            const res = await startMockInterview({ role, company, difficulty, durationMinutes: 15 })
            setSession(res.session)
            setTimerSeconds(15 * 60)
            setUserAnswer('')
        } catch (err) {
            alert("Could not start mock session: " + err.message)
        } finally {
            setStarting(false)
        }
    }

    const handleSubmitAnswer = async () => {
        if (!userAnswer.trim()) {
            alert("Please type or speak your answer before submitting.")
            return
        }
        if (isRecording && recognitionRef.current) {
            recognitionRef.current.stop()
            setIsRecording(false)
        }
        stopSpeaking()

        setSubmitting(true)
        const answerToSubmit = userAnswer
        try {
            const res = await submitMockAnswer(session._id, answerToSubmit)
            setSession(res.session)
            setUserAnswer('')
        } catch (err) {
            alert("Failed to evaluate answer: " + err.message)
        } finally {
            setSubmitting(false)
        }
    }

    const currentQ = session?.questions?.[session.currentQuestionIndex]
    const latestFeedback = session?.currentQuestionIndex > 0
        ? session.questions[session.currentQuestionIndex - 1]?.feedback
        : null

    return (
        <div className="mock-interview-page">
            {/* Header */}
            <div className="mock-header">
                <div>
                    <h1>Live AI Mock Interview</h1>
                    <p>Practice realistic, timed interview questions with real-time camera feedback, voice dictation, and spoken sound.</p>
                </div>
                {session && session.status === 'in_progress' && (
                    <div className="mock-live-status">
                        <span className="live-pill">
                            <span className="live-dot" /> LIVE
                        </span>
                        <span className="q-progress-pill">
                            Question {session.currentQuestionIndex + 1} of {session.questions.length}
                        </span>
                        <span className="timer-pill">
                            <Clock size={15} />
                            {formatTimer(timerSeconds)}
                        </span>
                    </div>
                )}
            </div>

            {/* If no active session, show setup configuration */}
            {!session && (
                <div className="mock-setup-card">
                    <div className="setup-hero">
                        {/* Holographic AI Sound Visualizer with Microphone */}
                        <div className="hologram-visualizer-box">
                            <div className="hologram-orb">
                                <div className="orb-ring orb-ring--1" />
                                <div className="orb-ring orb-ring--2" />
                                <div className="orb-ring orb-ring--3" />
                                <div className="orb-center">
                                    <Mic size={26} className="orb-icon" />
                                </div>
                            </div>
                            <div className="hologram-waveform">
                                <span className="wave-bar" />
                                <span className="wave-bar" />
                                <span className="wave-bar" />
                                <span className="wave-bar" />
                                <span className="wave-bar" />
                                <span className="wave-bar" />
                                <span className="wave-bar" />
                                <span className="wave-bar" />
                            </div>
                            <div className="interviewer-badge">
                                <Mic size={14} /> AI Interviewer Voice Engine &bull; Ready
                            </div>
                        </div>

                        <div className="setup-form">
                            <h3>Configure Your Interview Session</h3>
                            <p>Choose your target role and difficulty. When started, your camera will turn on and the interviewer will speak questions aloud.</p>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Target Role</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={role}
                                        onChange={e => setRole(e.target.value)}
                                        placeholder="e.g. Full-Stack Developer"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Company / Organization</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={company}
                                        onChange={e => setCompany(e.target.value)}
                                        placeholder="e.g. AVBT Technologies"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Difficulty Level</label>
                                <select
                                    className="select"
                                    value={difficulty}
                                    onChange={e => setDifficulty(e.target.value)}
                                >
                                    <option value="Easy">Easy (Fundamentals &amp; Core Concepts)</option>
                                    <option value="Medium">Medium (Real-World Architecture &amp; APIs)</option>
                                    <option value="Hard">Hard (High-Scale Distributed Systems &amp; Edge Cases)</option>
                                </select>
                            </div>

                            <button
                                onClick={handleStart}
                                className="btn btn-primary start-session-btn"
                                disabled={starting}
                            >
                                {starting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                                Start Mock Interview (Camera + Voice)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Mock Interview Session */}
            {session && session.status === 'in_progress' && currentQ && (
                <div className="mock-active-layout">
                    {/* Left: Dual Video Layout (User Camera Feed + AI Sound Visualizer) */}
                    <div className="interviewer-video-panel">
                        {/* 1. Live User Camera Screen */}
                        <div className="video-viewport user-camera-viewport">
                            {cameraActive ? (
                                <video
                                    ref={userVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="user-webcam-feed"
                                />
                            ) : (
                                <div className="camera-off-placeholder">
                                    <VideoOff size={36} className="cam-off-icon" />
                                    <span>Camera Turned Off</span>
                                </div>
                            )}
                            <div className="video-overlay-badge user-cam-badge">
                                <span className="cam-dot" />
                                <span>Candidate Camera (Live)</span>
                            </div>
                        </div>

                        {/* 2. AI Audio Waveform & Sound Status */}
                        <div className="ai-audio-status-card">
                            <div className="ai-status-left">
                                <div className={`speaking-pulse-circle ${isSpeaking ? 'speaking-pulse-circle--active' : ''}`}>
                                    <Volume2 size={18} />
                                </div>
                                <div>
                                    <h4>AI Interviewer {isSpeaking ? "(Speaking...)" : "(Listening)"}</h4>
                                    <p>{isSpeaking ? "Speaking question aloud" : "Awaiting your response"}</p>
                                </div>
                            </div>
                            <div className="sound-action-btns">
                                <button
                                    className="btn btn-ghost sound-btn"
                                    onClick={() => isSpeaking ? stopSpeaking() : speakText(currentQ.questionText)}
                                    title={isSpeaking ? "Pause Speech" : "Replay Question Sound"}
                                >
                                    {isSpeaking ? <Pause size={16} /> : <RotateCcw size={16} />}
                                </button>
                                <button
                                    className="btn btn-ghost sound-btn"
                                    onClick={() => {
                                        setSoundEnabled(!soundEnabled)
                                        if (isSpeaking) stopSpeaking()
                                    }}
                                    title={soundEnabled ? "Mute AI Voice" : "Enable AI Voice"}
                                >
                                    {soundEnabled ? <Volume2 size={16} className="icon-enabled" /> : <VolumeX size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Interactive Call Controls Bar */}
                        <div className="call-controls-bar">
                            <button
                                className={`control-btn ${isRecording ? 'control-btn--active' : ''}`}
                                onClick={toggleSpeechRecognition}
                                title={isRecording ? "Mute Microphone" : "Speak Answer (Mic Voice Dictation)"}
                            >
                                {isRecording ? <Mic size={20} className="mic-on" /> : <MicOff size={20} />}
                            </button>
                            <button
                                className={`control-btn ${cameraActive ? 'control-btn--cam-on' : ''}`}
                                onClick={() => setCameraActive(!cameraActive)}
                                title={cameraActive ? "Turn Off Camera" : "Turn On Camera"}
                            >
                                {cameraActive ? <Video size={20} /> : <VideoOff size={20} />}
                            </button>
                            <button
                                className="control-btn control-btn--end"
                                onClick={() => {
                                    stopCamera()
                                    stopSpeaking()
                                    setSession(null)
                                }}
                                title="End Interview"
                            >
                                <PhoneOff size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Right: Question Prompt and Answer Input */}
                    <div className="question-answer-panel">
                        <div className="active-question-card">
                            <div className="q-tags">
                                <span className="badge badge-tech">{currentQ.type.toUpperCase()}</span>
                                <span className="badge badge-difficulty">{currentQ.difficulty || difficulty}</span>
                                <button
                                    className="audio-listen-pill"
                                    onClick={() => speakText(currentQ.questionText)}
                                    title="Listen to Question"
                                >
                                    <Volume2 size={13} /> Listen
                                </button>
                            </div>
                            <h3 className="active-q-text">{currentQ.questionText}</h3>
                        </div>

                        {/* Feedback from previous answer if present */}
                        {latestFeedback && (
                            <div className="prev-feedback-card">
                                <div className="feedback-head">
                                    <Award size={16} className="award-icon" />
                                    <span>Last Answer Evaluation: <strong>{latestFeedback.score}%</strong></span>
                                    <button
                                        className="btn btn-ghost sound-btn-sm"
                                        onClick={() => speakText(latestFeedback.modelAnswer)}
                                        title="Listen to Model Answer"
                                    >
                                        <Volume2 size={14} /> Listen Answer
                                    </button>
                                </div>
                                <div className="feedback-metrics">
                                    <span>Technical: <strong>{latestFeedback.technicalAccuracy}%</strong></span>
                                    <span>Communication: <strong>{latestFeedback.communication}%</strong></span>
                                    <span>Problem Solving: <strong>{latestFeedback.problemSolving}%</strong></span>
                                </div>
                                <div className="feedback-model-preview">
                                    <strong>Model Answer:</strong> {latestFeedback.modelAnswer}
                                </div>
                            </div>
                        )}

                        {/* User Answer Input with Voice Dictation */}
                        <div className="answer-input-box">
                            <textarea
                                className="textarea answer-textarea"
                                rows={8}
                                placeholder="Type your answer here or click the microphone to speak your response aloud..."
                                value={userAnswer}
                                onChange={e => setUserAnswer(e.target.value)}
                            />
                            <div className="answer-submit-row">
                                <span className={`recording-hint ${submitting ? 'recording-hint--evaluating' : ''}`}>
                                    {submitting ? "⚡ AI is evaluating your response..." : isRecording ? "🔴 Listening... Speak clearly into your mic" : "Type your response or use voice dictation"}
                                </span>
                                <button
                                    onClick={handleSubmitAnswer}
                                    className="btn btn-primary submit-ans-btn"
                                    disabled={submitting || !userAnswer.trim()}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Evaluating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            <span>Submit Answer</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Session Completed Results Summary */}
            {session && session.status === 'completed' && (
                <div className="mock-completed-card">
                    <div className="completed-header">
                        <div className="trophy-circle">
                            <Award size={36} />
                        </div>
                        <h2>Mock Interview Completed!</h2>
                        <p>{session.summary}</p>
                    </div>

                    <div className="final-score-display">
                        <span className="big-score">{session.overallScore}%</span>
                        <span className="score-lbl">Overall Performance Rating</span>
                    </div>

                    <div className="reviewed-questions-list">
                        <h4>Questions &amp; Feedback Summary</h4>
                        {session.questions.map((q, idx) => (
                            <div key={idx} className="q-review-item">
                                <div className="q-rev-head">
                                    <span className="q-idx">Q{idx + 1}: {q.questionText}</span>
                                    <div className="q-rev-right">
                                        <button
                                            className="audio-listen-pill"
                                            onClick={() => speakText(q.feedback?.modelAnswer || q.questionText)}
                                            title="Listen to Model Answer"
                                        >
                                            <Volume2 size={13} /> Listen
                                        </button>
                                        <span className="q-score-badge">{q.feedback?.score || 80}%</span>
                                    </div>
                                </div>
                                <p className="user-ans-preview"><strong>Your Answer:</strong> {q.userAnswer}</p>
                                <p className="model-ans-preview"><strong>Model Answer:</strong> {q.feedback?.modelAnswer}</p>
                            </div>
                        ))}
                    </div>

                    <div className="completed-actions">
                        <button onClick={() => setSession(null)} className="btn btn-primary">
                            <RefreshCw size={15} />
                            Start Another Mock Session
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MockInterview
