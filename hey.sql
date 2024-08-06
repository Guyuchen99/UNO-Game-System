-- Drop and create the database
DROP DATABASE IF EXISTS UNOGameSystem2;
CREATE DATABASE IF NOT EXISTS UNOGameSystem2;
USE UNOGameSystem2;

-- Create PlayerUsernameAndEmail table and insert data
CREATE TABLE IF NOT EXISTS PlayerUsernameAndEmail (
    username VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    PRIMARY KEY (username)
); 
INSERT IGNORE INTO PlayerUsernameAndEmail (username, email) 
VALUES 
('Handsome Programmer', 'handsome_programmer@student.ubc.ca'),
('Happy Professor', 'happy_professor@student.ubc.ca'),
('Poor Student', 'poor_student@student.ubc.ca'),
('Selfish Engineer', 'selfish_engineer@student.ubc.ca'),
('Dangerous Salesman', 'dangerous_salesman@student.ubc.ca'), 
('Reliable Developer', 'reliable_developer@student.ubc.ca'),
('Brilliant Analyst', 'brilliant_analyst@student.ubc.ca'),
('Talented Artist', 'talented_artist@student.ubc.ca'),
('Ambitious Entrepreneur', 'ambitious_entrepreneur@student.ubc.ca'),
('Passionate Teacher', 'passionate_teacher@student.ubc.ca'),
('Skilled Mechanic', 'skilled_mechanic@student.ubc.ca'),
('Friendly Receptionist', 'friendly_receptionist@student.ubc.ca'),
('Hardworking Farmer', 'hardworking_farmer@student.ubc.ca'),
('Insightful Consultant', 'insightful_consultant@student.ubc.ca'),
('Curious Researcher', 'curious_researcher@student.ubc.ca'),
('Expert Technician', 'expert_technician@student.ubc.ca'),
('Organized Librarian', 'organized_librarian@student.ubc.ca'),
('Creative Writer', 'creative_writer@student.ubc.ca'),
('Brave Soldier', 'brave_soldier@student.ubc.ca'),
('Efficient Assistant', 'efficient_assistant@student.ubc.ca');

-- Create PlayerLevel table and insert data
CREATE TABLE IF NOT EXISTS PlayerLevel (
    experience_point INT NOT NULL, 
    level INT NOT NULL, 
    PRIMARY KEY (experience_point),
    CHECK (experience_point <= 10000)
);
INSERT IGNORE INTO PlayerLevel (experience_point, level) 
VALUES 
(0, 1),
(1000, 1),
(2000, 2),
(3000, 3),
(4000, 4),
(5000, 5),
(6000, 6),
(7000, 7),
(8000, 8),
(9000, 9),
(10000, 10);

