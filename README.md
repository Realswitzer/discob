# Discob but it like works or something and email got fucking nuked
Did rooms ever work in the first place?
## Prerequisites
- you need node 20+ or something
- MariaDB/MySQL running locally

## Setup
1. Install dependencies and build the client bundle:
   ```bash
   cd client
   npm install
   npm run build
   cd ..
   ```
2. Install server deps and configure environment variables:
   ```bash
   cd server
   npm install
   make a .env file based off the example   # edit this to your DB
   ```
3. Create the database schema: (learn how to use mariadb this sucks)
   ```bash
   mariadb -u <user> -p < server/database/schema.sql
   ```

## Running the app
From `server/`:
```bash
npm run build
npm run dev
```

Visit `http://localhost:3000/` (or whichever host/port you set) to access the UI. rebuild for silly frontend changes.
