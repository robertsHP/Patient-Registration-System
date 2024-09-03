import React, { useState, useRef } from 'react';
import './InputSelector.css';

export default function InputSelector({ 
    options, nameColumn, value, defaultValue, 
    handleInputChange, handleSelectOption, 
    handleDeleteOption, 
    className, placeholder 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');
    const dropdownRef = useRef(null);

    const onInputChange = (e) => {
        var option = {
            ...defaultValue,
            [nameColumn]: e.target.value
        };

        handleInputChange(option);
        setInputValue(option[nameColumn]);
        setIsOpen(true);
    };

    const onSelectOption = (option) => {
        handleSelectOption(option);
        setInputValue(option[nameColumn]);
        setIsOpen(false);
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

    const onClearInput = () => {
        setInputValue(defaultValue);
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
                    value={inputValue}
                    onClick={onToggleDropdown}
                    onChange={onInputChange}
                    placeholder={placeholder}
                    className={className}
                />
                {inputValue && (
                    <button 
                        className="input-selector__clear-button" 
                        onClick={onClearInput}
                    >
                        X
                    </button>
                )}
            </div>
            <div className="input-selector__dropdown" ref={dropdownRef}>
                {isOpen && (
                    <div className="input-selector__dropdown-container">
                        <ul className="input-selector__options">
                            {options.filter(option => 
                                typeof option[nameColumn] == 'string' ? 
                                    option[nameColumn].toLowerCase().includes(inputValue.toLowerCase())
                                    :
                                    ''
                            ).map((option) => (
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
