CREATE TABLE LRC_CALENDAR_PAGE_room (
    id_room     INT PRIMARY KEY,
    room_num    VARCHAR(10)
);

CREATE TABLE LRC_CALENDAR_PAGE_patient_type (
	id_pat_type 	INT PRIMARY KEY,  
	pat_type 	    VARCHAR(7)
);

CREATE TABLE LRC_CALENDAR_PAGE_doctor (
	id_doctor 	INT PRIMARY KEY, 
	doc_name 	VARCHAR(70)
);

CREATE TABLE LRC_CALENDAR_PAGE_patient (
	id_patient          INT PRIMARY KEY, 
	pat_name            VARCHAR(20), 
	phone_num           VARCHAR(45), 
	hotel_stay_start    TIMESTAMP, 
	hotel_stay_end      TIMESTAMP, 
	id_pat_type 	    INT,
	FOREIGN KEY (id_pat_type) REFERENCES LRC_CALENDAR_PAGE_patient_type(id_pat_type)
);

CREATE TABLE LRC_CALENDAR_PAGE_sauna (
	id_sauna    INT PRIMARY KEY, 
	notes       TEXT, 
	id_doctor   INT,
	FOREIGN KEY (id_doctor) REFERENCES LRC_CALENDAR_PAGE_doctor(id_doctor)
);

CREATE TABLE LRC_CALENDAR_PAGE_beds (
    id_beds         INT PRIMARY KEY,
    id_room         INT,
    id_patient      INT,
    begin_date      TIMESTAMP,
    end_date        TIMESTAMP,
    notes           TEXT,
    FOREIGN KEY (id_room) REFERENCES LRC_CALENDAR_PAGE_room(id_room),
    FOREIGN KEY (id_patient) REFERENCES LRC_CALENDAR_PAGE_patient(id_patient)
);

CREATE TABLE LRC_CALENDAR_PAGE_bed (
    id_bed  INT PRIMARY KEY,
    id_room INT,
    FOREIGN KEY (id_room) REFERENCES LRC_CALENDAR_PAGE_room(id_room)
);

CREATE TABLE LRC_CALENDAR_PAGE_beds4 (
    id_beds4        INT PRIMARY KEY,
    id_room         INT,
    id_patient      INT,
    begin_date      TIMESTAMP,
    end_date        TIMESTAMP, 
	notes           TEXT,
    FOREIGN KEY (id_room) REFERENCES LRC_CALENDAR_PAGE_room(id_room),
    FOREIGN KEY (id_patient) REFERENCES LRC_CALENDAR_PAGE_patient(id_patient)
);


-------------------------------------------------DATI--------------------------------------------------------

-- Populate room table
INSERT INTO LRC_CALENDAR_PAGE_room (id_room, room_num) VALUES (1, '101');
INSERT INTO LRC_CALENDAR_PAGE_room (id_room, room_num) VALUES (2, '102');
INSERT INTO LRC_CALENDAR_PAGE_room (id_room, room_num) VALUES (3, '103');
INSERT INTO LRC_CALENDAR_PAGE_room (id_room, room_num) VALUES (4, '104');

-- Populate patient_type table
INSERT INTO LRC_CALENDAR_PAGE_patient_type (id_pat_type, pat_type) VALUES (1, 'AMB');
INSERT INTO LRC_CALENDAR_PAGE_patient_type (id_pat_type, pat_type) VALUES (2, 'DST');
INSERT INTO LRC_CALENDAR_PAGE_patient_type (id_pat_type, pat_type) VALUES (3, 'MAK');
INSERT INTO LRC_CALENDAR_PAGE_patient_type (id_pat_type, pat_type) VALUES (4, 'PAV');

-- Populate doctor table
INSERT INTO LRC_CALENDAR_PAGE_doctor (id_doctor, doc_name) VALUES (1, 'Dr. Smith');
INSERT INTO LRC_CALENDAR_PAGE_doctor (id_doctor, doc_name) VALUES (2, 'Dr. Johnson');
INSERT INTO LRC_CALENDAR_PAGE_doctor (id_doctor, doc_name) VALUES (3, 'Dr. Williams');
INSERT INTO LRC_CALENDAR_PAGE_doctor (id_doctor, doc_name) VALUES (4, 'Dr. Davis');

