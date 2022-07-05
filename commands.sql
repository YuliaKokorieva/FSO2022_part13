CREATE TABLE blogs ( id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0);
insert into blogs (author, url, title) values ('John Lennon', 'www', 'First blogpost'); 
insert into blogs (author, url, title) values ('Paul McCartney', 'www', 'Second blogpost');