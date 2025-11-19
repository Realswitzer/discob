# Database Setup

1. Make sure MariaDB/MySQL is running and that you have a user with permission to create databases/tables.
2. Import the schema:

   ```bash
   mysql -u <user> -p < server/database/schema.sql
   ```

   This creates the `discob` database along with the `accounts` and `messages` tabes
3. Provide the connection credentials to the server via environment variables (see `.env.example`):

   | Variable       | Description                   |
   | -------------- | ----------------------------- |
   | `DB_HOST`      | Database host (e.g. `127.0.0.1`) |
   | `DB_USER`      | Database user                  |
   | `DB_PASSWORD`  | User password                  |
   | `DB_NAME`      | Database name (`discob`)       |

4. Run `npm run build && npm run dev` inside `server/` to start the backend.
