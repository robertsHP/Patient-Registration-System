import React, { useState, useRef } from 'react';

import './InputAndSelect.css';

export default function InputAndSelect ({ options, value, onChange, onAddOption, onDeleteOption, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const dropdownRef = useRef(null);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSelectOption = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    const handleAddOption = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            onAddOption(inputValue);
            setInputValue('');
            setIsOpen(false);
        }
    };

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleDeleteOption = (option, e) => {
        e.stopPropagation();
        onDeleteOption(option);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="custom-select" ref={dropdownRef}>
            <div className="custom-select-input" onClick={handleToggleDropdown}>
                {value || placeholder}
            </div>
            {isOpen && (
                <div className="custom-select-dropdown">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleAddOption}
                        placeholder="Type to add or select"
                        className="custom-select-input-field"
                    />
                    <ul className="custom-select-options">
                        {options.map((option) => (
                            <li key={option} className="custom-select-option" onClick={() => handleSelectOption(option)}>
                                {option}
                                <button className="delete-option-button" onClick={(e) => handleDeleteOption(option, e)}>X</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
