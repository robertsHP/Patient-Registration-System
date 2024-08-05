import React from 'react';
import ReactDOM from 'react-dom';

import { createRoot } from 'react-dom/client';

import './ConfirmationWindow.css';

function ConfirmationWindowContent ({ message, onConfirm, onCancel }) {
    return ReactDOM.createPortal(
        <div className="confirmation-window">
            <div className="confirmation-window__content">
                <p>{message}</p>
                <div className="confirmation-window__buttons">
                    <button onClick={onConfirm}>Jā</button>
                    <button onClick={onCancel}>Nē</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default class ConfirmationWindow {
    static show(message, onConfirm, onCancel) {
        const modalContainer = document.createElement('div');
        document.body.appendChild(modalContainer);

        const root = createRoot(modalContainer);

        const cleanup = () => {
            root.unmount();
            document.body.removeChild(modalContainer);
        };

        root.render(
            <ConfirmationWindowContent
                message={message}
                onConfirm={() => {
                    onConfirm();
                    cleanup();
                }}
                onCancel={() => {
                    onCancel();
                    cleanup();
                }}
            />
        );
    }
}
