## Acronym Finder

The single best thing, besides asking a colleague or Google the meaning of that acronym someone mentioned in a meeting.

Yes, feel free not to use it :)

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
