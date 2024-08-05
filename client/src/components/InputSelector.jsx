import React, { useState, useRef } from 'react';

import './InputSelector.css';

export default function InputSelector({ 
    options, nameColumn, value, handleOnChange, handleAddOption, handleDeleteOption, className, placeholder 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const dropdownRef = useRef(null);

    const onInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const onSelectOption = (option) => {
        handleOnChange(option);
        setIsOpen(false);
    };

    const onAddOption = () => {
        if (inputValue.trim() !== '') {
            handleAddOption(inputValue);
            setInputValue('');
            setIsOpen(false);
        }
    };

    const onToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const onDeleteOption = (option, e) => {
        e.stopPropagation();
        handleDeleteOption(option);
    };

    const onClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('mousedown', onClickOutside);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
        };
    }, []);

    return (
        <div className="input-selector">
            <div className="input-selector__input">
                <input
                    type="text"
                    value={value || inputValue}
                    onClick={onToggleDropdown}
                    onChange={onInputChange}
                    placeholder={placeholder}
                    className={className}
                />
            </div>
            <div className="input-selector__dropdown" ref={dropdownRef}>
                {isOpen && (
                    <div className="input-selector__dropdown-container">
                        <div className="input-selector__input-container">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={onInputChange}
                                placeholder="Type to add or select"
                                className="input-selector__input-field"
                            />
                            <button 
                                className="input-selector__add-button" 
                                onClick={onAddOption}
                            >
                                Set
                            </button>
                        </div>
                        <ul className="input-selector__options">
                            {options.map((option) => (
                                <li 
                                    key={option.id} 
                                    className="input-selector__option" 
                                    onClick={() => onSelectOption(option)}
                                >
                                    {option[nameColumn]}
                                    <button 
                                        className="input-selector__delete-option" 
                                        onClick={(e) => onDeleteOption(option, e)}
                                    >
                                        X
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
