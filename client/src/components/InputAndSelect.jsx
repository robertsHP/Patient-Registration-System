import React, { useState, useRef } from 'react';
import './InputAndSelect.css';

export default function InputAndSelect({ 
    options, nameColumn, value, handleOnChange, handleAddOption, handleDeleteOption, placeholder 
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
        <div className="custom-select" ref={dropdownRef}>
            <input
                type="text"
                value={value || inputValue}
                onClick={onToggleDropdown}
                onChange={onInputChange}
                placeholder={placeholder}
            />
            {isOpen && (
                <div className="custom-select-dropdown">
                    <div className="custom-select-input-container">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={onInputChange}
                            placeholder="Type to add or select"
                            className="custom-select-input-field"
                        />
                        <button 
                            className="add-option-button" 
                            onClick={onAddOption}
                        >
                            Set
                        </button>
                    </div>
                    <ul className="custom-select-options">
                        {options.map((option) => (
                            <li 
                                key={option.id} 
                                className="custom-select-option" 
                                onClick={() => onSelectOption(option)}
                            >
                                {option[nameColumn]}
                                <button 
                                    className="delete-option-button" 
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
    );
}
