INSERT INTO Users (username, email, password_hash, role) VALUES
  ('alice123', 'alice@example.com', 'hashed123', 'owner'),
  ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
  ('carol123', 'carol@example.com', 'hashed789', 'owner'),
  ('haydos1969', 'hayden.abrahams360@gmail.com', 'hashed321', 'walker'),
  ('personName', 'person@example.com', 'hashed738', 'owner');

INSERT INTO Dogs (owner_id, name, size) VALUES
  ((SELECT user_id FROM Users WHERE Users.username = 'alice123'), 'Max', 'medium');