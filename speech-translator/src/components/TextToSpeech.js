import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './TextToSpeech.css';

const TextToSpeech = () => {
    const [textInput, setTextInput] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('en-US');
    const [targetLang, setTargetLang] = useState('hi');

    const navigate = useNavigate();

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

    const speakTranslation = () => {
        if (translatedText) {
            const utterance = new SpeechSynthesisUtterance(translatedText);
            utterance.lang = targetLang;
            speechSynthesis.speak(utterance);
        }
    };

    const speakOriginalText = () => {
        if (textInput) {
            const utterance = new SpeechSynthesisUtterance(textInput);
            utterance.lang = sourceLang;
            speechSynthesis.speak(utterance);
        }
    };

    const handleSourceLangChange = (e) => {
        setSourceLang(e.target.value);
        setTextInput('');
        setTranslatedText('');
    };

    const handleTargetLangChange = (e) => {
        setTargetLang(e.target.value);
        if (textInput) {
            translateText(textInput, e.target.value);
        }
    };

    const handleTextInputChange = (e) => {
        setTextInput(e.target.value);
        if (e.target.value) {
            translateText(e.target.value, targetLang);
        } else {
            setTranslatedText('');
        }
    };

    const handleBackButton = () => {
        navigate('/');
    };

    return (
        <div className="text-to-speech-container">
            <h2>Text to Speech</h2>
            <textarea
                value={textInput}
                onChange={handleTextInputChange}
                placeholder="Enter text here..."
            />
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
            <div className="output-container">
                <div className="text-box">
                    <h3>Original Text:</h3>
                    <p>{textInput}</p>
                    <button onClick={speakOriginalText} disabled={!textInput}>🔊 Speak Original Text</button>
                </div>
                <div className="text-box">
                    <h3>Translated Text:</h3>
                    <p>{translatedText}</p>
                    <button onClick={speakTranslation} disabled={!translatedText}>🔊 Speak Translation</button>
                </div>
            </div>
            <button onClick={handleBackButton} className="back-button">Back</button>
        </div>
    );
};

export default TextToSpeech;
