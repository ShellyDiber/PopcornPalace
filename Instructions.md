## Installation

```bash
$ git clone https://github.com/ShellyDiber/PopcornPalace.git
$ cd popcorn-palace
$ npm install
```
## Database Configuration 
```bash
start docker
$ docker-compose -f compose.yml  up
```
connect to PostgreSQL DB:
```bash
psql -h localhost -U popcorn-palace 
```




## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

```

## Test

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```

## License

Nest is [MIT licensed](LICENSE).