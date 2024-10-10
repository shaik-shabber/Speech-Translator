import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SpeechToText from './components/SpeechToText';
import TextToSpeech from './components/TextToSpeech';
import Translator from './components/Translator';
import './App.css';

const AppRouter = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <div className="login-page">
                        <h1>Translator</h1>
                        <div className="button-container">
                            <button onClick={() => window.location.href='/speech-to-text'}>
                                🎤 Speech to Text
                            </button>
                            <button onClick={() => window.location.href='/text-to-speech'}>
                                📝 Text to Speech
                            </button>
                        </div>
                    </div>
                }
            />
            <Route path="/speech-to-text" element={<SpeechToText />} />
            <Route path="/text-to-speech" element={<TextToSpeech />} />
            <Route path="/translator" element={<Translator />} />
        </Routes>
    );
};

export default AppRouter;
