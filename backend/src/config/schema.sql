
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  experience INT NOT NULL,
  qualifications TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  fees DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2),
  recommendations INT DEFAULT 0,
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS consultation_modes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);


CREATE TABLE IF NOT EXISTS languages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);


CREATE TABLE IF NOT EXISTS facilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);


CREATE TABLE IF NOT EXISTS doctor_consultation_modes (
  doctor_id INT NOT NULL,
  mode_id INT NOT NULL,
  PRIMARY KEY (doctor_id, mode_id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (mode_id) REFERENCES consultation_modes(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS doctor_languages (
  doctor_id INT NOT NULL,
  language_id INT NOT NULL,
  PRIMARY KEY (doctor_id, language_id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS doctor_facilities (
  doctor_id INT NOT NULL,
  facility_id INT NOT NULL,
  PRIMARY KEY (doctor_id, facility_id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE
);


INSERT INTO consultation_modes (name) VALUES 
('Online'),
('Hospital Visit')
ON DUPLICATE KEY UPDATE name = VALUES(name);


INSERT INTO languages (name) VALUES 
('English'),
('Hindi'),
('Tamil'),
('Telugu'),
('Malayalam'),
('Kannada'),
('Bengali'),
('Gujarati'),
('Marathi'),
('Punjabi')
ON DUPLICATE KEY UPDATE name = VALUES(name);


INSERT INTO facilities (name) VALUES 
('Apollo Hospital'),
('Apollo Clinic'),
('Apollo Spectra'),
('Apollo Medical Centre'),
('Home Visit')
ON DUPLICATE KEY UPDATE name = VALUES(name);
