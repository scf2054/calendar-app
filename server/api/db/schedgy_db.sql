DROP TABLE IF EXISTS timeframe;

CREATE TABLE timeframe (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        start_time TIME NOT NULL,
        end_time TIME
);