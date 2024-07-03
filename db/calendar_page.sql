---------------------------------TABULAS----------------------------------------

CREATE TABLE LRC_CALENDAR_PAGE_patient_type (
	id_pat_type 	INT PRIMARY KEY,  
	pat_type 	    VARCHAR(7)
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

CREATE TABLE LRC_CALENDAR_PAGE_floor (
    id_floor        INT PRIMARY KEY,
    floor_name      VARCHAR(80)
);

CREATE TABLE LRC_CALENDAR_PAGE_room (
    id_room     INT PRIMARY KEY,
    room_num    VARCHAR(10),
    id_floor    INT,
    FOREIGN KEY (id_floor) REFERENCES LRC_CALENDAR_PAGE_floor(id_floor)
);

CREATE TABLE LRC_CALENDAR_PAGE_bed (
    id_bed      INT PRIMARY KEY,
    bed_name    VARCHAR(80), 
    id_room     INT,
    FOREIGN KEY (id_room) REFERENCES LRC_CALENDAR_PAGE_room(id_room)
);

CREATE TABLE LRC_CALENDAR_PAGE_doctor (
	id_doctor 	INT PRIMARY KEY, 
	doc_name 	VARCHAR(80)
);

CREATE TABLE LRC_CALENDAR_PAGE_event (
    id_beds         INT PRIMARY KEY,
    id_room         INT,
    id_patient      INT,
    begin_date      TIMESTAMP,
    end_date        TIMESTAMP,
    notes           TEXT,
    id_doctor       INT,
    FOREIGN KEY (id_room) REFERENCES LRC_CALENDAR_PAGE_room(id_room),
    FOREIGN KEY (id_patient) REFERENCES LRC_CALENDAR_PAGE_patient(id_patient),
    FOREIGN KEY (id_doctor) REFERENCES LRC_CALENDAR_PAGE_doctor(id_doctor)
);

------------------------DATI----------------------------

INSERT INTO LRC_CALENDAR_PAGE_patient_type (id_pat_type, pat_type) VALUES
(0, 'AAA'),
(1, 'BBB'),
(2, 'CCC'),
(3, 'DDD');

INSERT INTO LRC_CALENDAR_PAGE_patient 
(id_patient, pat_name, phone_num, hotel_stay_start, hotel_stay_end, id_pat_type) VALUES
(0, 'John Doe', '555-1234', '2024-06-01 12:00:00', '2024-06-05 11:00:00', 0),
(1, 'Jane Smith', '555-5678', '2024-06-02 14:00:00', '2024-06-06 10:00:00', 1),
(2, 'Bob Johnson', '555-8765', '2024-06-03 16:00:00', '2024-06-07 09:00:00', 2),
(3, 'Alice Davis', '555-4321', '2024-06-04 18:00:00', '2024-06-08 08:00:00', 3);

INSERT INTO LRC_CALENDAR_PAGE_floor (id_floor, floor_name) VALUES
(0, 'Ground Floor'),
(1, 'First Floor'),
(2, 'Second Floor');

INSERT INTO LRC_CALENDAR_PAGE_room (id_room, room_num, id_floor) VALUES
(0, '001', 0),
(1, '101', 1),
(2, '201', 2);

INSERT INTO LRC_CALENDAR_PAGE_bed (id_bed, bed_name, id_room) VALUES
(0, 'Bed A', 0),
(1, 'Bed B', 0),
(2, 'Bed C', 1),
(3, 'Bed D', 1),
(4, 'Bed E', 2),
(5, 'Bed F', 2);

INSERT INTO LRC_CALENDAR_PAGE_doctor (id_doctor, doc_name) VALUES
(0, 'Dr. Emily Carter'),
(1, 'Dr. Michael Brown'),
(2, 'Dr. Sarah Wilson');

INSERT INTO LRC_CALENDAR_PAGE_event (id_beds, id_room, id_patient, begin_date, end_date, notes, id_doctor) VALUES
(0, 0, 0, '2024-06-01 12:00:00', '2024-06-05 11:00:00', 'Routine check-up', 0),
(1, 1, 1, '2024-06-02 14:00:00', '2024-06-06 10:00:00', 'VIP patient, regular monitoring', 1),
(2, 2, 2, '2024-06-03 16:00:00', '2024-06-07 09:00:00', 'Emergency surgery', 2),
(3, 1, 3, '2024-06-04 18:00:00', '2024-06-08 08:00:00', 'Outpatient procedure', 0);


