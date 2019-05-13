## Acronym Finder

For when one needs to find that thing someone mentioned.

### Running the Backend

Requires Python 3.6+ and PostgreSQL 9.6+

```
cd backend
docker run -e POSTGRES_USER=acronym \
           -e POSTGRES_PASSWORD=acronym \
           -e POSTGRES_DB=acronymdb \
           -p 5432:5432 \
           -v "$PWD/data/init.sql":/docker-entrypoint-initdb.d/init.sql:ro \
           -d postgres:11.2
pip install .
acr_finder
```

### Running the FrontEnd

Requires Node.js 9+

```
cd frontend
yarn install
yarn start
```
