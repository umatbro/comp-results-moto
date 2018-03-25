# Competition results

## Project setup

To run project run those commands:

```
git clone https://github.com/umatbro/comp-results-moto.git
npm install
npm start
```

This will start server on ```localhost:3000```.

### Local database

If you want to run your local database, run MongoDB server:

```
./run_db.sh
```

This will create `data` directory and run MongoDB database.

Then, in another terminal, start the server that will use local database:

```
LOCAL_DB=1 npm start
```

**NOTE** - you have to have [MongoDB installed](https://docs.mongodb.com/manual/installation/#mongodb-community-edition) for it to work.

## API 

### Users

| Method | URL                        | Description                                                                                   |
|--------|----------------------------|-----------------------------------------------------------------------------------------------|
| GET    | `/api/users   `              | Get list of all users.                                                                        |
| GET    | `/api/users/[id] `           | Get information about single user (name, score, completed tracks).                    |
| GET    | `/api/users/ranking`         | Get ranking of users (list of all non-disqualified users sorted by score in descending order). |
| POST   | `/api/users`                 | Create new user. Requires 'name' parameter in request body.
| PUT    | `/api/users[id]/name `       | Modify user name. Requires 'name' parameter in request body.                                  |
| PUT    | `/api/users/[id]/disqualify` | Disqualify user. Body can be empty or contain 'disqualified' parameter equaling `false` to remove disqualification.  |
| PUT    | `/api/users/[id]/add-track`  | Assign new completed track to a user. Track `id` must be present in request body.               |
| PUT    | `/api/users/[id]/remove-track`| Remove track from user's achievements. Track `id` must be present in request body.
| DELETE | `/api/users/[id]/delete`     | Delete user from database.


### Tracks 

| Method | URL                     | Description                                                                                                 |
|--------|-------------------------|-------------------------------------------------------------------------------------------------------------|
| GET    | `/api/tracks`             | Get list of all tracks (information about track name, its length and point value).                           |
| POST   | `/api/tracks/new`         | Create new track. Request body should contain: 'name' (required), 'points' (default=0), 'length' (required). |
| PUT    | `/api/tracks/[id]/modify` | Modify track. Put desired values in request body. You  can set 'name', 'points' and 'length'.                |
| DELETE | `/api/tracks/[id]/delete` | Delete track.                                                                                               |
