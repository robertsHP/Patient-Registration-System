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
	doc_name 	VARCHAR(80)
);

CREATE TABLE LRC_CALENDAR_PAGE_patient (
	id_patient          INT PRIMARY KEY, 
	pat_name            VARCHAR(80), 
	phone_num           VARCHAR(45), 
	hotel_stay_start    TIMESTAMP, 
	hotel_stay_end      TIMESTAMP, 
	id_pat_type 	    INT,
	FOREIGN KEY (id_pat_type) REFERENCES LRC_CALENDAR_PAGE_patient_type(id_pat_type)
);

CREATE TABLE LRC_CALENDAR_PAGE_bed (
    id_bed      INT PRIMARY KEY,
    bed_name    VARCHAR(80), 
    id_room     INT,
    FOREIGN KEY (id_room) REFERENCES LRC_CALENDAR_PAGE_room(id_room)
);

CREATE TABLE LRC_CALENDAR_PAGE_sauna (
	id_sauna        INT PRIMARY KEY, 
    date_and_time   TIMESTAMP,
    id_patient      INT,
    notes           TEXT, 
    id_doctor       INT,
	FOREIGN KEY (id_doctor) REFERENCES LRC_CALENDAR_PAGE_doctor(id_doctor),
    FOREIGN KEY (id_patient) REFERENCES LRC_CALENDAR_PAGE_patient(id_patient)
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
INSERT INTO LRC_CALENDAR_PAGE_room (id_room, room_num) VALUES
(0, '101A'),
(1, '101B'),
(2, '102A');

INSERT INTO LRC_CALENDAR_PAGE_patient_type (id_pat_type, pat_type) VALUES
(0, 'AMB'),
(1, 'DST'),
(2, 'MAK'),
(3, 'PAV');

-- Insert data into doctor table
INSERT INTO LRC_CALENDAR_PAGE_doctor (id_doctor, doc_name) VALUES
(0, 'Dr. Emily White'),
(1, 'Dr. Alice Smith'),
(2, 'Dr. Bob Johnson'),
(3, 'Dr. Charlie Davis');

-- Insert data into patient table
INSERT INTO LRC_CALENDAR_PAGE_patient (id_patient, pat_name, phone_num, hotel_stay_start, hotel_stay_end, id_pat_type) VALUES
(0, 'Alex Green', '555-0000', '2024-01-01 07:00:00', '2024-01-01 17:00:00', 0),
(1, 'John Doe', '555-1234', '2024-01-01 08:00:00', '2024-01-02 18:00:00', 1),
(2, 'Jane Roe', '555-5678', '2024-01-03 09:00:00', '2024-01-04 19:00:00', 2),
(3, 'Chris Lee', '555-9012', '2024-01-05 10:00:00', '2024-01-06 20:00:00', 3);

-- Insert data into bed table
INSERT INTO LRC_CALENDAR_PAGE_bed (id_bed, bed_name, id_room) VALUES
(0, 'Bed A0', 0),
(1, 'Bed A1', 1),
(2, 'Bed B1', 2);

-- Insert data into sauna table
INSERT INTO LRC_CALENDAR_PAGE_sauna (id_sauna, date_and_time, id_patient, notes, id_doctor) VALUES
(0, '2024-01-01 09:00:00', 0, 'Introductory session', 0),
(1, '2024-01-01 10:00:00', 1, 'Initial session', 1),
(2, '2024-01-03 11:00:00', 2, 'Follow-up session', 2);

-- Insert data into beds table
INSERT INTO LRC_CALENDAR_PAGE_beds (id_beds, id_room, id_patient, begin_date, end_date, notes) VALUES
(0, 0, 0, '2024-01-01 07:00:00', '2024-01-01 17:00:00', 'Short stay'),
(1, 1, 1, '2024-01-01 08:00:00', '2024-01-02 18:00:00', 'Post-operation recovery'),
(2, 2, 2, '2024-01-03 09:00:00', '2024-01-04 19:00:00', 'Overnight monitoring');

-- Insert data into beds4 table
INSERT INTO LRC_CALENDAR_PAGE_beds4 (id_beds4, id_room, id_patient, begin_date, end_date, notes) VALUES
(0, 0, 0, '2024-01-01 07:00:00', '2024-01-01 17:00:00', 'Introductory stay'),
(1, 1, 3, '2024-01-05 10:00:00', '2024-01-06 20:00:00', 'Short stay for observation');