# Quecto - A simple link shortener
Quecto is a simple link shortener. It is written in TypeScript, and use Bun for performance. Currently, it uses SQLite as its database, but in the future it could potentially support MySQL and PostgreSQL.

## Setup
### Standalone
0. Make sure you have Bun installed

1. Clone the repository
```
git clone https://github.com/oriionn/quecto.git
```

2. Install dependencies
```
bun install
```

3. Init the database
```
bun generate:db
```

4. Generate the config
```
bun generate:config
```

5. Configure the database in `data/config.yml`

6. Build the project
```
bun run build
```

7. Start the server
```
bun start
```