-- Populate patient table
INSERT INTO LRC_CALENDAR_PAGE_patient (id_patient, pat_name, phone_num, hotel_stay_start, hotel_stay_end, id_pat_type) VALUES (1, 'John Doe', '123-456-7890', CURRENT_TIMESTAMP, NULL, 1);
INSERT INTO LRC_CALENDAR_PAGE_patient (id_patient, pat_name, phone_num, hotel_stay_start, hotel_stay_end, id_pat_type) VALUES (2, 'Jane Doe', '098-765-4321', CURRENT_TIMESTAMP, NULL, 2);
INSERT INTO LRC_CALENDAR_PAGE_patient (id_patient, pat_name, phone_num, hotel_stay_start, hotel_stay_end, id_pat_type) VALUES (3, 'Alice', '111-222-3333', CURRENT_TIMESTAMP, NULL, 3);
INSERT INTO LRC_CALENDAR_PAGE_patient (id_patient, pat_name, phone_num, hotel_stay_start, hotel_stay_end, id_pat_type) VALUES (4, 'Bob', '444-555-6666', CURRENT_TIMESTAMP, NULL, 4);

-- Populate sauna table
INSERT INTO LRC_CALENDAR_PAGE_sauna (id_sauna, notes, id_doctor) VALUES (1, 'Sauna 1 notes', 1);
INSERT INTO LRC_CALENDAR_PAGE_sauna (id_sauna, notes, id_doctor) VALUES (2, 'Sauna 2 notes', 2);
INSERT INTO LRC_CALENDAR_PAGE_sauna (id_sauna, notes, id_doctor) VALUES (3, 'Sauna 3 notes', 3);
INSERT INTO LRC_CALENDAR_PAGE_sauna (id_sauna, notes, id_doctor) VALUES (4, 'Sauna 4 notes', 4);

-- Populate beds table
INSERT INTO LRC_CALENDAR_PAGE_beds (id_beds, id_room, id_patient, begin_date, end_date, notes) VALUES (1, 1, 1, CURRENT_TIMESTAMP, NULL, 'Bed 1 notes');
INSERT INTO LRC_CALENDAR_PAGE_beds (id_beds, id_room, id_patient, begin_date, end_date, notes) VALUES (2, 2, 2, CURRENT_TIMESTAMP, NULL, 'Bed 2 notes');
INSERT INTO LRC_CALENDAR_PAGE_beds (id_beds, id_room, id_patient, begin_date, end_date, notes) VALUES (3, 3, 3, CURRENT_TIMESTAMP, NULL, 'Bed 3 notes');
INSERT INTO LRC_CALENDAR_PAGE_beds (id_beds, id_room, id_patient, begin_date, end_date, notes) VALUES (4, 4, 4, CURRENT_TIMESTAMP, NULL, 'Bed 4 notes');

-- Populate bed table
INSERT INTO LRC_CALENDAR_PAGE_bed (id_bed, id_room) VALUES (1, 1);
INSERT INTO LRC_CALENDAR_PAGE_bed (id_bed, id_room) VALUES (2, 2);
INSERT INTO LRC_CALENDAR_PAGE_bed (id_bed, id_room) VALUES (3, 3);
INSERT INTO LRC_CALENDAR_PAGE_bed (id_bed, id_room) VALUES (4, 4);

-- Populate beds4 table
INSERT INTO LRC_CALENDAR_PAGE_beds4 (id_beds4, id_room, id_patient, begin_date, end_date, notes) VALUES (1, 1, 1, CURRENT_TIMESTAMP, NULL, 'Bed 1 notes');
INSERT INTO LRC_CALENDAR_PAGE_beds4 (id_beds4, id_room, id_patient, begin_date, end_date, notes) VALUES (2, 2, 2, CURRENT_TIMESTAMP, NULL, 'Bed 2 notes');
INSERT INTO LRC_CALENDAR_PAGE_beds4 (id_beds4, id_room, id_patient, begin_date, end_date, notes) VALUES (3, 3, 3, CURRENT_TIMESTAMP, NULL, 'Bed 3 notes');
INSERT INTO LRC_CALENDAR_PAGE_beds4 (id_beds4, id_room, id_patient, begin_date, end_date, notes) VALUES (4, 4, 4, CURRENT_TIMESTAMP, NULL, 'Bed 4 notes');
