## Installing:

** Change database credentials and create database with it's tables - Change project env variables **

    1. Copy and rename the file:
      - cp server/.env.example server/.env
      
    2. Edit File Infos
      - vim server/.env

    3. Edit database credentials:
      - vim server/config/database.js

    4. Edit database credentials:
      - vim server/config/setup.js
      - vim server/config/seed.js
    
    5. Allow permission to the project folder and enclosed files:
      - chmod -R 777 .
      
    6. Copy and rename the file:
      - cp client/.env.example client/.env
      
    7. Edit File Infos
      - vim client/.env