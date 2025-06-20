INSERT INTO Users (username, email, password_hash, role) VALUES
  ('alice123', 'alice@example.com', 'hashed123', 'owner'),
  ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
  ('carol123', 'carol@example.com', 'hashed789', 'owner'),
  ('haydos1969', 'hayden.abrahams360@gmail.com', 'hashed321', 'walker'),
  ('personName', 'person@example.com', 'hashed738', 'owner');

INSERT INTO Dogs (owner_id, name, size) VALUES
  ((SELECT user_id FROM Users WHERE Users.username = 'alice123'), 'Max', 'medium'),
  ((SELECT user_id FROM Users WHERE Users.username = 'Carol123'), 'Bella', 'small'),
  ((SELECT user_id FROM Users WHERE Users.username = 'personName'), 'Spotty', 'large'),
  ((SELECT user_id FROM Users WHERE Users.username = 'Carol123'), 'Spud', 'small'),
  ((SELECT user_id FROM Users WHERE Users.username = 'alice123'), 'Juno', 'medium');

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
  ((SELECT dog_id FROM Dogs WHERE Dogs.name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', open),
  ((SELECT dog_id FROM Dogs WHERE Dogs.name = 'Bella'), '2025-06-10 09:30:00 ', 30, 'Parklands', open),
  ((SELECT dog_id FROM Dogs WHERE Dogs.name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', open),
  ((SELECT dog_id FROM Dogs WHERE Dogs.name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', open),
  ((SELECT dog_id FROM Dogs WHERE Dogs.name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', open);