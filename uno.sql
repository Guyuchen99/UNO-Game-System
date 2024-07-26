CREATE DATABASE IF NOT EXISTS UNOGameSystem; 

USE UNOGameSystem; 

CREATE TABLE IF NOT EXISTS PlayerUsernameAndEmail (
	username VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    PRIMARY KEY (username)
); 

CREATE TABLE IF NOT EXISTS PlayerGameStatistics (
    total_win INT NOT NULL,
    total_game_count INT NOT NULL,
    win_rate FLOAT NOT NULL,
    PRIMARY KEY (total_win, total_game_count)
); 

CREATE TABLE IF NOT EXISTS PlayerLevel (
    experience_point INT DEFAULT 0,
    level INT DEFAULT 1,
    PRIMARY KEY (experience_point),
    CHECK (experience_point <= 10000)
); 

CREATE TABLE IF NOT EXISTS PlayerLanguage (
    country VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(255) NOT NULL,
    PRIMARY KEY (country)
); 

CREATE TABLE IF NOT EXISTS Players (
    player_id INT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    total_win INT DEFAULT 0,
    total_game_count INT DEFAULT 0,
    experience_point INT DEFAULT 0,
    country VARCHAR(255) NOT NULL,
    PRIMARY KEY (player_id),
    FOREIGN KEY (username) REFERENCES PlayerUsernameAndEmail(username) ON DELETE CASCADE,
    FOREIGN KEY (total_win, total_game_count) REFERENCES PlayerGameStatistics(total_win, total_game_count) ON DELETE CASCADE,
    FOREIGN KEY (experience_point) REFERENCES PlayerLevel(experience_point) ON DELETE CASCADE,
    FOREIGN KEY (country) REFERENCES PlayerLanguage(country) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS MembershipExpireDate (
    issue_date DATE NOT NULL,
    days_remaining INT NOT NULL,
    expire_date DATE NOT NULL,
    PRIMARY KEY (issue_date, days_remaining)
); 

CREATE TABLE IF NOT EXISTS MembershipPrivilegeClass (
    privilege_level INT NOT NULL,
    privilege_class VARCHAR(255) NOT NULL,
    PRIMARY KEY (privilege_level)
);

CREATE TABLE IF NOT EXISTS MembershipInPlayer (
    membership_id INT AUTO_INCREMENT,
    player_id INT NOT NULL,
    issue_date DATE NOT NULL,
    days_remaining INT NOT NULL,
    privilege_level INT NOT NULL,
    total_points INT NOT NULL,
    PRIMARY KEY (membership_id),
	FOREIGN KEY (player_id) REFERENCES Players (player_id) ON DELETE CASCADE,
    FOREIGN KEY (issue_date, days_remaining) REFERENCES MembershipExpireDate(issue_date, days_remaining) ON DELETE CASCADE,
    FOREIGN KEY (privilege_level) REFERENCES MembershipPrivilegeClass(privilege_level) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS Events (
    event_id INT AUTO_INCREMENT,
    name VARCHAR(255),
    num_of_participants INT DEFAULT 0, 
    PRIMARY KEY (event_id)
); 

CREATE TABLE IF NOT EXISTS Stores (
    store_id INT AUTO_INCREMENT,
    player_id INT NOT NULL,
    num_of_items INT,
    PRIMARY KEY (store_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON DELETE CASCADE
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
    store_id INT NOT NULL,
    current_price INT NOT NULL,
    information VARCHAR(255) NOT NULL,
    quality VARCHAR(255) NOT NULL,
    applied_promotion VARCHAR(255),
    PRIMARY KEY (item_id),
    FOREIGN KEY (quality) REFERENCES ItemOriginalPrice(quality) ON DELETE CASCADE,
    FOREIGN KEY (applied_promotion) REFERENCES ItemDiscount(applied_promotion) ON DELETE CASCADE, 
	FOREIGN KEY (store_id) REFERENCES Stores (store_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS Matches (
    match_id INT AUTO_INCREMENT,
    winner VARCHAR(255),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    has_played INT DEFAULT 0,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (deck_id) REFERENCES Decks(deck_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS WildCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS WildDraw4Card (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS NumberCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    number INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS SkipCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS ReverseCard (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS Draw2Card (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id, deck_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS HandInPlayerAndMatch (
    hand_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    card_amount INT NOT NULL,
    PRIMARY KEY (hand_id, player_id, match_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON DELETE CASCADE,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS TurnInPlayerAndMatch (
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    turn_order VARCHAR(255) NOT NULL,
    PRIMARY KEY (turn_id, player_id, match_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON DELETE CASCADE,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS ActionInTurn (
    action_id INT NOT NULL,
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (action_id, turn_id, player_id, match_id),
    FOREIGN KEY (turn_id, player_id, match_id) REFERENCES TurnInPlayerAndMatch(turn_id, player_id, match_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SkipAction (
    action_id INT NOT NULL,
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    PRIMARY KEY (action_id, turn_id, player_id, match_id),
    FOREIGN KEY (action_id, turn_id, player_id, match_id) REFERENCES ActionInTurn(action_id, turn_id, player_id, match_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS DrawAction (
    action_id INT NOT NULL,
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    draw_amount INT NOT NULL,
    PRIMARY KEY (action_id, turn_id, player_id, match_id),
    FOREIGN KEY (action_id, turn_id, player_id, match_id) REFERENCES ActionInTurn(action_id, turn_id, player_id, match_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS PlayAction (
    action_id INT NOT NULL,
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    PRIMARY KEY (action_id, turn_id, player_id, match_id),
    FOREIGN KEY (action_id, turn_id, player_id, match_id) REFERENCES ActionInTurn(action_id, turn_id, player_id, match_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS PlayerParticipatesEvents (
    player_id INT NOT NULL,
    event_id INT NOT NULL,
    PRIMARY KEY (player_id, event_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS PlayerInvolvesMatch (
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    PRIMARY KEY (player_id, match_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON DELETE CASCADE,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS MatchHasDeck (
    match_id INT NOT NULL UNIQUE,
    deck_id INT NOT NULL UNIQUE,
    PRIMARY KEY (match_id, deck_id),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id) ON DELETE CASCADE,
    FOREIGN KEY (deck_id) REFERENCES Decks(deck_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS CardHeldByHand (
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    hand_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    PRIMARY KEY (card_id, deck_id, hand_id, player_id, match_id),
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) ON DELETE CASCADE,
    FOREIGN KEY (hand_id, player_id, match_id) REFERENCES HandInPlayerAndMatch(hand_id, player_id, match_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS PlayActionFromCard (
    action_id INT NOT NULL,
    turn_id INT NOT NULL,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    card_id INT NOT NULL,
    deck_id INT NOT NULL,
    PRIMARY KEY (action_id, turn_id, player_id, match_id, card_id, deck_id),
    FOREIGN KEY (action_id, turn_id, player_id, match_id) REFERENCES PlayAction(action_id, turn_id, player_id, match_id) ON DELETE CASCADE,
    FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck(card_id, deck_id) ON DELETE CASCADE
); 

INSERT INTO PlayerUsernameAndEmail (username, email) 
VALUES 
('Handsome Programmer', 'handsome_programmer@student.ubc.ca'),
('Happy Professor', 'happy_professor@student.ubc.ca'),
('Poor Student', 'poor_student@student.ubc.ca'),
('Selfish Engineer', 'selfish_engineer@student.ubc.ca'),
('Dangerous Salesman', 'dangerous_salesman@student.ubc.ca'); 

INSERT INTO PlayerGameStatistics (total_win, total_game_count, win_rate) 
VALUES 
(10, 20, 0.5),
(15, 25, 0.6),
(8, 10, 0.8),
(12, 13, 0.92),
(20, 27, 0.74); 

INSERT INTO PlayerLevel (experience_point, level) 
VALUES 
(3000, 3),
(5000, 5),
(8000, 8),
(9000, 9),
(10000, 10); 

INSERT INTO PlayerLanguage (country, preferred_language) 
VALUES 
('USA', 'English'),
('Canada', 'English'),
('France', 'French'),
('China', 'Chinese'),
('Korea', 'Korean'); 

INSERT INTO Players (username, total_win, total_game_count, experience_point, country) 
VALUES 
('Handsome Programmer', 10, 20, 3000, 'Canada'), 
('Happy Professor', 15, 25, 5000, 'France'),
('Poor Student', 8, 10, 8000, 'China'), 
('Selfish Engineer', 12, 13, 9000, 'USA'), 
('Dangerous Salesman', 20, 27, 10000, 'Korea'); 

INSERT INTO MembershipExpireDate (issue_date, days_remaining, expire_date) 
VALUES 
(DATE '2024-01-01', 30, DATE '2024-01-31'),
(DATE '2024-02-01', 28, DATE '2024-02-29'),
(DATE '2024-03-01', 31, DATE '2024-03-31'),
(DATE '2024-04-01', 30, DATE '2024-04-30'),
(DATE '2024-05-01', 31, DATE '2024-05-31'); 

INSERT INTO MembershipPrivilegeClass (privilege_level, privilege_class) 
VALUES 
(1, 'Bronze'),
(2, 'Silver'),
(3, 'Gold'),
(4, 'Platinum'),
(5, 'Diamond'); 

INSERT INTO MembershipInPlayer (player_id, issue_date, days_remaining, privilege_level, total_points) 
VALUES 
(1, DATE '2024-01-01', 30, 1, 100),
(2, DATE '2024-02-01', 28, 2, 200),
(3, DATE '2024-03-01', 31, 3, 300),
(4, DATE '2024-04-01', 30, 4, 400),
(5, DATE '2024-05-01', 31, 5, 500); 

INSERT INTO Events (name) 
VALUES 
('Grand Tournament'),
('Weekly Challenge'),
('Holiday Special'),
('Friendship Match'),
('Ultimate Showdown'); 

INSERT INTO Stores (player_id, num_of_items) 
VALUES 
(1, 10),
(2, 15),
(3, 8),
(4, 12),
(5, 20); 

INSERT INTO ItemOriginalPrice (quality, original_price) 
VALUES 
('Common', 188),
('Uncommon', 288),
('Rare', 488),
('Epic', 888),
('Legendary', 1688); 

INSERT INTO ItemDiscount (applied_promotion, discount) 
VALUES 
('New Year Sale', 35),
('Summer Sale', 20),
('Winter Sale', 15),
('Spring Sale', 25),
('Autumn Sale', 30); 

INSERT INTO Items (store_id, current_price, information, quality, applied_promotion) 
VALUES 
(1, 122, 'Red Card', 'Common', 'New Year Sale'),
(2, 187, 'Blue Card', 'Uncommon', 'New Year Sale'),
(3, 317, 'Green Card', 'Rare', 'New Year Sale'),
(4, 577, 'Yellow Card', 'Epic', 'New Year Sale'),
(5, 1097, 'Wild Card', 'Legendary', 'New Year Sale'); 

INSERT INTO Matches (winner) 
VALUES 
('Handsome Programmer'), 
('Happy Professor'),
('Poor Student'), 
('Selfish Engineer'), 
('Dangerous Salesman'); 

INSERT INTO Decks (total_cards) 
VALUES 
(108),
(108),
(108),
(108),
(108); 

INSERT INTO CardInDeck (card_id, deck_id, has_played) 
VALUES 
(1, 1, 0),
(2, 1, 0),
(3, 1, 0),
(4, 1, 0),
(5, 1, 0),
(6, 2, 0),
(7, 2, 0),
(8, 2, 0),
(9, 2, 0),
(10, 2, 0); 

INSERT INTO WildCard (card_id, deck_id) 
VALUES 
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1); 

INSERT INTO WildDraw4Card (card_id, deck_id) 
VALUES 
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2); 

INSERT INTO NumberCard (card_id, deck_id, number, color) 
VALUES 
(1, 1, 1, 'Red'),
(2, 1, 2, 'Blue'),
(3, 1, 3, 'Green'),
(4, 1, 4, 'Yellow'),
(5, 1, 5, 'Red'); 

INSERT INTO SkipCard (card_id, deck_id, color) 
VALUES 
(6, 2, 'Red'),
(7, 2, 'Blue'),
(8, 2, 'Green'),
(9, 2, 'Yellow'),
(10, 2, 'Red'); 

INSERT INTO ReverseCard (card_id, deck_id, color) 
VALUES 
(1, 1, 'Red'),
(2, 1, 'Blue'),
(3, 1, 'Green'),
(4, 1, 'Yellow'),
(5, 1, 'Red'); 

INSERT INTO Draw2Card (card_id, deck_id, color) 
VALUES 
(6, 2, 'Red'),
(7, 2, 'Blue'),
(8, 2, 'Green'),
(9, 2, 'Yellow'),
(10, 2, 'Red'); 

INSERT INTO HandInPlayerAndMatch (hand_id, player_id, match_id, card_amount) 
VALUES 
(1, 1, 1, 7),
(2, 2, 2, 7),
(3, 3, 3, 7),
(4, 4, 4, 7),
(5, 5, 5, 7); 

INSERT INTO TurnInPlayerAndMatch (turn_id, player_id, match_id, turn_order) 
VALUES 
(1, 1, 1, 'clockwise'),
(2, 2, 2, 'clockwise'),
(3, 3, 3, 'clockwise'),
(4, 4, 4, 'counter clockwise'),
(5, 5, 5, 'counter clockwise'); 

INSERT INTO ActionInTurn (action_id, turn_id, player_id, match_id)
VALUES
(1, 1, 1, 1),
(2, 2, 2, 2),
(3, 3, 3, 3),
(4, 4, 4, 4),
(5, 5, 5, 5);

INSERT INTO SkipAction (action_id, turn_id, player_id, match_id)
VALUES
(1, 1, 1, 1),
(2, 2, 2, 2),
(3, 3, 3, 3),
(4, 4, 4, 4),
(5, 5, 5, 5);

INSERT INTO PlayAction (action_id, turn_id, player_id, match_id) 
VALUES 
(1, 1, 1, 1),
(2, 2, 2, 2),
(3, 3, 3, 3),
(4, 4, 4, 4),
(5, 5, 5, 5);

INSERT INTO DrawAction (action_id, turn_id, player_id, match_id, draw_amount) 
VALUES 
(1, 1, 1, 1, 2),
(2, 2, 2, 2, 2),
(3, 3, 3, 3, 2),
(4, 4, 4, 4, 2),
(5, 5, 5, 5, 2); 

INSERT INTO PlayerParticipatesEvents (player_id, event_id) 
VALUES 
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1); 

INSERT INTO PlayerInvolvesMatch (player_id, match_id) 
VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5); 

INSERT INTO MatchHasDeck (match_id, deck_id) 
VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5); 

INSERT INTO CardHeldByHand (card_id, deck_id, hand_id, player_id, match_id) 
VALUES 
(1, 1, 1, 1, 1),
(2, 1, 2, 2, 2),
(3, 1, 3, 3, 3),
(4, 1, 4, 4, 4),
(5, 1, 5, 5, 5); 

INSERT INTO PlayActionFromCard (action_id, turn_id, player_id, match_id, card_id, deck_id) 
VALUES 
(1, 1, 1, 1, 1, 1),
(2, 2, 2, 2, 2, 1),
(3, 3, 3, 3, 3, 1),
(4, 4, 4, 4, 4, 1),
(5, 5, 5, 5, 5, 1); 