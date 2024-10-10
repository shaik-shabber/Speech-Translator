import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpeechToText.css';

const SpeechToText = () => {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [sourceLang, setSourceLang] = useState('en-US');
    const [targetLang, setTargetLang] = useState('hi');
    const [translatedText, setTranslatedText] = useState('');
    const navigate = useNavigate();

    const recognitionRef = useRef(null);

    const translateText = useCallback(async (text, targetLanguage) => {
        if (!text.trim()) return;

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLanguage}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.responseData && data.responseData.translatedText) {
                setTranslatedText(data.responseData.translatedText);
            } else {
                setTranslatedText('Translation error');
            }
        } catch (error) {
            console.error('Error translating text:', error);
            setTranslatedText('Translation error');
        }
    }, [sourceLang]);

    useEffect(() => {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new window.SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.lang = sourceLang;

        recognitionRef.current.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                finalTranscript += event.results[i][0].transcript;
            }
            setTranscript(finalTranscript);
            translateText(finalTranscript, targetLang);
        };

        return () => {
            recognitionRef.current.stop();
        };
    }, [sourceLang, targetLang, translateText]);

    const startListening = () => {
        setIsListening(true);
        recognitionRef.current.lang = sourceLang;
        recognitionRef.current.start();
    };

    const stopListening = () => {
        setIsListening(false);
        recognitionRef.current.stop();
    };

    const handleSourceLangChange = (e) => {
        const newSourceLang = e.target.value;
        setSourceLang(newSourceLang);
        setTranscript('');
        setTranslatedText('');
        validateTargetLanguage(newSourceLang);
    };

    const handleTargetLangChange = (e) => {
        const newTargetLang = e.target.value;
        setTargetLang(newTargetLang);
        if (transcript) {
            translateText(transcript, newTargetLang);
        }
    };

    const speakTranslation = () => {
        if (translatedText) {
            const utterance = new SpeechSynthesisUtterance(translatedText);
            utterance.lang = targetLang;
            speechSynthesis.speak(utterance);
        }
    };

    const validateTargetLanguage = (newSourceLang) => {
        const validTargetLanguages = {
            'en-US': ['hi', 'es', 'fr', 'de', 'ja', 'zh-CN', 'pt', 'ru', 'te', 'vi', 'tr'],
            'hi': ['en-US', 'es', 'fr', 'de', 'ja', 'zh-CN', 'pt', 'ru', 'te', 'vi', 'tr'],
            'es': ['en-US', 'hi', 'fr', 'de', 'ja', 'zh-CN', 'pt', 'ru', 'te', 'vi', 'tr'],
            'fr': ['en-US', 'hi', 'es', 'de', 'ja', 'zh-CN', 'pt', 'ru', 'te', 'vi', 'tr'],
            'de': ['en-US', 'hi', 'es', 'fr', 'ja', 'zh-CN', 'pt', 'ru', 'te', 'vi', 'tr'],
            'ja': ['en-US', 'hi', 'es', 'fr', 'de', 'zh-CN', 'pt', 'ru', 'te', 'vi', 'tr'],
            'zh-CN': ['en-US', 'hi', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'te', 'vi', 'tr'],
            'pt': ['en-US', 'hi', 'es', 'fr', 'de', 'ja', 'zh-CN', 'ru', 'te', 'vi', 'tr'],
            'ru': ['en-US', 'hi', 'es', 'fr', 'de', 'ja', 'zh-CN', 'pt', 'te', 'vi', 'tr'],
            'te': ['en-US', 'hi', 'es', 'fr', 'de', 'ja', 'zh-CN', 'pt', 'ru', 'vi', 'tr'],
            'vi': ['en-US', 'hi', 'es', 'fr', 'de', 'ja', 'zh-CN', 'pt', 'ru', 'te', 'tr'],
            'tr': ['en-US', 'hi', 'es', 'fr', 'de', 'ja', 'zh-CN', 'pt', 'ru', 'te', 'vi'],
        };

        if (validTargetLanguages[newSourceLang] && !validTargetLanguages[newSourceLang].includes(targetLang)) {
            setTargetLang('hi');
        }
    };

    useEffect(() => {
        if (transcript) {
            translateText(transcript, targetLang);
        }
    }, [transcript, targetLang, translateText]);

    return (
        <div className="speech-to-text-container">
            <h2>Speech to Text</h2>
            <div className="language-selectors">
                <select value={sourceLang} onChange={handleSourceLangChange}>
                    <option value="en-US">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                    <option value="zh-CN">Chinese (Simplified)</option>
                    <option value="hi">Hindi</option>
                    <option value="pt">Portuguese</option>
                    <option value="ru">Russian</option>
                    <option value="te">Telugu</option>
                    <option value="vi">Vietnamese</option>
                    <option value="tr">Turkish</option>
                </select>
                <select value={targetLang} onChange={handleTargetLangChange}>
                    <option value="hi">Hindi</option>
                    <option value="en-US">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                    <option value="zh-CN">Chinese (Simplified)</option>
                    <option value="pt">Portuguese</option>
                    <option value="ru">Russian</option>
                    <option value="te">Telugu</option>
                    <option value="vi">Vietnamese</option>
                    <option value="tr">Turkish</option>
                </select>
            </div>
            <div className="button-container">
                <button className="animate-button" onClick={startListening} disabled={isListening}>Start Listening</button>
                <button className="animate-button" onClick={stopListening} disabled={!isListening}>Stop Listening</button>
            </div>
            <div className="transcript-container">
                <div className="transcript-box">
                    <h3>Transcript:</h3>
                    <p>{transcript}</p>
                </div>
                <div className="translated-box">
                    <h3>Translated:</h3>
                    <p>{translatedText}</p>
                    <button className="speak-button" onClick={speakTranslation} disabled={!translatedText}>🔊</button>
                </div>
            </div>
            <button className="back-button" onClick={() => navigate('/')}>Back</button>
        </div>
    );
};

export default SpeechToText;
