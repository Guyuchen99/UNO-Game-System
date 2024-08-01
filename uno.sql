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

CREATE TABLE IF NOT EXISTS MembershipInPlayer (
    membership_id INT AUTO_INCREMENT,
    player_id INT NOT NULL,
    issue_time DATE NOT NULL,
    expire_time DATE NOT NULL,
    privilege_level INT NOT NULL,
    status VARCHAR(255) DEFAULT 'Active',
    PRIMARY KEY (membership_id),
	FOREIGN KEY (player_id) REFERENCES Players (player_id) 
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    FOREIGN KEY (privilege_level) REFERENCES MembershipPrivilegeClass(privilege_level) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS Events (
    event_id INT AUTO_INCREMENT,
    name VARCHAR(255),
    start_date DATE NOT NULL, 
    end_date DATE NOT NULL, 
    status VARCHAR(255) NOT NULL, 
    num_of_participants INT DEFAULT 0, 
    PRIMARY KEY (event_id)
); 

CREATE TABLE IF NOT EXISTS Stores (
    store_id INT AUTO_INCREMENT,
    player_id INT NOT NULL,
    num_of_items INT,
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
    current_price INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quality VARCHAR(255) NOT NULL,
    applied_promotion VARCHAR(255),
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

CREATE TABLE IF NOT EXISTS Matches (
    match_id INT AUTO_INCREMENT,
	start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
	winner VARCHAR(255),
	status VARCHAR(255) DEFAULT 'In Process',
    PRIMARY KEY (match_id)
); 

CREATE TABLE IF NOT EXISTS Decks (
    deck_id INT AUTO_INCREMENT,
    total_cards INT DEFAULT 108,
    PRIMARY KEY (deck_id)
); 

CREATE TABLE IF NOT EXISTS CardInDeck (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    name VARCHAR(255) NOT NULL, 
    has_played INT DEFAULT 0,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (deck_id) REFERENCES Decks(deck_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS WildCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS WildDraw4Card (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS NumberCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    number INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS SkipCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS ReverseCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS Draw2Card (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS HandInPlayerAndMatch (
    hand_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    card_amount INT NOT NULL,
    PRIMARY KEY (hand_id, player_id, match_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS TurnInPlayerAndMatch (
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    turn_order VARCHAR(255) NOT NULL,
    PRIMARY KEY (turn_id, player_id, match_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS ActionInTurn (
    action_id INT NOT NULL,
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (action_id, turn_id, player_id, match_id),
    FOREIGN KEY (turn_id, player_id, match_id) REFERENCES TurnInPlayerAndMatch(turn_id, player_id, match_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS SkipAction (
    action_id INT NOT NULL,
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    PRIMARY KEY (action_id, turn_id, player_id, match_id),
    FOREIGN KEY (action_id, turn_id, player_id, match_id) REFERENCES ActionInTurn(action_id, turn_id, player_id, match_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS DrawAction (
    action_id INT NOT NULL,
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    draw_amount INT NOT NULL,
    PRIMARY KEY (action_id, turn_id, player_id, match_id),
    FOREIGN KEY (action_id, turn_id, player_id, match_id) REFERENCES ActionInTurn(action_id, turn_id, player_id, match_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS PlayAction (
    action_id INT NOT NULL,
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    PRIMARY KEY (action_id, turn_id, player_id, match_id),
    FOREIGN KEY (action_id, turn_id, player_id, match_id) REFERENCES ActionInTurn(action_id, turn_id, player_id, match_id) 
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

CREATE TABLE IF NOT EXISTS CardHeldByHand (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    hand_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    PRIMARY KEY (card_id, deck_id, hand_id, player_id, match_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (hand_id, player_id, match_id) REFERENCES HandInPlayerAndMatch(hand_id, player_id, match_id)
		ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS PlayActionFromCard (
    action_id INT NOT NULL,
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    PRIMARY KEY (action_id, turn_id, player_id, match_id, card_id, deck_id),
    FOREIGN KEY (action_id, turn_id, player_id, match_id) REFERENCES PlayAction(action_id, turn_id, player_id, match_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) 
		ON DELETE CASCADE
        ON UPDATE CASCADE
); 

INSERT IGNORE INTO PlayerUsernameAndEmail (username, email) 
VALUES 
('Handsome Programmer', 'handsome_programmer@student.ubc.ca'),
('Happy Professor', 'happy_professor@student.ubc.ca'),
('Poor Student', 'poor_student@student.ubc.ca'),
('Selfish Engineer', 'selfish_engineer@student.ubc.ca'),
('Dangerous Salesman', 'dangerous_salesman@student.ubc.ca'),
('Handsome Programmer1', 'handsome_programmer1@student.ubc.ca'),
('Happy Professor1', 'happy_professor1@student.ubc.ca'),
('Poor Student1', 'poor_student1@student.ubc.ca'),
('Selfish Engineer1', 'selfish_engineer1@student.ubc.ca'),
('Dangerous Salesman1', 'dangerous_salesman2@student.ubc.ca'),
('Handsome Programmer2', 'handsome_programmer2@student.ubc.ca'),
('Happy Professor2', 'happy_professor2@student.ubc.ca'),
('Poor Student2', 'poor_student2@student.ubc.ca'),
('Selfish Engineer2', 'selfish_engineer2@student.ubc.ca'),
('Dangerous Salesman2', 'dangerous_salesman2@student.ubc.ca'); 

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

INSERT IGNORE INTO Players (username, total_win, total_game_count, win_rate, experience_point, country, password) 
VALUES 
('Handsome Programmer', 10, 20, 0.5, 3000, 'Canada', 'sdjfhsjfhskdfjh'), 
('Happy Professor', 15, 25, 0.6, 5000, 'India', 'fduhe9fhwe9f8y9'),
('Poor Student', 8, 10, 0.8, 8000, 'China', 'fdsjfhkjbvs9v'), 
('Selfish Engineer', 12, 13, 0.92, 9000, 'USA', 'fskjbvkjdsvb9'), 
('Dangerous Salesman', 20, 27, 0.74, 10000, 'Japan', 'ackajbasvsvspvsv'),
('Handsome Programmer1', 10, 20, 0.5, 3000, 'Canada', 'sdjfhsjfhskdfjh'), 
('Happy Professor1', 15, 25, 0.6, 5000, 'India', 'fduhe9fhwe9f8y9'),
('Poor Student1', 8, 10, 0.8, 8000, 'China', 'fdsjfhkjbvs9v'), 
('Selfish Engineer1', 12, 13, 0.92, 9000, 'USA', 'fskjbvkjdsvb9'), 
('Dangerous Salesman1', 20, 27, 0.74, 10000, 'Japan', 'ackajbasvsvspvsv'),
('Handsome Programmer2', 10, 20, 0.5, 3000, 'Canada', 'sdjfhsjfhskdfjh'), 
('Happy Professor2', 15, 25, 0.6, 5000, 'India', 'fduhe9fhwe9f8y9'),
('Poor Student2', 8, 10, 0.8, 8000, 'China', 'fdsjfhkjbvs9v'), 
('Selfish Engineer2', 12, 13, 0.92, 9000, 'USA', 'fskjbvkjdsvb9'), 
('Dangerous Salesman2', 20, 27, 0.74, 10000, 'Japan', 'ackajbasvsvspvsv'); 


INSERT IGNORE INTO MembershipPrivilegeClass (privilege_level, privilege_class) 
VALUES 
(1, 'Bronze'),
(2, 'Silver'),
(3, 'Gold'),
(4, 'Platinum'),
(5, 'Diamond'); 

INSERT IGNORE INTO MembershipInPlayer (player_id, issue_time, expire_time, privilege_level)
VALUES 
(1, DATE '2024-01-01', DATE '2024-01-31', 1),
(2, DATE '2024-02-01', DATE '2024-02-29', 2),
(3, DATE '2024-03-01', DATE '2024-03-31', 3),
(4, DATE '2024-04-01', DATE '2024-04-30', 4),
(5, DATE '2024-05-01', DATE '2024-05-31', 5);

INSERT IGNORE INTO Events (name, start_date, end_date, status) 
VALUES 
('Grand Tournament', DATE '2024-01-01', DATE '2024-01-31', 'Completed'),
('Weekly Challenge', DATE '2024-02-01', DATE '2024-02-29', 'Completed'),
('Holiday Special', DATE '2024-03-01', DATE '2024-03-31', 'Completed'),
('Friendship Match', DATE '2024-04-01', DATE '2024-04-30', 'Completed'),
('Ultimate Showdown', DATE '2024-05-01', DATE '2024-09-30', 'Active'),
('Ultimate Showdown1', DATE '2024-05-01', DATE '2024-09-30', 'Active'),
('Ultimate Showdown2', DATE '2024-05-01', DATE '2024-09-30', 'Active'),
('Ultimate Showdown3', DATE '2024-05-01', DATE '2024-09-30', 'Active'),
('Ultimate Showdown4', DATE '2024-05-01', DATE '2024-09-30', 'Active'),
('Ultimate Showdown5', DATE '2024-05-01', DATE '2024-09-30', 'Active');

INSERT IGNORE INTO Stores (player_id, num_of_items) 
VALUES 
(1, 10),
(2, 15),
(3, 8),
(4, 12),
(5, 20); 

INSERT IGNORE INTO ItemOriginalPrice (quality, original_price) 
VALUES 
('Common', 188),
('Uncommon', 288),
('Rare', 488),
('Epic', 888),
('Legendary', 1688); 

INSERT IGNORE INTO ItemDiscount (applied_promotion, discount) 
VALUES 
('New Year Sale', 35),
('Summer Sale', 20),
('Winter Sale', 15),
('Spring Sale', 25),
('Autumn Sale', 30); 

INSERT IGNORE INTO Items (current_price, name, quality, applied_promotion) 
VALUES 
(122, 'Red Card', 'Common', 'New Year Sale'),
(187, 'Blue Card', 'Uncommon', 'New Year Sale'),
(317, 'Green Card', 'Rare', 'New Year Sale'),
(577, 'Yellow Card', 'Epic', 'New Year Sale'),
(1097, 'Wild Card', 'Legendary', 'New Year Sale'); 

INSERT IGNORE INTO StoreSellItems (store_id, item_id) 
VALUES 
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5); 

INSERT IGNORE INTO Matches (end_time, winner, status) 
VALUES 
('2024-07-27 12:00:00', 'Handsome Programmer', 'Completed'), 
('2024-07-27 12:00:00', 'Happy Professor', 'Completed'),
('2024-07-27 12:00:00', 'Poor Student', 'Completed'), 
('2024-07-27 12:00:00', 'Selfish Engineer', 'Completed'), 
('2024-07-27 12:00:00', 'Dangerous Salesman', 'Completed'), 
(NULL, NULL, DEFAULT),
(NULL, NULL, DEFAULT), 
(NULL, NULL, DEFAULT), 
(NULL, NULL, DEFAULT); 

INSERT IGNORE INTO Decks (total_cards) 
VALUES 
(108),
(108),
(108),
(108),
(108); 

INSERT IGNORE INTO CardInDeck (card_id, deck_id, name, has_played) 
VALUES 
(1, 1, 'NAME', 0),
(2, 1, 'NAME', 0),
(3, 1, 'NAME', 0),
(4, 1, 'NAME', 0),
(5, 1, 'NAME', 0),
(6, 2, 'NAME', 0),
(7, 2, 'NAME', 0),
(8, 2, 'NAME', 0),
(9, 2, 'NAME', 0),
(10, 2, 'NAME', 0); 

INSERT IGNORE INTO WildCard (card_id, deck_id) 
VALUES 
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1); 

INSERT IGNORE INTO WildDraw4Card (card_id, deck_id) 
VALUES 
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2); 

INSERT IGNORE INTO NumberCard (card_id, deck_id, number, color) 
VALUES 
(1, 1, 1, 'Red'),
(2, 1, 2, 'Blue'),
(3, 1, 3, 'Green'),
(4, 1, 4, 'Yellow'),
(5, 1, 5, 'Red'); 

INSERT IGNORE INTO SkipCard (card_id, deck_id, color) 
VALUES 
(6, 2, 'Red'),
(7, 2, 'Blue'),
(8, 2, 'Green'),
(9, 2, 'Yellow'),
(10, 2, 'Red'); 

INSERT IGNORE INTO ReverseCard (card_id, deck_id, color) 
VALUES 
(1, 1, 'Red'),
(2, 1, 'Blue'),
(3, 1, 'Green'),
(4, 1, 'Yellow'),
(5, 1, 'Red'); 

INSERT IGNORE INTO Draw2Card (card_id, deck_id, color) 
VALUES 
(6, 2, 'Red'),
(7, 2, 'Blue'),
(8, 2, 'Green'),
(9, 2, 'Yellow'),
(10, 2, 'Red'); 

INSERT IGNORE INTO HandInPlayerAndMatch (hand_id, player_id, match_id, card_amount) 
VALUES 
(1, 1, 1, 7),
(2, 2, 2, 7),
(3, 3, 3, 7),
(4, 4, 4, 7),
(5, 5, 5, 7); 

INSERT IGNORE INTO TurnInPlayerAndMatch (turn_id, player_id, match_id, turn_order) 
VALUES 
(1, 1, 1, 'clockwise'),
(2, 2, 2, 'clockwise'),
(3, 3, 3, 'clockwise'),
(4, 4, 4, 'counter clockwise'),
(5, 5, 5, 'counter clockwise'); 

INSERT IGNORE INTO ActionInTurn (action_id, turn_id, player_id, match_id)
VALUES
(1, 1, 1, 1),
(2, 2, 2, 2),
(3, 3, 3, 3),
(4, 4, 4, 4),
(5, 5, 5, 5);

INSERT IGNORE INTO SkipAction (action_id, turn_id, player_id, match_id)
VALUES
(1, 1, 1, 1),
(2, 2, 2, 2),
(3, 3, 3, 3),
(4, 4, 4, 4),
(5, 5, 5, 5);

INSERT IGNORE INTO PlayAction (action_id, turn_id, player_id, match_id) 
VALUES 
(1, 1, 1, 1),
(2, 2, 2, 2),
(3, 3, 3, 3),
(4, 4, 4, 4),
(5, 5, 5, 5);

INSERT IGNORE INTO DrawAction (action_id, turn_id, player_id, match_id, draw_amount) 
VALUES 
(1, 1, 1, 1, 2),
(2, 2, 2, 2, 2),
(3, 3, 3, 3, 2),
(4, 4, 4, 4, 2),
(5, 5, 5, 5, 2); 

INSERT IGNORE INTO PlayerContainItems (player_id, item_id) 
VALUES 
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5), 
(2, 5); 

INSERT IGNORE INTO PlayerParticipateEvents (player_id, event_id) 
VALUES 
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1); 

INSERT IGNORE INTO PlayerInvolveMatches (player_id, match_id) 
VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5); 

INSERT IGNORE INTO MatchHasDeck (match_id, deck_id) 
VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5); 

INSERT IGNORE INTO CardHeldByHand (card_id, deck_id, hand_id, player_id, match_id) 
VALUES 
(1, 1, 1, 1, 1),
(2, 1, 2, 2, 2),
(3, 1, 3, 3, 3),
(4, 1, 4, 4, 4),
(5, 1, 5, 5, 5); 

INSERT IGNORE INTO PlayActionFromCard (action_id, turn_id, player_id, match_id, card_id, deck_id) 
VALUES 
(1, 1, 1, 1, 1, 1),
(2, 2, 2, 2, 2, 1),
(3, 3, 3, 3, 3, 1),
(4, 4, 4, 4, 4, 1),
(5, 5, 5, 5, 5, 1); 
