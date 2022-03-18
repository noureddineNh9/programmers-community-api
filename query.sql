DROP DATABASE IF EXISTS espace_programmeur_db;

create database espace_programmeur_db;

use espace_programmeur_db;

CREATE TABLE Compte (
   email VARCHAR(25) NOT NULL,
   password VARCHAR(25) NOT NULL,
   type ENUM('enseignant', 'programmeur'),
   PRIMARY KEY (email)
);

CREATE TABLE Programmeur (
   id INT NOT NULL AUTO_INCREMENT,
   nom VARCHAR(25) NOT NULL,
   prenom VARCHAR(25) NOT NULL,
   score int DEFAULT 0,
   image_profile VARCHAR(50),
   email VARCHAR(25),
   PRIMARY KEY (id),
   CONSTRAINT fk_compte FOREIGN KEY (email) REFERENCES Compte(email)
);

CREATE TABLE Groupe (
   id INT NOT NULL AUTO_INCREMENT,
   nom VARCHAR(25) NOT NULL,
   creer_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
);

ALTER TABLE Programmeur 
ADD id_groupe INT,
ADD CONSTRAINT fk_groupe FOREIGN KEY (id_groupe) REFERENCES Groupe(id);

/* */

CREATE TABLE Enseignant (
   cin VARCHAR(10) NOT NULL,
   nom VARCHAR(25) NOT NULL,
   prenom VARCHAR(25) NOT NULL,
   image_profile VARCHAR(50),
   langagues JSON NOT NULL,
   email VARCHAR(25),
   PRIMARY KEY (cin),
   CONSTRAINT fk_enseignant_compte FOREIGN KEY (email) REFERENCES Compte(email)
);

CREATE TABLE Email (
   id INT NOT NULL AUTO_INCREMENT,
   objet VARCHAR(50) NOT NULL,
   contenu TEXT,
   creer_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   email_emetteur VARCHAR(25) NOT NULL,
   email_destinataire VARCHAR(25) NOT NULL,
   PRIMARY KEY (id),
   CONSTRAINT fk_email_emetteur FOREIGN KEY (email_emetteur) REFERENCES Compte(email),
   CONSTRAINT fk_email_destinataire FOREIGN KEY (email_destinataire) REFERENCES Compte(email)
);

CREATE TABLE MessagePersonnel (
   id INT NOT NULL AUTO_INCREMENT,
   contenu VARCHAR(255),
   creer_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   id_emetteur INT NOT NULL,
   id_destinataire INT NOT NULL,
   PRIMARY KEY (id),
   CONSTRAINT fk_msg_p_emetteur FOREIGN KEY (id_emetteur) REFERENCES Programmeur(id),
   CONSTRAINT fk_msg_p_destinataire FOREIGN KEY (id_destinataire) REFERENCES Programmeur(id)
);


CREATE TABLE MessageGroupe (
   id INT NOT NULL AUTO_INCREMENT,
   contenu TEXT,
   creer_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   id_emetteur INT NOT NULL,
   id_groupe INT NOT NULL,
   PRIMARY KEY (id),
   CONSTRAINT fk_msg_g_emetteur FOREIGN KEY (id_emetteur) REFERENCES Programmeur(id),
   CONSTRAINT fk_msg_g_groupe FOREIGN KEY (id_groupe) REFERENCES Groupe(id)
);
CREATE TABLE MiniProjet(
   id INT NOT NULL AUTO_INCREMENT,
   titre VARCHAR(50) NOT NULL,
   description TEXT NOT NULL,
   cin_enseignant VARCHAR(10) not NULL,
   PRIMARY KEY (id),
   CONSTRAINT fk_mini_enseignant FOREIGN KEY(cin_enseignant) REFERENCES Enseignant(cin)
);
CREATE TABLE Question(
   id INT NOT NULL AUTO_INCREMENT,
   titre VARCHAR(50) NOT NULL,
   description TEXT NOT NULL,
   id_programmeur int NOT NULL,
   PRIMARY KEY (id),
   CONSTRAINT fk_qst_programmeur FOREIGN KEY(id_programmeur) REFERENCES Programmeur(id)
);
CREATE TABLE Reponse(
   id INT NOT NULL AUTO_INCREMENT,
   description TEXT NOT NULL,
   id_question int Not NULL,
   PRIMARY KEY(id),
   CONSTRAINT fk_rep_question FOREIGN KEY(id_question) REFERENCES Question(id)

);
CREATE TABLE Achievement(
   id INT NOT NULL AUTO_INCREMENT,
   titre VARCHAR(50) NOT NULL,
   description TEXT NOT NULL,
   id_programmeur int NOT NULL,
   PRIMARY KEY (id),
   CONSTRAINT fk_achie_programmeur FOREIGN KEY(id_programmeur) REFERENCES Programmeur(id)

);
CREATE TABLE Commentaire(
   id INT NOT NULL AUTO_INCREMENT,
   description VARCHAR(255) NOT NULL,
   id_achievement int NOT NULL,
   PRIMARY KEY(id),
   CONSTRAINT fk_comm_achievement FOREIGN KEY(id_achievement) REFERENCES Achievement(id)
);


