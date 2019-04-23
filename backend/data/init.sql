/* Status can be In Use, Deprecated
We can add more later e.g. Rename*/

CREATE TYPE acronym_status AS ENUM ('In Use', 'Deprecated');

CREATE TABLE IF NOT EXISTS acronym_data_table (
    index SERIAL UNIQUE,
    title VARCHAR(128),
    fullname VARCHAR(256),
    url VARCHAR(512),
    description TEXT,
    createDateTime TIMESTAMP WITH TIME ZONE,
    acronymType VARCHAR(128),
    status acronym_status,
    language VARCHAR(128),
    PRIMARY KEY (index)
);

CREATE UNIQUE INDEX data_conflict ON acronym_data_table (title, url, acronymType);

CREATE TABLE IF NOT EXISTS acronym_type_table (
    typeId SERIAL UNIQUE,
    acronymType VARCHAR(128),
    description VARCHAR(512),
    PRIMARY KEY (typeId)
);

/*
Out of the box types supported:
Organization, Software, Service, Technology, Project, Miscellaneous
*/

INSERT INTO acronym_type_table (acronymType, description) VALUES
('Organization', 'Any form of organizational structure Institution, Company, Group or Team'),
('Software', 'A software product/application, be it open source, commercial or even a simple script'),
('Service', 'A system supplying a need usually in the form of a product. A Service can be made up of one or multiple software applications.'),
('Technology', 'Any technology related form that does not translate into a Software or Service, most of the time representing an abstract concept.'),
('Project', 'A proposed undertaking carefully planned to achieve a particular aim.'),
('Miscellaneous', 'Random diverse thing that does not fit into any of the other categories');
