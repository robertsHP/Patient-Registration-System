CREATE TABLE room (
    id_room     INT PRIMARY KEY,
    room_num    VARCHAR(10)
);

CREATE TABLE patient_type (
	id_pat_type 	INT PRIMARY KEY,  
	pat_type 	    VARCHAR(7)
);

CREATE TABLE doctor (
	id_doctor 	INT PRIMARY KEY, 
	doc_name 	VARCHAR(80)
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

CREATE TABLE sauna (
	id_sauna        INT PRIMARY KEY, 
    date_and_time   TIMESTAMP,
    id_patient      INT,
    notes           TEXT, 
    id_doctor       INT,
	FOREIGN KEY (id_doctor) REFERENCES doctor(id_doctor)
    FOREIGN KEY (id_patient) REFERENCES patient(id_patient)
);

CREATE TABLE beds (
    id_beds         INT PRIMARY KEY,
    id_room         INT,
    id_patient      INT,
    begin_date      TIMESTAMP,
    end_date        TIMESTAMP,
    notes           TEXT,
    FOREIGN KEY (id_room) REFERENCES room(id_room),
    FOREIGN KEY (id_patient) REFERENCES patient(id_patient)
);

CREATE TABLE bed (
    id_bed      INT PRIMARY KEY,
    bed_name    VARCHAR(80), 
    id_room     INT,
    FOREIGN KEY (id_room) REFERENCES room(id_room)
);

CREATE TABLE beds4 (
    id_beds4        INT PRIMARY KEY,
    id_room         INT,
    id_patient      INT,
    begin_date      TIMESTAMP,
    end_date        TIMESTAMP, 
	notes           TEXT,
    FOREIGN KEY (id_room) REFERENCES room(id_room),
    FOREIGN KEY (id_patient) REFERENCES patient(id_patient)
);
