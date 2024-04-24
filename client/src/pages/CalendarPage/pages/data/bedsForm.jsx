import React from 'react';

export default [
    {
        name: "patientName",
        component: ({value, onChange}) => {
            return (
                <label>
                    Pacienta vārds
                    <input type="text" name="patientName" value={value} onChange={onChange} />
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
    {
        name: "pack",
        component: ({value, onChange}) => {
            return (
                <label>
                    Komplekts:
                    <select name="pack" value={value} onChange={onChange}>
                        <option value={null}></option>
                        <option value="MAK">MAK</option>
                        <option value="DST">DST</option>
                        <option value="AMB">AMB</option>
                        <option value="VSN">VSN</option>
                    </select>
                </label>
            )
        }
    },
    {
        name: "room",
        component: ({value, onChange}) => {
            return (
                <label>
                    Telpa un gulta:
                    <input type="text" name="room" value={value} readOnly />
                    {/* <input type="text" name="bedName" value={this.state.formState.bedName} onChange={this.handleInputUpdate} /> */}
                </label>
            )
        }
    },
    {
        name: "bed",
        component: ({value, onChange}) => {
            return (
                <select name="options">
                    <option value="option1">Lielā gulta</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </select>
            )
        }
    },
    {
        name: "description",
        component: ({value, onChange}) => {
            return (
                <label>
                    Apraksts:
                    <textarea name="description" value={value} onChange={onChange} />
                </label>
            )
        }
    },
    {
        name: "doctorName",
        component: ({value, onChange}) => {
            return (
                <label>
                    Ārsts:
                    <input type="text" name="doctorName" value={value} onChange={onChange} />
                </label>
            )
        }
    },
    {
        name: "hotelStayDate",
        component: ({value, onChange}) => {
            return (
                <label>
                    Viesnīcas palikšanas datums:
                    <input type="date" name="hotelStayDate" value={value} onChange={onChange} />
                </label>
            )
        }
    }
]