ALTER TABLE Reponse 
ADD id_programmeur INT NOT NULL,
ADD CONSTRAINT fk_rep_id_prog FOREIGN KEY (id_programmeur) REFERENCES Programmeur(id);


--------------------------- V2 ----------------------------------

CREATE TABLE Projet (
   id INT NOT NULL AUTO_INCREMENT,
   titre VARCHAR(255) NOT NULL,
   description TEXT NOT NULL,   
   creer_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   id_proprietaire int NOT NULL,
   PRIMARY KEY (id),
   CONSTRAINT fk_proprietaire FOREIGN KEY (id_proprietaire) REFERENCES Programmeur(id)
);

CREATE TABLE ProjetParticipant(
   id_programmeur int NOT NULL,
   id_projet int NOT NULL,
   CONSTRAINT fk_praticipant_prog FOREIGN KEY (id_programmeur) REFERENCES Programmeur(id),   
   CONSTRAINT fk_praticipant_proj FOREIGN KEY (id_projet) REFERENCES Projet(id)
);

CREATE TABLE Tache (
   id INT NOT NULL AUTO_INCREMENT,
   titre VARCHAR(255) NOT NULL,
   description TEXT NOT NULL,   
   priorite VARCHAR(25) DEFAULT 'normale',
   creer_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   id_projet int NOT NULL,
   PRIMARY KEY (id),
   FOREIGN KEY (id_projet) REFERENCES Projet(id)
);

CREATE TABLE SousTache (
   id INT NOT NULL AUTO_INCREMENT,
   titre VARCHAR(255) NOT NULL,
   description TEXT NOT NULL,   
   creer_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   id_tache int NOT NULL,
   PRIMARY KEY (id),
   FOREIGN KEY (id_tache) REFERENCES Tache(id)
);



CREATE TABLE AssocieSousTache(
   id_programmeur int NOT NULL,
   id_sous_tache int NOT NULL,
   FOREIGN KEY (id_programmeur) REFERENCES Programmeur(id), 
   FOREIGN KEY (id_sous_tache) REFERENCES SousTache(id)
);


ALTER TABLE SousTache 
ADD id_programmeur INT,
ADD FOREIGN KEY (id_programmeur) REFERENCES Programmeur(id);


ALTER TABLE SousTache 
ADD completed boolean DEFAULT 0;

ALTER TABLE Tache 
ADD status ENUM('aFaire', 'enCours', 'complete') DEFAULT 'aFaire';

/*

INSERT INTO Compte(email, password, type) values ('email1', 'pass1', 'aaa');

*/
- Groupe (id, nom )

--  ************************ register Procedure ***********************

DROP PROCEDURE IF EXISTS register_procedure;
DELIMITER $$
CREATE PROCEDURE register_procedure(
    IN v_nom varchar(25), 
    IN v_prenom varchar(25), 
    IN v_email varchar(25), 
    IN v_password varchar(25),
    IN v_image_profile varchar(225)

)
BEGIN

    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
    	ROLLBACK;
        SIGNAL SQLSTATE '23000'
			SET MESSAGE_TEXT = 'Error in creating user';
     	-- SELECT 'Error creating user' AS error;
    END;
   
    START TRANSACTION;
    
    INSERT INTO Compte(email, password, type)
    VALUES(v_email,v_password, 'programmeur');
        
    INSERT INTO Programmeur(nom, prenom, email, image_profile)
    VALUES(v_nom, v_prenom, v_email, v_image_profile);
    
    COMMIT;
    
    SELECT * 
    FROM Programmeur
    WHERE v_email = email 
    LIMIT 1;
    
END$$

DELIMITER;