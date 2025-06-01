import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSwitcher.css';

const languages = [
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'lt', label: 'LT', flag: '🇱🇹' },
    { code: 'uk', label: 'UK', flag: '🇺🇦' },
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <select className="language-select language-switcher" onChange={changeLanguage} value={i18n.language}>
            {languages.map(({ code, label, flag }) => (
                <option key={code} value={code}>
                    {flag} {label}
                </option>
            ))}
        </select>
    );
};

export default LanguageSwitcher;
