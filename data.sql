
CREATE DATABASE redcarpet;

\c redcarpet;

CREATE TABLE data (
  name text,
  lat real,
  long real,
);

INSERT INTO pups (name, breed, age, sex)
  VALUES ('Tyler', 'Retrieved', 3, 'M');