-- Create Players table and insert data
CREATE TABLE IF NOT EXISTS Players (
    player_id INT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    total_win INT DEFAULT 0,
    total_game_count INT DEFAULT 0,
    experience_point INT DEFAULT 0,
    win_rate FLOAT DEFAULT 0,
    country VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (player_id),
    FOREIGN KEY (username) REFERENCES PlayerUsernameAndEmail(username) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (experience_point) REFERENCES PlayerLevel(experience_point) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO Players (username, total_win, total_game_count, win_rate, experience_point, country, password) 
VALUES 
('Reliable Developer', 5, 15, 0.33, 2000, 'Canada', 'xhjanjwnfewhfohuenee'), 
('Brilliant Analyst', 7, 18, 0.39, 4000, 'India', 'qpicuniqxmeuhrhbdndeqw');

-- Create Matches table and insert data
CREATE TABLE IF NOT EXISTS Matches (
    match_id INT AUTO_INCREMENT,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    winner VARCHAR(255),
    status VARCHAR(255) DEFAULT 'In Process',
    PRIMARY KEY (match_id)
); 
INSERT IGNORE INTO Matches (start_time, end_time, winner, status) 
VALUES 
('2024-08-05 10:49:00', '2024-08-05 11:01:00', 'Reliable Developer', 'Completed');

-- Create PlayerInvolveMatches table and insert data
CREATE TABLE IF NOT EXISTS PlayerInvolveMatches (
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    PRIMARY KEY (player_id, match_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO PlayerInvolveMatches (player_id, match_id) 
VALUES 
(1, 1),
(2, 1);

-- Create HandBelongsToPlayerAndMatch table and insert data
CREATE TABLE IF NOT EXISTS HandBelongsToPlayerAndMatch (
    hand_id INT AUTO_INCREMENT,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    card_amount INT DEFAULT 7,
    PRIMARY KEY (hand_id, player_id, match_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO HandBelongsToPlayerAndMatch (player_id, match_id) 
VALUES 
(1, 1),
(2, 1);

-- Create Decks table and insert data
CREATE TABLE IF NOT EXISTS Decks (
    deck_id INT AUTO_INCREMENT,
    card_amount INT DEFAULT 108,
    PRIMARY KEY (deck_id)
); 
INSERT IGNORE INTO Decks (card_amount) 
VALUES 
(108);

-- Create MatchHasDeck table and insert data
CREATE TABLE IF NOT EXISTS MatchHasDeck (
    match_id INT NOT NULL UNIQUE,
    deck_id INT NOT NULL UNIQUE,
    PRIMARY KEY (match_id, deck_id),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (deck_id) REFERENCES Decks(deck_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO MatchHasDeck (match_id, deck_id) 
VALUES 
(1, 1);

-- Create CardBelongsToDeck table and insert data
CREATE TABLE IF NOT EXISTS CardBelongsToDeck (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    name VARCHAR(255) NOT NULL, 
    is_card_in_deck INT DEFAULT 1,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (deck_id) REFERENCES Decks(deck_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
INSERT INTO CardBelongsToDeck (card_id, deck_id, name) 
VALUES
(1, 1, 'Red 0'), 
(2, 1, 'Red 1'), (3, 1, 'Red 1'), (4, 1, 'Red 2'), (5, 1, 'Red 2'),
(6, 1, 'Red 3'), (7, 1, 'Red 3'), (8, 1, 'Red 4'), (9, 1, 'Red 4'),
(10, 1, 'Red 5'), (11, 1, 'Red 5'), (12, 1, 'Red 6'), (13, 1, 'Red 6'),
(14, 1, 'Red 7'), (15, 1, 'Red 7'), (16, 1, 'Red 8'), (17, 1, 'Red 8'),
(18, 1, 'Red 9'), (19, 1, 'Red 9'),
(20, 1, 'Yellow 0'),
(21, 1, 'Yellow 1'), (22, 1, 'Yellow 1'), (23, 1, 'Yellow 2'), (24, 1, 'Yellow 2'),
(25, 1, 'Yellow 3'), (26, 1, 'Yellow 3'), (27, 1, 'Yellow 4'), (28, 1, 'Yellow 4'),
(29, 1, 'Yellow 5'), (30, 1, 'Yellow 5'), (31, 1, 'Yellow 6'), (32, 1, 'Yellow 6'),
(33, 1, 'Yellow 7'), (34, 1, 'Yellow 7'), (35, 1, 'Yellow 8'), (36, 1, 'Yellow 8'),
(37, 1, 'Yellow 9'), (38, 1, 'Yellow 9'),
(39, 1, 'Green 0'),
(40, 1, 'Green 1'), (41, 1, 'Green 1'), (42, 1, 'Green 2'), (43, 1, 'Green 2'),
(44, 1, 'Green 3'), (45, 1, 'Green 3'), (46, 1, 'Green 4'), (47, 1, 'Green 4'),
(48, 1, 'Green 5'), (49, 1, 'Green 5'), (50, 1, 'Green 6'), (51, 1, 'Green 6'),
(52, 1, 'Green 7'), (53, 1, 'Green 7'), (54, 1, 'Green 8'), (55, 1, 'Green 8'),
(56, 1, 'Green 9'), (57, 1, 'Green 9'),
(58, 1, 'Blue 0'),
(59, 1, 'Blue 1'), (60, 1, 'Blue 1'), (61, 1, 'Blue 2'), (62, 1, 'Blue 2'),
(63, 1, 'Blue 3'), (64, 1, 'Blue 3'), (65, 1, 'Blue 4'), (66, 1, 'Blue 4'),
(67, 1, 'Blue 5'), (68, 1, 'Blue 5'), (69, 1, 'Blue 6'), (70, 1, 'Blue 6'),
(71, 1, 'Blue 7'), (72, 1, 'Blue 7'), (73, 1, 'Blue 8'), (74, 1, 'Blue 8'),
(75, 1, 'Blue 9'), (76, 1, 'Blue 9'), 
(77, 1, 'Red Skip'), (78, 1, 'Red Skip'),
(79, 1, 'Yellow Skip'), (80, 1, 'Yellow Skip'),
(81, 1, 'Green Skip'), (82, 1, 'Green Skip'),
(83, 1, 'Blue Skip'), (84, 1, 'Blue Skip'),
(85, 1, 'Red Reverse'), (86, 1, 'Red Reverse'),
(87, 1, 'Yellow Reverse'), (88, 1, 'Yellow Reverse'),
(89, 1, 'Green Reverse'), (90, 1, 'Green Reverse'),
(91, 1, 'Blue Reverse'), (92, 1, 'Blue Reverse'),
(93, 1, 'Red Draw 2'), (94, 1, 'Red Draw 2'),
(95, 1, 'Yellow Draw 2'), (96, 1, 'Yellow Draw 2'),
(97, 1, 'Green Draw 2'), (98, 1, 'Green Draw 2'),
(99, 1, 'Blue Draw 2'), (100, 1, 'Blue Draw 2'), 
(101, 1, 'Wild'), (102, 1, 'Wild'), (103, 1, 'Wild'), (104, 1, 'Wild'),
(105, 1, 'Wild Draw 4'), (106, 1, 'Wild Draw 4'), (107, 1, 'Wild Draw 4'), (108, 1, 'Wild Draw 4');

-- Create NumberCard table and insert data
CREATE TABLE IF NOT EXISTS NumberCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    number INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardBelongsToDeck(card_id, deck_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO NumberCard (card_id, deck_id, number, color) 
VALUES
(1, 1, 0, 'Red'),
(2, 1, 1, 'Red'), (3, 1, 1, 'Red'),
(4, 1, 2, 'Red'), (5, 1, 2, 'Red'),
(6, 1, 3, 'Red'), (7, 1, 3, 'Red'),
(8, 1, 4, 'Red'), (9, 1, 4, 'Red'),
(10, 1, 5, 'Red'), (11, 1, 5, 'Red'),
(12, 1, 6, 'Red'), (13, 1, 6, 'Red'),
(14, 1, 7, 'Red'), (15, 1, 7, 'Red'),
(16, 1, 8, 'Red'), (17, 1, 8, 'Red'),
(18, 1, 9, 'Red'), (19, 1, 9, 'Red'),
(20, 1, 0, 'Yellow'),
(21, 1, 1, 'Yellow'), (22, 1, 1, 'Yellow'),
(23, 1, 2, 'Yellow'), (24, 1, 2, 'Yellow'),
(25, 1, 3, 'Yellow'), (26, 1, 3, 'Yellow'),
(27, 1, 4, 'Yellow'), (28, 1, 4, 'Yellow'),
(29, 1, 5, 'Yellow'), (30, 1, 5, 'Yellow'),
(31, 1, 6, 'Yellow'), (32, 1, 6, 'Yellow'),
(33, 1, 7, 'Yellow'), (34, 1, 7, 'Yellow'),
(35, 1, 8, 'Yellow'), (36, 1, 8, 'Yellow'),
(37, 1, 9, 'Yellow'), (38, 1, 9, 'Yellow'),
(39, 1, 0, 'Green'),
(40, 1, 1, 'Green'), (41, 1, 1, 'Green'),
(42, 1, 2, 'Green'), (43, 1, 2, 'Green'),
(44, 1, 3, 'Green'), (45, 1, 3, 'Green'),
(46, 1, 4, 'Green'), (47, 1, 4, 'Green'),
(48, 1, 5, 'Green'), (49, 1, 5, 'Green'),
(50, 1, 6, 'Green'), (51, 1, 6, 'Green'),
(52, 1, 7, 'Green'), (53, 1, 7, 'Green'),
(54, 1, 8, 'Green'), (55, 1, 8, 'Green'),
(56, 1, 9, 'Green'), (57, 1, 9, 'Green'),
(58, 1, 0, 'Blue'),
(59, 1, 1, 'Blue'), (60, 1, 1, 'Blue'),
(61, 1, 2, 'Blue'), (62, 1, 2, 'Blue'),
(63, 1, 3, 'Blue'), (64, 1, 3, 'Blue'),
(65, 1, 4, 'Blue'), (66, 1, 4, 'Blue'),
(67, 1, 5, 'Blue'), (68, 1, 5, 'Blue'),
(69, 1, 6, 'Blue'), (70, 1, 6, 'Blue'),
(71, 1, 7, 'Blue'), (72, 1, 7, 'Blue'),
(73, 1, 8, 'Blue'), (74, 1, 8, 'Blue'),
(75, 1, 9, 'Blue'), (76, 1, 9, 'Blue');

-- Create SkipCard table and insert data
CREATE TABLE IF NOT EXISTS SkipCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardBelongsToDeck (card_id, deck_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO SkipCard (card_id, deck_id, color) 
VALUES
(77, 1, 'Red'), (78, 1, 'Red'),
(79, 1, 'Yellow'), (80, 1, 'Yellow'),
(81, 1, 'Green'), (82, 1, 'Green'),
(83, 1, 'Blue'), (84, 1, 'Blue');

-- Create ReverseCard table and insert data
CREATE TABLE IF NOT EXISTS ReverseCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardBelongsToDeck (card_id, deck_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO ReverseCard (card_id, deck_id, color) 
VALUES
(85, 1, 'Red'), (86, 1, 'Red'),
(87, 1, 'Yellow'), (88, 1, 'Yellow'),
(89, 1, 'Green'), (90, 1, 'Green'),
(91, 1, 'Blue'), (92, 1, 'Blue');

-- Create Draw2Card table and insert data
CREATE TABLE IF NOT EXISTS Draw2Card (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardBelongsToDeck (card_id, deck_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO Draw2Card (card_id, deck_id, color) 
VALUES
(93, 1, 'Red'), (94, 1, 'Red'),
(95, 1, 'Yellow'), (96, 1, 'Yellow'),
(97, 1, 'Green'), (98, 1, 'Green'),
(99, 1, 'Blue'), (100, 1, 'Blue');

-- Create WildCard table and insert data
CREATE TABLE IF NOT EXISTS WildCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardBelongsToDeck (card_id, deck_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO WildCard (card_id, deck_id) 
VALUES 
(101, 1), (102, 1), (103, 1), (104, 1); 

-- Create WildDraw4Card table and insert data
CREATE TABLE IF NOT EXISTS WildDraw4Card (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardBelongsToDeck (card_id, deck_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO WildDraw4Card (card_id, deck_id) 
VALUES 
(105, 1), (106, 1), (107, 1), (108, 1);

-- Create CardHeldByHand table and insert data
CREATE TABLE IF NOT EXISTS CardHeldByHand (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    hand_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    PRIMARY KEY (card_id, deck_id, hand_id, player_id, match_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardBelongsToDeck(card_id, deck_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (hand_id, player_id, match_id) REFERENCES HandBelongsToPlayerAndMatch(hand_id, player_id, match_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO CardHeldByHand (card_id, deck_id, hand_id, player_id, match_id) 
VALUES 
(77, 1, 1, 1, 1),
(6, 1, 1, 1, 1),
(93, 1, 1, 1, 1),
(101, 1, 1, 1, 1),
(105, 1, 1, 1, 1),
(81, 1, 1, 1, 1),
(42, 1, 1, 1, 1),
(18, 1, 2, 2, 1),
(91, 1, 2, 2, 1),
(1, 1, 2, 2, 1),
(2, 1, 2, 2, 1),
(3, 1, 2, 2, 1),
(4, 1, 2, 2, 1),
(5, 1, 2, 2, 1);

-- Create TurnBelongsToPlayerAndMatch table and insert data
CREATE TABLE IF NOT EXISTS TurnBelongsToPlayerAndMatch (
    turn_id INT NOT NULL AUTO_INCREMENT, 
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    turn_order VARCHAR(255) NOT NULL,
    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (turn_id, player_id, match_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO TurnBelongsToPlayerAndMatch (turn_id, player_id, match_id, turn_order, time_stamp)
VALUES 
(1, 1, 1, 'Clockwise', '2024-08-05 10:49:00'), -- Reliable Developer plays
(2, 2, 1, 'Clockwise', '2024-08-05 10:50:00'), -- Brilliant Analyst loses turn
(3, 1, 1, 'Clockwise', '2024-08-05 10:51:00'), -- Reliable Developer plays
(4, 2, 1, 'Clockwise', '2024-08-05 10:52:00'), -- Brilliant Analyst plays
(5, 1, 1, 'Clockwise', '2024-08-05 10:53:00'), -- Reliable Developer plays
(6, 2, 1, 'Clockwise', '2024-08-05 10:54:00'), -- Brilliant Analyst draws
(7, 1, 1, 'Clockwise', '2024-08-05 10:55:00'), -- Reliable Developer plays
(8, 2, 1, 'Counter Clockwise', '2024-08-05 10:56:00'), -- Brilliant Analyst plays
(9, 1, 1, 'Counter Clockwise', '2024-08-05 10:57:00'), -- Reliable Developer plays
(10, 2, 1, 'Counter Clockwise', '2024-08-05 10:58:00'), -- Brilliant Analyst draws
(11, 1, 1, 'Counter Clockwise', '2024-08-05 10:59:00'), -- Reliable Developer plays
(12, 2, 1, 'Counter Clockwise', '2024-08-05 11:00:00'), -- Brilliant Analyst loses turn
(13, 1, 1, 'Counter Clockwise', '2024-08-05 11:01:00'); -- Reliable Developer plays

-- Create PlayAction table and insert data
CREATE TABLE IF NOT EXISTS PlayAction (
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    hand_id INT NOT NULL, 
    PRIMARY KEY (turn_id, player_id, match_id),
    FOREIGN KEY (turn_id, player_id, match_id) REFERENCES TurnBelongsToPlayerAndMatch(turn_id, player_id, match_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (card_id, deck_id, hand_id, player_id, match_id) REFERENCES CardHeldByHand (card_id, deck_id, hand_id, player_id, match_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO PlayAction (turn_id, player_id, match_id, card_id, deck_id, hand_id)
VALUES 
(1, 1, 1, 77, 1, 1), -- Reliable Developer plays Red Skip
(3, 1, 1, 6, 1, 1), -- Reliable Developer plays Red 3
(4, 2, 1, 18, 1, 2), -- Brilliant Analyst plays Red 9
(5, 1, 1, 93, 1, 1), -- Reliable Developer plays Red Draw 2
(7, 1, 1, 101, 1, 1), -- Reliable Developer plays Wild Card (Choose: Blue)
(8, 2, 1, 91, 1, 2), -- Brilliant Analyst plays Blue Reverse
(9, 1, 1, 105, 1, 1), -- Reliable Developer plays Wild Draw 4 (Choose: Green)
(11, 1, 1, 81, 1, 1), -- Reliable Developer plays Green Skip
(13, 1, 1, 42, 1, 1); -- Reliable Developer plays Green 2

-- Create DrawAction table and insert data
CREATE TABLE IF NOT EXISTS DrawAction (
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    draw_amount INT NOT NULL,
    PRIMARY KEY (turn_id, player_id, match_id),
    FOREIGN KEY (turn_id, player_id, match_id) REFERENCES TurnBelongsToPlayerAndMatch(turn_id, player_id, match_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO DrawAction (turn_id, player_id, match_id, draw_amount)
VALUES 
(6, 2, 1, 2), -- Brilliant Analyst draws 2 cards
(10, 2, 1, 4); -- Brilliant Analyst draws 4 cards

-- Create CardsDrawnInTurn table and insert data
CREATE TABLE IF NOT EXISTS CardsDrawnInTurn (
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    PRIMARY KEY (turn_id, player_id, match_id, card_id, deck_id),
    FOREIGN KEY (turn_id, player_id, match_id) REFERENCES TurnBelongsToPlayerAndMatch(turn_id, player_id, match_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
INSERT IGNORE INTO CardsDrawnInTurn (turn_id, player_id, match_id, card_id, deck_id)
VALUES 
(6, 2, 1, 95, 1), -- Brilliant Analyst draws Yellow Draw 2
(6, 2, 1, 96, 1), -- Brilliant Analyst draws Yellow Draw 2
(10, 2, 1, 67, 1), -- Brilliant Analyst draws Blue 5
(10, 2, 1, 68, 1), -- Brilliant Analyst draws Blue 5
(10, 2, 1, 69, 1), -- Brilliant Analyst draws Blue 6
(10, 2, 1, 70, 1); -- Brilliant Analyst draws Blue 6

-- Create TurnLostAction table and insert data
CREATE TABLE IF NOT EXISTS TurnLostAction (
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    PRIMARY KEY (turn_id, player_id, match_id),
    FOREIGN KEY (turn_id, player_id, match_id) REFERENCES TurnBelongsToPlayerAndMatch(turn_id, player_id, match_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 
INSERT IGNORE INTO TurnLostAction (turn_id, player_id, match_id)
VALUES 
(2, 2, 1), -- Brilliant Analyst loses turn
(12, 2, 1); -- Brilliant Analyst loses turn
