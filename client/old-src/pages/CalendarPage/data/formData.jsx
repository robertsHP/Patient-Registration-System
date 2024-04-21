import React from 'react';

export const formData = {
    beds: {
        title: {
            tag: (value, onChange) => {
                return (
                    <label>
                        Nosaukums
                        <input type="text" name="title" value={value} onChange={onChange} />
                    </label>
                )
            }
        },
        start: {
            title: "Sākuma datums"
        },
        end: {
            title: "Beigu datums"
        },
        room: {
            title: "Telpas Nr."
        },
        bedName: {
            title: "Gulta"
        },
        description: {
            title: "Apraksts"
        },
        patientName: {
            title: "Pacients"
        },
        doctorName: {
            title: "Ārsts"
        },
        hotelStayDate: {
            title: "Viesnīca"
        }
    }
}