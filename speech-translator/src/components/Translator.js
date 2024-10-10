import React, { useState } from 'react';
import './Translator.css'; 

const Translator = () => {
    const [text, setText] = useState('');
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('es');
    const [translatedText, setTranslatedText] = useState('');

    const translateText = async () => {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
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
    };

    const speakTranslation = () => {
        const utterance = new SpeechSynthesisUtterance(translatedText);
        utterance.lang = targetLang;
        speechSynthesis.speak(utterance);
    };

    return (
        <div className="translator">
            <h2>Text Translator</h2>
            <div className="language-selectors">
                <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="ru">Russian</option>
                    <option value="zh-CN">Chinese (Simplified)</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="ar">Arabic</option>
                    <option value="hi">Hindi</option>
                    <option value="bn">Bengali</option>
                    <option value="tr">Turkish</option>
                    <option value="nl">Dutch</option>
                    <option value="sv">Swedish</option>
                    <option value="no">Norwegian</option>
                    <option value="da">Danish</option>
                    <option value="fi">Finnish</option>
                </select>
                <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="ru">Russian</option>
                    <option value="zh-CN">Chinese (Simplified)</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="ar">Arabic</option>
                    <option value="hi">Hindi</option>
                    <option value="bn">Bengali</option>
                    <option value="tr">Turkish</option>
                    <option value="nl">Dutch</option>
                    <option value="sv">Swedish</option>
                    <option value="no">Norwegian</option>
                    <option value="da">Danish</option>
                    <option value="fi">Finnish</option>
                </select>
            </div>
            <textarea
                rows="4"
                cols="50"
                placeholder="Type text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <br />
            <button className="translate-button" onClick={translateText} disabled={!text}>
                Translate
            </button>
            <div className="translated">
                <p>Translated: {translatedText}</p>
                <button className="speak-button" onClick={speakTranslation} disabled={!translatedText}>
                    🔊
                </button>
            </div>
        </div>
    );
};

export default Translator;
