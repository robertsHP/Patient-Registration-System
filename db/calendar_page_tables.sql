CREATE TABLE patient_type (
	id_pat_type 	INT PRIMARY KEY,  
	pat_type 	    VARCHAR(7)
);

CREATE TABLE patient (
	id_patient          INT PRIMARY KEY, 
	pat_name            VARCHAR(80), 
	phone_num           VARCHAR(45), 
	hotel_stay_start    TIMESTAMP, 
	hotel_stay_end      TIMESTAMP, 
	id_pat_type 	    INT,
	FOREIGN KEY (id_pat_type) REFERENCES patient_type(id_pat_type)
);

CREATE TABLE floor (
    id_floor        INT PRIMARY KEY,
    floor_name      VARCHAR(80)
);

CREATE TABLE room (
    id_room     INT PRIMARY KEY,
    room_num    VARCHAR(10),
    id_floor    INT,
    FOREIGN KEY (id_floor) REFERENCES floor(id_floor)
);

CREATE TABLE bed (
    id_bed      INT PRIMARY KEY,
    bed_name    VARCHAR(80), 
    id_room     INT,
    FOREIGN KEY (id_room) REFERENCES room(id_room)
);

CREATE TABLE doctor (
	id_doctor 	INT PRIMARY KEY, 
	doc_name 	VARCHAR(80)
);

CREATE TABLE event (
    id_event        INT PRIMARY KEY,
    id_room         INT,
    id_patient      INT,
    begin_date      TIMESTAMP,
    end_date        TIMESTAMP,
    notes           TEXT,
    id_doctor       INT,
    FOREIGN KEY (id_room) REFERENCES room(id_room),
    FOREIGN KEY (id_patient) REFERENCES patient(id_patient),
    FOREIGN KEY (id_doctor) REFERENCES doctor(id_doctor)
);
