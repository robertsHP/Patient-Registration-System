import React from 'react';

export default [
    {
        name: "description",
        component: ({value, onChange}) => {
            return (
                <label>
                    Apraksts:
                    <input type="text" name="description" value={value} onChange={onChange} />
                </label>
            )
        }
    },
    {
        name: "start",
        component: ({value, onChange}) => {
            return (
                <label>
                    Sākuma datums:
                    <input type="date" name="start" value={value} onChange={onChange} />
                </label>
            )
        }
    },
    {
        name: "end",
        component: ({value, onChange}) => {
            return (
                <label>
                    Beigu datums:
                    <input type="date" name="end" value={value} onChange={onChange} />
                </label>
            )
        }
    },
]