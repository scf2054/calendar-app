DROP TABLE IF EXISTS event_table;
DROP TABLE IF EXISTS user_table;

CREATE TABLE user_table (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        username VARCHAR(20),
        pass_word VARCHAR(128) NOT NULL,
        session_key VARCHAR(25) DEFAULT NULL,
        user_type VARCHAR(6) DEFAULT 'other'
);

CREATE TABLE event_table (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        event_name VARCHAR(50),
        event_type VARCHAR(7) DEFAULT 'custom',
        event_priority BIGINT DEFAULT 1,
        start_time TIME NOT NULL,
        end_time TIME,
        event_location VARCHAR(50),
        u_id INT REFERENCES user_table(id)
);

INSERT INTO user_table(username, pass_word, session_key, user_type) VALUES 
        ('Sam Frost', 'whatever password', 'iwr27v2uvb2', 'hybrid');

INSERT INTO event_table(event_name, event_type, event_priority, start_time, end_time, event_location, u_id) VALUES 
        ('SWEN-262', 'school', 3, '10:00', '10:50', 'Golisano 1650', 1);