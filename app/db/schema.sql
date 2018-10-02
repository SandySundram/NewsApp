DROP DATABASE IF EXISTS friendfinder_db;
CREATE DATABASE friendfinder_db;
USE friendfinder_db;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  question1 INT NOT NULL,
  question2 INT NOT NULL,
  question3 INT NOT NULL,
  question4 INT NOT NULL,
  question5 INT NOT NULL,
  question6 INT NOT NULL,
  question7 INT NOT NULL,
  question8 INT NOT NULL,
  question9 INT NOT NULL,
  question10 INT NOT NULL,
  photourl VARCHAR (255),
  PRIMARY KEY (id)
);

INSERT INTO users (full_name,question1,question2,question3,question4,question5,question6,question7,question8,question9,question10,photourl)
VALUES ('John',1,3,2,5,3,2,2,4,5,3,'John.jpeg');