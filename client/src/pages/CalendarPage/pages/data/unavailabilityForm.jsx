import React from 'react';

export default [
    [
        {
            name: "description",
            component: ({value, onChange}) => {
                return (
                    <label>
                        Pacienta vārds
                        <input type="text" name="description" value={value} onChange={onChange} />
                    </label>
                )
            }
        },
    ]
]