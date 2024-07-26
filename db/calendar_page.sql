---------------------------------TABULAS----------------------------------------

CREATE TABLE LRC_CALENDAR_PAGE_patient (
	id                  SERIAL PRIMARY KEY, 
	pat_name            VARCHAR(80), 
	phone_num           VARCHAR(45)
);

CREATE TABLE LRC_CALENDAR_PAGE_floor (
    id              SERIAL PRIMARY KEY,
    floor_name      VARCHAR(80)
);

CREATE TABLE LRC_CALENDAR_PAGE_room (
    id          SERIAL PRIMARY KEY,
    room_num    VARCHAR(10),
    id_floor    INT,
    FOREIGN KEY (id_floor) REFERENCES LRC_CALENDAR_PAGE_floor(id)
);

CREATE TABLE LRC_CALENDAR_PAGE_bed (
    id          SERIAL PRIMARY KEY,
    bed_name    VARCHAR(80), 
    id_room     INT,
    FOREIGN KEY (id_room) REFERENCES LRC_CALENDAR_PAGE_room(id)
);

CREATE TABLE LRC_CALENDAR_PAGE_doctor (
	id 	        SERIAL PRIMARY KEY, 
	doc_name 	VARCHAR(80)
);

CREATE TABLE LRC_CALENDAR_PAGE_appointment_type (
	id 	            SERIAL PRIMARY KEY,  
	type_name 	    VARCHAR(7)
);

CREATE TABLE LRC_CALENDAR_PAGE_drag_table_appointment (
    id                  SERIAL PRIMARY KEY,
    id_room             INT,
    id_patient          INT,
    begin_date          TIMESTAMP,
    end_date            TIMESTAMP,
    notes               TEXT,
    id_doctor           INT,
	hotel_stay_start    TIMESTAMP, 
	hotel_stay_end      TIMESTAMP, 
	id_appointment_type INT,
    FOREIGN KEY (id_room) REFERENCES LRC_CALENDAR_PAGE_room(id),
    FOREIGN KEY (id_patient) REFERENCES LRC_CALENDAR_PAGE_patient(id),
    FOREIGN KEY (id_doctor) REFERENCES LRC_CALENDAR_PAGE_doctor(id),
    FOREIGN KEY (id_appointment_type) REFERENCES LRC_CALENDAR_PAGE_appointment_type(id)
);

CREATE TABLE LRC_CALENDAR_PAGE_drag_table_disallowed (
    id                  SERIAL PRIMARY KEY,
    begin_date          TIMESTAMP,
    end_date            TIMESTAMP,
    notes               TEXT
);

CREATE TABLE LRC_CALENDAR_PAGE_input_table_appointment (
    id                  SERIAL PRIMARY KEY,
    id_patient          INT,
    begin_date          TIMESTAMP,
    notes               TEXT,
    id_doctor           INT,
    FOREIGN KEY (id_patient) REFERENCES LRC_CALENDAR_PAGE_patient(id),
    FOREIGN KEY (id_doctor) REFERENCES LRC_CALENDAR_PAGE_doctor(id)
);

------------------------DATI----------------------------

-- Insert data into LRC_CALENDAR_PAGE_patient
INSERT INTO LRC_CALENDAR_PAGE_patient (id, pat_name, phone_num) VALUES
(0, 'John Doe', '123-456-7890'),
(1, 'Jane Smith', '234-567-8901'),
(2, 'Alice Johnson', '345-678-9012'),
(3, 'Bob Brown', '456-789-0123');

-- Insert data into LRC_CALENDAR_PAGE_floor
INSERT INTO LRC_CALENDAR_PAGE_floor (id, floor_name) VALUES
(0, 'Ground Floor'),
(1, 'First Floor'),
(2, 'Second Floor');

-- Insert data into LRC_CALENDAR_PAGE_room
INSERT INTO LRC_CALENDAR_PAGE_room (id, room_num, id_floor) VALUES
(0, '101', 0),
(1, '102', 0),
(2, '201', 1),
(3, '202', 1),
(4, '301', 2),
(5, '302', 2);

-- Insert data into LRC_CALENDAR_PAGE_bed
INSERT INTO LRC_CALENDAR_PAGE_bed (id, bed_name, id_room) VALUES
(0, 'Bed A', 0),
(1, 'Bed B', 0),
(2, 'Bed A', 2),
(3, 'Bed B', 2),
(4, 'Bed A', 4),
(5, 'Bed B', 4);

-- Insert data into LRC_CALENDAR_PAGE_doctor
INSERT INTO LRC_CALENDAR_PAGE_doctor (id, doc_name) VALUES
(0, 'Dr. Alice Walker'),
(1, 'Dr. Robert Langdon'),
(2, 'Dr. Emily Stone');

-- Insert data into LRC_CALENDAR_PAGE_appointment_type
INSERT INTO LRC_CALENDAR_PAGE_appointment_type (id, type_name) VALUES
(0, 'AAA'),
(1, 'BBB'),
(2, 'CCC'),
(3, 'DDD');

-- Insert data into LRC_CALENDAR_PAGE_drag_table_appointment
INSERT INTO LRC_CALENDAR_PAGE_drag_table_appointment (
    id,
    id_room, 
    id_patient, 
    begin_date, 
    end_date, 
    notes, 
    id_doctor, 
    hotel_stay_start, 
    hotel_stay_end, 
    id_appointment_type
) VALUES
(0, 0, 1, '2024-08-01 10:00:00', '2024-08-05 11:00:00', 'Routine checkup', 0, '2024-08-01 09:00:00', '2024-08-01 12:00:00', 0),
(1, 2, 2, '2024-08-10 12:00:00', '2024-08-15 13:00:00', 'Follow-up visit', 1, '2024-08-01 11:00:00', '2024-08-01 14:00:00', 1),
(2, 3, 3, '2024-08-20 09:00:00', '2024-08-24 10:00:00', 'Consultation on surgery', 2, '2024-08-02 08:00:00', '2024-08-02 11:00:00', 3);

-- Insert data into LRC_CALENDAR_PAGE_input_table_appointment
INSERT INTO LRC_CALENDAR_PAGE_input_table_appointment (id, id_patient, begin_date, notes, id_doctor) VALUES
(0, 0, '2024-08-01 10:00:00', 'Routine checkup', 0),
(1, 1, '2024-08-01 12:00:00', 'Follow-up visit', 1),
(3, 2, '2024-08-02 09:00:00', 'Consultation on surgery', 2);
