-- DROP DATABASE IF EXISTS UNOGameSystem;
-- CREATE DATABASE IF NOT EXISTS UNOGameSystem;
-- USE UNOGameSystem;

CREATE TABLE IF NOT EXISTS PlayerUsernameAndEmail (
	username VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    PRIMARY KEY (username)
); 

CREATE TABLE IF NOT EXISTS PlayerLevel (
    experience_point INT NOT NULL, 
    level INT NOT NULL, 
    PRIMARY KEY (experience_point),
    CHECK (experience_point <= 10000)
); 

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

CREATE TABLE IF NOT EXISTS MembershipPrivilegeClass (
    privilege_level INT NOT NULL,
    privilege_class VARCHAR(255) NOT NULL,
    PRIMARY KEY (privilege_level)
);

CREATE TABLE IF NOT EXISTS Memberships (
    membership_id INT AUTO_INCREMENT,
    player_id INT NOT NULL,
    issue_date DATE NOT NULL,
    expire_date DATE NOT NULL,
    privilege_level INT NOT NULL,
    status VARCHAR(255), 
    PRIMARY KEY (membership_id),
	FOREIGN KEY (player_id) REFERENCES Players(player_id) 
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    FOREIGN KEY (privilege_level) REFERENCES MembershipPrivilegeClass(privilege_level) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS Events (
    event_id INT AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE,
    start_date DATE NOT NULL, 
    end_date DATE NOT NULL, 
    status VARCHAR(255) NOT NULL, 
    num_of_participants INT DEFAULT 0, 
    PRIMARY KEY (event_id)
); 

CREATE TABLE IF NOT EXISTS PlayerParticipateEvents (
    player_id INT NOT NULL,
    event_id INT NOT NULL,
    PRIMARY KEY (player_id, event_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(event_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS Stores (
    store_id INT AUTO_INCREMENT,
    player_id INT NOT NULL,
    num_of_items INT DEFAULT 0,
    PRIMARY KEY (store_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS ItemOriginalPrice (
    quality VARCHAR(255) NOT NULL,
    original_price INT NOT NULL,
    PRIMARY KEY (quality)
); 

CREATE TABLE IF NOT EXISTS ItemDiscount (
    applied_promotion VARCHAR(255) NOT NULL,
    discount INT NOT NULL,
    PRIMARY KEY (applied_promotion)
); 

CREATE TABLE IF NOT EXISTS Items (
    item_id INT AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL UNIQUE,
    quality VARCHAR(255) NOT NULL,
    applied_promotion VARCHAR(255) NOT NULL,
	current_price INT NOT NULL,
    PRIMARY KEY (item_id),
    FOREIGN KEY (quality) REFERENCES ItemOriginalPrice(quality) 
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    FOREIGN KEY (applied_promotion) REFERENCES ItemDiscount(applied_promotion) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS StoreSellItems (
    store_id INT NOT NULL, 
    item_id INT NOT NULL, 
    PRIMARY KEY (store_id, item_id),
	FOREIGN KEY (store_id) REFERENCES Stores(store_id) 
		ON DELETE CASCADE
		ON UPDATE CASCADE, 
	FOREIGN KEY (item_id) REFERENCES Items(item_id) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS PlayerContainItems (
    player_id INT NOT NULL, 
    item_id INT NOT NULL, 
    PRIMARY KEY (player_id, item_id),
	FOREIGN KEY (player_id) REFERENCES Players(player_id) 
		ON DELETE CASCADE
		ON UPDATE CASCADE, 
	FOREIGN KEY (item_id) REFERENCES Items(item_id) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS Matches (
    match_id INT AUTO_INCREMENT,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    winner VARCHAR(255),
    status VARCHAR(255) DEFAULT 'In Process',
    PRIMARY KEY (match_id)
); 

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

CREATE TABLE IF NOT EXISTS Decks (
    deck_id INT AUTO_INCREMENT,
    card_amount INT DEFAULT 108,
    PRIMARY KEY (deck_id)
); 

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

CREATE TABLE IF NOT EXISTS SkipCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardBelongsToDeck(card_id, deck_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS ReverseCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardBelongsToDeck(card_id, deck_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS Draw2Card (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardBelongsToDeck(card_id, deck_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS WildCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardBelongsToDeck(card_id, deck_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS WildDraw4Card (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardBelongsToDeck(card_id, deck_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 

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
    FOREIGN KEY (card_id, deck_id, hand_id, player_id, match_id) REFERENCES CardHeldByHand(card_id, deck_id, hand_id, player_id, match_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 

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

CREATE TABLE IF NOT EXISTS TurnLostAction (
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    PRIMARY KEY (turn_id, player_id, match_id),
    FOREIGN KEY (turn_id, player_id, match_id) REFERENCES TurnBelongsToPlayerAndMatch(turn_id, player_id, match_id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 

INSERT IGNORE INTO PlayerUsernameAndEmail(username, email) 
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

INSERT IGNORE INTO PlayerLevel(experience_point, level) 
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

INSERT IGNORE INTO Players(username, total_win, total_game_count, win_rate, experience_point, country, password) 
VALUES 
('Reliable Developer', 5, 15, 0.33, 2000, 'Canada', 'xhjanjwnfewhfohuenee'), 
('Brilliant Analyst', 7, 18, 0.39, 4000, 'India', 'qpicuniqxmeuhrhbdndeqw'), 
('Talented Artist', 9, 22, 0.41, 6000, 'China', 'fjfepopqwnfvnsiuewoine'), 
('Ambitious Entrepreneur', 13, 19, 0.68, 7000, 'USA', 'voeiwjoencoieiownw'), 
('Passionate Teacher', 11, 21, 0.52, 8000, 'Japan', 'aapciwjcapwijecawocwe'),
('Skilled Mechanic', 14, 30, 0.47, 9000, 'Canada', 'xaowijenchnceoaurhrcawe'), 
('Friendly Receptionist', 4, 12, 0.33, 2000, 'India', 'fijrewnncvsuhgbwerwe'), 
('Hardworking Farmer', 6, 17, 0.35, 2000, 'China', 'skaekcjmaoeiwrityf'), 
('Insightful Consultant', 17, 26, 0.65, 7000, 'USA', 'xmjeawodwekvorf'), 
('Curious Researcher', 3, 14, 0.21, 2000, 'Japan', 'epwckewoenflvroewnew'), 
('Expert Technician', 16, 24, 0.67, 6000, 'Canada', 'finceuwnnmekcjew'), 
('Organized Librarian', 19, 32, 0.59, 8000, 'India', 'xeofheoehqoqnveoqpq'), 
('Creative Writer', 18, 29, 0.62, 7000, 'China', 'spfaekfnldvjewouehnrtt'), 
('Brave Soldier', 21, 28, 0.75, 8000, 'USA', 'gpeoewjnvuweiue'), 
('Efficient Assistant', 22, 33, 0.67, 9000, 'Japan', 'vpaiwejfnaovuywqppj'),
('Handsome Programmer', 10, 20, 0.5, 3000, 'Canada', 'srvasevrsvaesrbasrtythfr'), 
('Happy Professor', 15, 25, 0.6, 5000, 'India', 'vjvosijuaosinvaoeijrsaevr'),
('Poor Student', 8, 10, 0.8, 8000, 'China', 'Sfsdfuyesiufahekjeof'), 
('Selfish Engineer', 12, 13, 0.92, 9000, 'USA', 'voefhnownfhvseowenfw'), 
('Dangerous Salesman', 20, 27, 0.74, 10000, 'Japan', 'pqweopqoccmuhqwciuq');

INSERT IGNORE INTO MembershipPrivilegeClass(privilege_level, privilege_class) 
VALUES 
(1, 'Bronze'),
(2, 'Silver'),
(3, 'Gold'),
(4, 'Platinum'),
(5, 'Diamond'); 

INSERT IGNORE INTO Memberships(player_id, issue_date, expire_date, privilege_level)
VALUES 
(1, '2024-03-14', '2024-05-13', 3),
(2, '2024-07-21', '2024-12-03', 5),
(3, '2024-01-05', '2024-05-21', 2),
(4, '2024-05-30', '2025-02-24', 1),
(5, '2024-04-10', '2024-04-16', 4),
(6, '2024-07-17', '2024-08-01', 3),
(7, '2024-02-25', '2024-03-05', 5),
(8, '2024-02-12', '2025-01-14', 3),
(9, '2024-05-19', '2024-07-14', 2),
(10, '2024-04-01', '2024-11-20', 5),
(11, '2024-06-08', '2024-07-28', 3),
(12, '2024-07-15', '2025-07-15', 5),
(13, '2024-01-20', '2025-04-10', 1),
(14, '2024-03-28', '2024-04-08', 2),
(15, '2024-06-14', '2025-02-20', 4),
(16, '2024-02-19', '2024-05-19', 5),
(17, '2024-03-25', '2024-05-13', 1),
(18, '2024-05-26', '2024-07-09', 2),
(19, '2024-01-25', '2024-02-22', 4),
(20, '2024-04-15', '2024-05-23', 5);

INSERT IGNORE INTO Events(name, start_date, end_date, status, num_of_participants) 
VALUES 
('UNO Mania', '2024-07-30', '2024-08-01', 'Completed', 15),
('Color Change Clash', '2024-06-27', '2024-06-29', 'Completed', 2),
('Reverse Madness', '2024-03-12', '2024-03-14', 'Completed', 3),
('Wild Card Weekend', '2024-02-05', '2024-02-07', 'Completed', 4),
('Epic Duel', '2024-07-01', '2024-07-31', 'Completed', 6),
('Weekly Challenge',  '2024-02-01', '2024-02-29', 'Completed', 4),
('Holiday Special',  '2024-03-01',  '2024-03-31', 'Completed', 9),
('Ultimate Showdown',  '2024-05-01',  '2024-09-30', 'Active', 10),
('Grand Tournament', '2024-07-01', '2024-08-31', 'Active', 8),
('Friendship Match',  '2024-01-01',  '2025-01-01', 'Active', 5),
('Stack Attack', '2024-09-30', '2024-10-02', 'Upcoming', 0),
('Wild Draw War', '2024-11-29', '2024-12-01', 'Upcoming', 0),
('Zero Swap Spectacle', '2024-10-25', '2024-10-27', 'Upcoming', 0),
('Color Blast', '2024-11-15', '2024-11-17', 'Upcoming', 0),
('UNO Championship Series', '2024-12-01', '2024-12-26', 'Upcoming', 0);

INSERT INTO PlayerParticipateEvents(player_id, event_id) 
VALUES 
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1), (11, 1), (12, 1), (13, 1), (14, 1), (15, 1),
(1, 2), (2, 2),
(1, 3), (4, 3), (5, 3),
(1, 4), (2, 4), (3, 4), (5, 4), 
(1, 5), (2, 5), (3, 5), (4, 5), (5, 5), (6, 5), 
(1, 6), (15, 6), (17, 6), (20, 6), 
(1, 7), (2, 7), (3, 7), (4, 7), (5, 7), (6, 7), (7, 7), (8, 7), (9, 7),
(1, 8), (2, 8), (3, 8), (4, 8), (5, 8), (6, 8), (7, 8), (8, 8), (9, 8), (10, 8),
(1, 9), (2, 9), (3, 9), (4, 9), (5, 9), (6, 9), (7, 9), (8, 9),
(1, 10), (2, 10), (3, 10), (4, 10), (5, 10); 

INSERT IGNORE INTO Stores(player_id, num_of_items) 
VALUES 
(1, 25), (2, 25), (3, 25), (4, 25), (5, 25),
(6, 25), (7, 25), (8, 25), (9, 25), (10, 25),
(11, 25), (12, 25), (13, 25), (14, 25), (15, 25),
(16, 25), (17, 25), (18, 25), (19, 25), (20, 25);

INSERT IGNORE INTO ItemOriginalPrice(quality, original_price) 
VALUES 
('Common', 188),
('Uncommon', 288),
('Rare', 488),
('Epic', 888),
('Legendary', 1688); 

INSERT IGNORE INTO ItemDiscount(applied_promotion, discount) 
VALUES 
('No Promotion', 0),
('Cyber Monday', 25),
('Black Friday', 40),
('Christmas Sale', 80),
('New Year Sale', 35); 

INSERT IGNORE INTO Items(current_price, name, quality, applied_promotion) 
VALUES 
(488, 'Watch and Learn! Emote', 'Epic', 'No Promotion'),
(488, 'Seriously?! Emote', 'Epic', 'No Promotion'),
(488, 'Take This! Emote', 'Epic', 'No Promotion'),
(288, 'No Presure Emote', 'Uncommon', 'No Promotion'), 
(288, 'XOXO Emote', 'Uncommon', 'No Promotion'), 
(188, 'Sorry Emote', 'Common', 'No Promotion'), 
(188, 'Crying Emote', 'Common', 'No Promotion'), 
(188, 'Doubt Emote', 'Common', 'No Promotion'), 
(188, 'Sign Emote', 'Common', 'No Promotion'),
(188, 'Heart Emote', 'Common', 'No Promotion'), 
(1266, 'Champion Avatar Frame', 'Legendary', 'Cyber Monday'),
(666, 'It\'s Show Time Avatar Frame', 'Epic', 'Cyber Monday'),
(366, 'Happy Competition Avatar Frame', 'Rare', 'Cyber Monday'),
(1266, 'Mountain of Gems', 'Legendary', 'Cyber Monday'),
(666, 'Wagon of Gems', 'Epic', 'Cyber Monday'),
(366, 'Bucket of Gems', 'Rare', 'Cyber Monday'),
(216, 'Handful of Gems', 'Uncommon', 'Cyber Monday'),
(141, 'Couple of Gems', 'Common', 'Cyber Monday'), 
(188, '10-Win Double Coins Card', 'Common', 'No Promotion'),
(188, '10-Loss Shields Protection', 'Common', 'No Promotion'),
(188, 'Effects Fragment', 'Common', 'No Promotion'), 
(188, 'Decoration Fragment', 'Common', 'No Promotion'), 
(188, 'Name Change Card', 'Common', 'No Promotion'), 
(1266, 'Mystery Effects Box', 'Legendary', 'Cyber Monday'), 
(1266, 'Mystery Decoration Box', 'Legendary', 'Cyber Monday'); 

INSERT IGNORE INTO StoreSellItems(store_id, item_id) 
VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10),
(1, 11), (1, 12), (1, 13), (1, 14), (1, 15), (1, 16), (1, 17), (1, 18), (1, 19), (1, 20),
(1, 21), (1, 22), (1, 23), (1, 24), (1, 25),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10),
(2, 11), (2, 12), (2, 13), (2, 14), (2, 15), (2, 16), (2, 17), (2, 18), (2, 19), (2, 20),
(2, 21), (2, 22), (2, 23), (2, 24), (2, 25),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8), (3, 9), (3, 10),
(3, 11), (3, 12), (3, 13), (3, 14), (3, 15), (3, 16), (3, 17), (3, 18), (3, 19), (3, 20),
(3, 21), (3, 22), (3, 23), (3, 24), (3, 25),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7), (4, 8), (4, 9), (4, 10),
(4, 11), (4, 12), (4, 13), (4, 14), (4, 15), (4, 16), (4, 17), (4, 18), (4, 19), (4, 20),
(4, 21), (4, 22), (4, 23), (4, 24), (4, 25),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7), (5, 8), (5, 9), (5, 10),
(5, 11), (5, 12), (5, 13), (5, 14), (5, 15), (5, 16), (5, 17), (5, 18), (5, 19), (5, 20),
(5, 21), (5, 22), (5, 23), (5, 24), (5, 25),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6), (6, 7), (6, 8), (6, 9), (6, 10),
(6, 11), (6, 12), (6, 13), (6, 14), (6, 15), (6, 16), (6, 17), (6, 18), (6, 19), (6, 20),
(6, 21), (6, 22), (6, 23), (6, 24), (6, 25),
(7, 1), (7, 2), (7, 3), (7, 4), (7, 5), (7, 6), (7, 7), (7, 8), (7, 9), (7, 10),
(7, 11), (7, 12), (7, 13), (7, 14), (7, 15), (7, 16), (7, 17), (7, 18), (7, 19), (7, 20),
(7, 21), (7, 22), (7, 23), (7, 24), (7, 25),
(8, 1), (8, 2), (8, 3), (8, 4), (8, 5), (8, 6), (8, 7), (8, 8), (8, 9), (8, 10),
(8, 11), (8, 12), (8, 13), (8, 14), (8, 15), (8, 16), (8, 17), (8, 18), (8, 19), (8, 20),
(8, 21), (8, 22), (8, 23), (8, 24), (8, 25),
(9, 1), (9, 2), (9, 3), (9, 4), (9, 5), (9, 6), (9, 7), (9, 8), (9, 9), (9, 10),
(9, 11), (9, 12), (9, 13), (9, 14), (9, 15), (9, 16), (9, 17), (9, 18), (9, 19), (9, 20),
(9, 21), (9, 22), (9, 23), (9, 24), (9, 25),
(10, 1), (10, 2), (10, 3), (10, 4), (10, 5), (10, 6), (10, 7), (10, 8), (10, 9), (10, 10),
(10, 11), (10, 12), (10, 13), (10, 14), (10, 15), (10, 16), (10, 17), (10, 18), (10, 19), (10, 20),
(10, 21), (10, 22), (10, 23), (10, 24), (10, 25),
(11, 1), (11, 2), (11, 3), (11, 4), (11, 5), (11, 6), (11, 7), (11, 8), (11, 9), (11, 10),
(11, 11), (11, 12), (11, 13), (11, 14), (11, 15), (11, 16), (11, 17), (11, 18), (11, 19), (11, 20),
(11, 21), (11, 22), (11, 23), (11, 24), (11, 25),
(12, 1), (12, 2), (12, 3), (12, 4), (12, 5), (12, 6), (12, 7), (12, 8), (12, 9), (12, 10),
(12, 11), (12, 12), (12, 13), (12, 14), (12, 15), (12, 16), (12, 17), (12, 18), (12, 19), (12, 20),
(12, 21), (12, 22), (12, 23), (12, 24), (12, 25),
(13, 1), (13, 2), (13, 3), (13, 4), (13, 5), (13, 6), (13, 7), (13, 8), (13, 9), (13, 10),
(13, 11), (13, 12), (13, 13), (13, 14), (13, 15), (13, 16), (13, 17), (13, 18), (13, 19), (13, 20),
(13, 21), (13, 22), (13, 23), (13, 24), (13, 25),
(14, 1), (14, 2), (14, 3), (14, 4), (14, 5), (14, 6), (14, 7), (14, 8), (14, 9), (14, 10),
(14, 11), (14, 12), (14, 13), (14, 14), (14, 15), (14, 16), (14, 17), (14, 18), (14, 19), (14, 20),
(14, 21), (14, 22), (14, 23), (14, 24), (14, 25),
(15, 1), (15, 2), (15, 3), (15, 4), (15, 5), (15, 6), (15, 7), (15, 8), (15, 9), (15, 10),
(15, 11), (15, 12), (15, 13), (15, 14), (15, 15), (15, 16), (15, 17), (15, 18), (15, 19), (15, 20),
(15, 21), (15, 22), (15, 23), (15, 24), (15, 25),
(16, 1), (16, 2), (16, 3), (16, 4), (16, 5), (16, 6), (16, 7), (16, 8), (16, 9), (16, 10),
(16, 11), (16, 12), (16, 13), (16, 14), (16, 15), (16, 16), (16, 17), (16, 18), (16, 19), (16, 20),
(16, 21), (16, 22), (16, 23), (16, 24), (16, 25),
(17, 1), (17, 2), (17, 3), (17, 4), (17, 5), (17, 6), (17, 7), (17, 8), (17, 9), (17, 10),
(17, 11), (17, 12), (17, 13), (17, 14), (17, 15), (17, 16), (17, 17), (17, 18), (17, 19), (17, 20),
(17, 21), (17, 22), (17, 23), (17, 24), (17, 25),
(18, 1), (18, 2), (18, 3), (18, 4), (18, 5), (18, 6), (18, 7), (18, 8), (18, 9), (18, 10),
(18, 11), (18, 12), (18, 13), (18, 14), (18, 15), (18, 16), (18, 17), (18, 18), (18, 19), (18, 20),
(18, 21), (18, 22), (18, 23), (18, 24), (18, 25),
(19, 1), (19, 2), (19, 3), (19, 4), (19, 5), (19, 6), (19, 7), (19, 8), (19, 9), (19, 10),
(19, 11), (19, 12), (19, 13), (19, 14), (19, 15), (19, 16), (19, 17), (19, 18), (19, 19), (19, 20),
(19, 21), (19, 22), (19, 23), (19, 24), (19, 25),
(20, 1), (20, 2), (20, 3), (20, 4), (20, 5), (20, 6), (20, 7), (20, 8), (20, 9), (20, 10),
(20, 11), (20, 12), (20, 13), (20, 14), (20, 15), (20, 16), (20, 17), (20, 18), (20, 19), (20, 20),
(20, 21), (20, 22), (20, 23), (20, 24), (20, 25);

INSERT IGNORE INTO PlayerContainItems(player_id, item_id) 
VALUES 
(1, 1), (1, 6), 
(2, 5), (2, 14),
(3, 14), (3, 13),
(4, 7), (4, 17),
(5, 23), (5, 20),
(6, 11), (6, 12),
(7, 18), (7, 14),
(8, 20), (8, 2),
(9, 5), (9, 3),
(10, 12), (10, 10),
(11, 9), (11, 3),
(12, 6), (12, 1),
(13, 24), (13, 24),
(14, 17), (14, 12),
(15, 1), (15, 19),
(16, 22), (16, 20), 
(17, 10), (17, 18),
(18, 4), (18, 24),
(19, 25), (19, 21),
(20, 3), (20, 13); 

INSERT IGNORE INTO Matches(start_time, end_time, winner, status) 
VALUES 
('2024-08-05 10:49:00', '2024-08-05 11:01:00', 'Reliable Developer', 'Completed');

INSERT IGNORE INTO PlayerInvolveMatches(player_id, match_id) 
VALUES 
(1, 1), (2, 1);

INSERT IGNORE INTO HandBelongsToPlayerAndMatch(player_id, match_id) 
VALUES 
(1, 1), (2, 1);

INSERT IGNORE INTO Decks(card_amount) 
VALUES 
(108);

INSERT IGNORE INTO MatchHasDeck(match_id, deck_id) 
VALUES 
(1, 1);

INSERT INTO CardBelongsToDeck(card_id, deck_id, name) 
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

INSERT IGNORE INTO NumberCard(card_id, deck_id, number, color) 
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

INSERT IGNORE INTO SkipCard(card_id, deck_id, color) 
VALUES
(77, 1, 'Red'), (78, 1, 'Red'),
(79, 1, 'Yellow'), (80, 1, 'Yellow'),
(81, 1, 'Green'), (82, 1, 'Green'),
(83, 1, 'Blue'), (84, 1, 'Blue');

INSERT IGNORE INTO ReverseCard(card_id, deck_id, color) 
VALUES
(85, 1, 'Red'), (86, 1, 'Red'),
(87, 1, 'Yellow'), (88, 1, 'Yellow'),
(89, 1, 'Green'), (90, 1, 'Green'),
(91, 1, 'Blue'), (92, 1, 'Blue');

INSERT IGNORE INTO Draw2Card(card_id, deck_id, color) 
VALUES
(93, 1, 'Red'), (94, 1, 'Red'),
(95, 1, 'Yellow'), (96, 1, 'Yellow'),
(97, 1, 'Green'), (98, 1, 'Green'),
(99, 1, 'Blue'), (100, 1, 'Blue');

INSERT IGNORE INTO WildCard(card_id, deck_id) 
VALUES 
(101, 1), (102, 1), (103, 1), (104, 1); 

INSERT IGNORE INTO WildDraw4Card(card_id, deck_id) 
VALUES 
(105, 1), (106, 1), (107, 1), (108, 1);

INSERT IGNORE INTO CardHeldByHand(card_id, deck_id, hand_id, player_id, match_id) 
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
(56, 1, 2, 2, 1),
(72, 1, 2, 2, 1),
(58, 1, 2, 2, 1),
(87, 1, 2, 2, 1),
(21, 1, 2, 2, 1);

INSERT IGNORE INTO TurnBelongsToPlayerAndMatch(turn_id, player_id, match_id, turn_order, time_stamp)
VALUES 
(1, 1, 1, 'Clockwise', '2024-08-05 10:49:00'), 
(2, 2, 1, 'Clockwise', '2024-08-05 10:50:00'), 
(3, 1, 1, 'Clockwise', '2024-08-05 10:51:00'), 
(4, 2, 1, 'Clockwise', '2024-08-05 10:52:00'), 
(5, 1, 1, 'Clockwise', '2024-08-05 10:53:00'), 
(6, 2, 1, 'Clockwise', '2024-08-05 10:54:00'),
(7, 1, 1, 'Clockwise', '2024-08-05 10:55:00'),
(8, 2, 1, 'Counter Clockwise', '2024-08-05 10:56:00'), 
(9, 1, 1, 'Counter Clockwise', '2024-08-05 10:57:00'),
(10, 2, 1, 'Counter Clockwise', '2024-08-05 10:58:00'),
(11, 1, 1, 'Counter Clockwise', '2024-08-05 10:59:00'),
(12, 2, 1, 'Counter Clockwise', '2024-08-05 11:00:00'),
(13, 1, 1, 'Counter Clockwise', '2024-08-05 11:01:00');

INSERT IGNORE INTO PlayAction(turn_id, player_id, match_id, card_id, deck_id, hand_id)
VALUES 
(1, 1, 1, 77, 1, 1),
(3, 1, 1, 6, 1, 1),
(4, 2, 1, 18, 1, 2),
(5, 1, 1, 93, 1, 1),
(7, 1, 1, 101, 1, 1),
(8, 2, 1, 91, 1, 2), 
(9, 1, 1, 105, 1, 1), 
(11, 1, 1, 81, 1, 1), 
(13, 1, 1, 42, 1, 1); 

INSERT IGNORE INTO DrawAction(turn_id, player_id, match_id, draw_amount)
VALUES 
(6, 2, 1, 2), 
(10, 2, 1, 4);

INSERT IGNORE INTO CardsDrawnInTurn(turn_id, player_id, match_id, card_id, deck_id)
VALUES 
(6, 2, 1, 95, 1), (6, 2, 1, 96, 1),
(10, 2, 1, 67, 1), (10, 2, 1, 68, 1), (10, 2, 1, 69, 1), (10, 2, 1, 70, 1);

INSERT IGNORE INTO TurnLostAction(turn_id, player_id, match_id)
VALUES 
(2, 2, 1),
(12, 2, 1); 