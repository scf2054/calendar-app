DROP TABLE IF EXISTS event_table;
DROP TABLE IF EXISTS calendar_table;
DROP TABLE IF EXISTS user_table;

CREATE TABLE user_table (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        username VARCHAR(20),
        user_type VARCHAR(6) DEFAULT 'other'
);

CREATE TABLE event_table (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        event_name VARCHAR(50),
        event_type VARCHAR(7) DEFAULT 'custom',
        event_priority BIGINT DEFAULT 1,
        start_time VARCHAR(5) NOT NULL,
        end_time VARCHAR(5),
        event_location VARCHAR(50),
        has_lunch BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE calendar_table (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        u_id INT NOT NULL REFERENCES user_table(id),
        sunday VARCHAR(50),
        monday VARCHAR(50),
        tuesday VARCHAR(50),
        wednesday VARCHAR(50),
        thursday VARCHAR(50),
        friday VARCHAR(50),
        saturday VARCHAR(50)
);

INSERT INTO user_table(username, user_type) VALUES 
        ('Sam Frost', 'hybrid')
;

INSERT INTO event_table(event_name, event_type, event_priority, start_time, end_time) VALUES 
        ('Breakfast', 'special', 2, '7:15', '7:45'),
        ('Lunch', 'special', 2, '12:15', '12:45'),
        ('Dinner', 'special', 2, '17:15', '17:45'),
        ('Sleep', 'special', 2, '23:00', '7:00')
;

INSERT INTO event_table(event_name, event_type, event_priority, start_time, end_time, event_location) VALUES 
        ('SWEN-262', 'school', 3, '10:00', '10:50', 'Golisano 1650'),
        ('MATH-231 Recitation', 'school', 3, '11:00', '11:50', 'Gleason 2129'),
        ('SWEN-256', 'school', 3, '13:00', '13:50', 'Golisano 1650'),
        ('STAT-205', 'school', 3, '15:00', '15:50', 'CBT 1160'),
        ('ISTE-230', 'school', 3, '11:00', '12:15', 'Golisano 2650'),
        ('MATH-231', 'school', 3, '14:00', '15:15', 'Gosnell 1250'),
        ('Work', 'work', 3, '8:00', '9:50', 'Golisano 1650'),
        ('Office Hours', 'work', 3, '12:00', '14:00', 'My room')
;

INSERT INTO event_table(event_name, event_type, event_priority, start_time, end_time, event_location) VALUES 
        ('SWEN-262 Homework', 'school', 1, '10:50', '11:50', 'Golisano 1650'),
        ('MATH-231 Recitation Homework', 'school', 1, '11:50', '12:50', 'Gleason 2129'),
        ('SWEN-256 Homework', 'school', 1, '13:50', '14:50', 'Golisano 1650'),
        ('STAT-205 Homework', 'school', 1, '15:50', '16:50', 'CBT 1160'),
        ('ISTE-230 Hoework', 'school', 1, '12:15', '13:15', 'Golisano 2650'),
        ('MATH-231 Homework', 'school', 1, '15:15', '16:15', 'Gosnell 1250')
;

INSERT INTO calendar_table(u_id, sunday, monday, tuesday, wednesday, thursday, friday, saturday) VALUES 
        (1, '12,1,2,3,4', '5,6,7,8,11,1,2,3,4,13,14,15,16', '9,10,1,2,3,4,17,18', '5,7,8,11,1,2,3,4,13,15,16', '9,10,1,2,3,4,17,18', '5,7,8,11,1,2,3,4,13,15,16', '12,1,2,3,4')
;

