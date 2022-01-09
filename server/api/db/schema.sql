DROP TABLE IF EXISTS event_table CASCADE;
DROP TABLE IF EXISTS day_of_week CASCADE;
DROP TABLE IF EXISTS user_table CASCADE;

CREATE TABLE user_table (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        username VARCHAR(50),
        user_type VARCHAR(14) DEFAULT 'student',
        semester_start VARCHAR(10),
        semester_end VARCHAR(10)
);

CREATE TABLE day_of_week (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    day_name VARCHAR(9) NOT NULL
);

CREATE TABLE event_table (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        event_name VARCHAR(50),
        event_type VARCHAR(7) DEFAULT 'custom',
        event_priority BIGINT DEFAULT 1,
        start_time VARCHAR(5) NOT NULL,
        end_time VARCHAR(5),
        u_id BIGINT REFERENCES user_table(id) NOT NULL,
        day_id BIGINT REFERENCES day_of_week(id) NOT NULL,
        event_location VARCHAR(50)
);

INSERT INTO user_table(username) VALUES 
        ('Sam Frost')
;

INSERT INTO day_of_week(day_name) VALUES
    ('Sunday'),
    ('Monday'),
    ('Tuesday'),
    ('Wenesday'),
    ('Thursday'),
    ('Friday'),
    ('Saturday')
;

INSERT INTO event_table(event_name, event_type, event_priority, start_time, end_time, u_id, day_id) VALUES 
        ('Breakfast', 'special', 2, '7:15', '7:45', 1, 1),
        ('Lunch', 'special', 2, '12:15', '12:45', 1, 1),
        ('Dinner', 'special', 2, '17:15', '17:45', 1, 1),
        ('Sleep', 'special', 2, '23:00', '7:00', 1, 1),
        ('Breakfast', 'special', 2, '7:15', '7:45', 1, 2),
        ('Lunch', 'special', 2, '12:15', '12:45', 1, 2),
        ('Dinner', 'special', 2, '17:15', '17:45', 1, 2),
        ('Sleep', 'special', 2, '23:00', '7:00', 1, 2),
        ('Breakfast', 'special', 2, '7:15', '7:45', 1, 3),
        ('Lunch', 'special', 2, '12:15', '12:45', 1, 3),
        ('Dinner', 'special', 2, '17:15', '17:45', 1, 3),
        ('Sleep', 'special', 2, '23:00', '7:00', 1, 3),
        ('Breakfast', 'special', 2, '7:15', '7:45', 1, 4),
        ('Lunch', 'special', 2, '12:15', '12:45', 1, 4),
        ('Dinner', 'special', 2, '17:15', '17:45', 1, 4),
        ('Sleep', 'special', 2, '23:00', '7:00', 1, 4),
        ('Breakfast', 'special', 2, '7:15', '7:45', 1, 5),
        ('Lunch', 'special', 2, '12:15', '12:45', 1, 5),
        ('Dinner', 'special', 2, '17:15', '17:45', 1, 5),
        ('Sleep', 'special', 2, '23:00', '7:00', 1, 5),
        ('Breakfast', 'special', 2, '7:15', '7:45', 1, 6),
        ('Lunch', 'special', 2, '12:15', '12:45', 1, 6),
        ('Dinner', 'special', 2, '17:15', '17:45', 1, 6),
        ('Sleep', 'special', 2, '23:00', '7:00', 1, 6),
        ('Breakfast', 'special', 2, '7:15', '7:45', 1, 7),
        ('Lunch', 'special', 2, '12:15', '12:45', 1, 7),
        ('Dinner', 'special', 2, '17:15', '17:45', 1, 7),
        ('Sleep', 'special', 2, '23:00', '7:00', 1, 7)
;

INSERT INTO event_table(event_name, event_type, event_priority, start_time, end_time, event_location, u_id, day_id) VALUES 
        ('SWEN-262', 'school', 3, '10:00', '10:50', 'Golisano 1650', 1, 2),
        ('SWEN-262', 'school', 3, '10:00', '10:50', 'Golisano 1650', 1, 4),
        ('SWEN-262', 'school', 3, '10:00', '10:50', 'Golisano 1650', 1, 6),
        ('MATH-231 Recitation', 'school', 3, '11:00', '11:50', 'Gleason 2129', 1, 2),
        ('SWEN-256', 'school', 3, '13:00', '13:50', 'Golisano 1650', 1, 2),
        ('SWEN-256', 'school', 3, '13:00', '13:50', 'Golisano 1650', 1, 4),
        ('SWEN-256', 'school', 3, '13:00', '13:50', 'Golisano 1650', 1, 6),
        ('STAT-205', 'school', 3, '15:00', '15:50', 'CBT 1160', 1, 2),
        ('STAT-205', 'school', 3, '15:00', '15:50', 'CBT 1160', 1, 4),
        ('STAT-205', 'school', 3, '15:00', '15:50', 'CBT 1160', 1, 6),
        ('ISTE-230', 'school', 3, '11:00', '12:15', 'Golisano 2650', 1, 3),
        ('ISTE-230', 'school', 3, '11:00', '12:15', 'Golisano 2650', 1, 5),
        ('MATH-231', 'school', 3, '14:00', '15:15', 'Gosnell 1250', 1, 3),
        ('MATH-231', 'school', 3, '14:00', '15:15', 'Gosnell 1250', 1, 5),
        ('Work', 'work', 3, '8:00', '9:50', 'Golisano 1650', 1, 2),
        ('Work', 'work', 3, '8:00', '9:50', 'Golisano 1650', 1, 4),
        ('Work', 'work', 3, '8:00', '9:50', 'Golisano 1650', 1, 6),
        ('Office Hours', 'work', 3, '12:00', '14:00', 'My room', 1, 1),
        ('Office Hours', 'work', 3, '12:00', '14:00', 'My room', 1, 7),
        ('SWEN-262 Homework', 'school', 1, '10:50', '11:50', 'Golisano 1650', 1, 2),
        ('SWEN-262 Homework', 'school', 1, '10:50', '11:50', 'Golisano 1650', 1, 4),
        ('SWEN-262 Homework', 'school', 1, '10:50', '11:50', 'Golisano 1650', 1, 6),
        ('MATH-231 Recitation Homework', 'school', 1, '11:50', '12:50', 'Gleason 2129', 1, 2),
        ('SWEN-256 Homework', 'school', 1, '13:50', '14:50', 'Golisano 1650', 1, 2),
        ('SWEN-256 Homework', 'school', 1, '13:50', '14:50', 'Golisano 1650', 1, 4),
        ('SWEN-256 Homework', 'school', 1, '13:50', '14:50', 'Golisano 1650', 1, 6),
        ('STAT-205 Homework', 'school', 1, '15:50', '16:50', 'CBT 1160', 1, 2),
        ('STAT-205 Homework', 'school', 1, '15:50', '16:50', 'CBT 1160', 1, 4),
        ('STAT-205 Homework', 'school', 1, '15:50', '16:50', 'CBT 1160', 1, 6),
        ('ISTE-230 Homework', 'school', 1, '12:15', '13:15', 'Golisano 2650', 1, 3),
        ('ISTE-230 Homework', 'school', 1, '12:15', '13:15', 'Golisano 2650', 1, 5),
        ('MATH-231 Homework', 'school', 1, '15:15', '16:15', 'Gosnell 1250', 1, 3),
        ('MATH-231 Homework', 'school', 1, '15:15', '16:15', 'Gosnell 1250', 1, 5)
;