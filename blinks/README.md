# express-boilerplate

## Connect to Mongodb
- Duplicate sample env to env
- Configure env to your environment
- Run `npm i`
- Run `npm start`

## Setup Mongodb

- Install docker
- Run `docker-compose up -d`
- Run `docker-compose exec mongodb1 mongo`
- Enter

```javascript
rsconf = {
  _id: "rsmongo",
  members: [
    {
      _id: 0,
      host: "mongodb1:27017",
      priority: 4,
    },
    {
      _id: 1,
      host: "mongodb2:27017",
      priority: 2,
    },
    {
      _id: 2,
      host: "mongodb3:27017",
      priority: 1,
    },
  ],
};
```

- Run `rs.initiate(rsconf)`

## Connect to Mongodb

- Add `mongodb://127.0.0.1:27017` as `MONGO_CONNECTION_URL` on `.env` or in `mongodb compass`