> **Current Development Status**
>
> - At the moment of writing, React client uses only a fraction of the existing API.

# LiveStreamer

## About

**RU**

Многопользовательское веб-приложение для аудио-стриминга и общения в чате. Концептуально, это клон <a href="http://mixlr.com">Mixlr</a>, но в меньшем масштабе. Архитектурно, состоит из трёх компонентов: фронт, API и CLI-приложение для стриминга. Аудио-стриминг реализован через HTTP, а чат, интерактивные функции и уведомления — через WebSocket. Чтобы начать стрим, пользователь запускает на своей машине HTTP клиент, который захватывает аудио из ОС и отправляет его на сервер приложения. Другие пользователи, в свою очередь, могут открыть сайт приложения (React.js-клиент) и слушать стрим, общаться в чате, ставить лайки и пользоваться иными интерактивными функциями.

**EN**

Web application for broadcasting live audio and chatting. Conceptually, it is similar to [Mixlr](http://mixlr.com) but on a smaller scale.

Suppose you're a dj and you want to broadcast your mix live. All you need to do is to start up [this command-line app](https://github.com/ponomarevandrey/live-streamer-source-client) on your local machine — it captures the live audio output and streams it to the application server, which in turn broadcasts the audio to all connected listeners.

## Architecture

```
                                                        chat over WebSocket + HTTP
            auido stream over HTTPS/1.1           audio stream over HTTP WebSocket
 BROADCASTER -----------------------> || APP SERVER ---------------------------> LISTENERS
(HTTP client)       mp3, 128kbps      ||                   mp3, 128kbps        (React Client)
                                      ||
                              Nginx as reverse proxy
                          translating HTTPS/1.1 to HTTP/2
```

![](./doc/architecture.png)

## Stack

- **backend:** TypeScript, Node.js (Express.js), PostgreSQL (raw SQL, without ORM), Redis, RabbitMQ
- **frontend:** React.js

## Documentation

For the Node.js REST API documentation refer to the [e2e API tests](https://github.com/andreyponomarevru/livestreamer/tree/main/api/tests-e2e-api).

## Backend

### Node.js REST API ( dir)

Here's a quick overview of features implemented in application server's API:

- cookie session authentication
- registration confirmation (by email)
- forgotten password recovery (by email)
- soft account deletion
- RBAC authorization
- caching of SQL queries (using Redis)
- rate-limiting
- cursor pagination
- chat (over HTTP + WebSocket)

### Database (`/postgres` dir)

Application main database, PostgreSQL.

All tables are created and seeded via migrations files in [`api/migrations`](https://github.com/andreyponomarevru/livestreamer/tree/main/api/src/migrations).

**WARNING** The schema demonstrated on this figure is a bit outdated: I have added/renamed some columns and tables. I left it here just to provide a general idea of how the data is structured.

![](./doc/db-schema.png)

### Secondary database / cache (`/redis` dir)

Redis is used for storing frequently updated real-time data:

- caching API requests
- storing live stream likes, stream metadata
- storing authenticated user sessions

### Message Queue

RabbitMQ queues some tasks to be performed on user sign up (e.g. sending sign up confirmation email)

### HTTP Server (`/nginx` dir)

Nginx is used as reverse proxy in front of the App server.

Besides its main purpose — to proxy HTTP and WebSocket traffic — it is also configured as a rate limiter.

**IMPORTANT** Nginx is nod dockerized. It is deployed manually.

### Frontend (`/frontend` dir)

React.js app.

**WARNING** Currently, haven't included this part of the app into the CI/CD pipeline.

Some screenshots (just to give you an idea of how the app looks in different states):

<img src="./doc/ui-screenshots/01.png" width="40%">

<img src="./doc/ui-screenshots/02.png" width="40%">

<img src="./doc/ui-screenshots/03.png" width="40%">

<img src="./doc/ui-screenshots/04.png" width="40%">

<img src="./doc/ui-screenshots/05.png" width="40%">

<img src="./doc/ui-screenshots/06.png" width="40%">

## Streaming client (`/streaming-client` dir)

Command-line Source Client (HTTP client + audio broadcaster) for LiveStreamer app. Use it to broadcast live audio to application server.

The client app consists of two parts:

- child process capturing all OS audio
- HTTP client, sending the captured audio to the server in real-time.

To authenticate to the application server, the client uses regular cookie authentication.

### Requirements

This command-line app requires two environment variables containing your username and password: `BROADCASTER_USERNAME` and `BROADCASTER_PASSWORD`.

### How to use (Linux)

Short explanation:

1. Sign up to the app
2. Set up env vars in your OS with username and password
3. Using the streaming-client CLI-app:
   ```shell
   yarn run login:prod
   yarn run schedule:prod
   yarn run stream:prod
   ```

Full explanation:

1. Go to the website and sign up to the app at `https://livestreamer.andreyponomarev.ru`
2. Set up two env vars in OS, with username and password you've used for the app signup above
3. Sign in to the application server: `node build/index.js login:prod`
4. Schedule the broadcast. The best way to do this is via the web app at `https://livestreamer.andreyponomarev.ru`. After scheduling a stream you will see a link to it in the format `https://livestreamer.andreyponomarev.ru/users/me/broadcasts/x`, where x is your broadcast id. You will need to pass it as argument in the next step.

   **NOTE** Alternatively you can schedule the stream via the command line by issuing `yarn run schedule:prod`. This will schedule a new stream to be broadcasted _immediately_ (you can edit and update it later via web app if you want). In response you will get the url in the format `/users/me/broadcasts/x`, where `x` is your broadcast id

5. Now you can start streaming. Issue the following command passing it the broadcast id: `yarn run stream:prod x`, where `x` is your scheduled broadcast id.

   The audio of the stream will be automatically saved locally.

   **WARNING** If you will attempt to start streaming at the time which does not match the scheduled broadcast time range, you will recieve the error response.

6. (optional) After the stream is finished, log out: `yarn run logout:prod`

   You will find the `.wav` file of the recorded stream in the `recordings` directory of this command-line app.

# How it works

### High-level overview

The app involves three parties: **streaming client (aka broadcaster)**, **Application Server** and **consuming client (aka listener(s))**:

- **source HTTP client (aka broadcaster)** (the app and its documentation are in the [separate repo](https://github.com/ponomarevandrey/live-streamer-source-client)) — it captures the audio output from OS and streams it to the app server using regular progressive HTTP streaming
- **application server** (this repo) — serves as audio streaming and chat server. It provides REST API used by both Source Client app and React.js client app. App server takes the incoming audio stream and passes it through to listeners.
- **consuming clients (aka listeners)**. React.js client-side app.

### Low-level overview

The application server is implemented as REST API and provides two main features of the app: audio broadcasting and chat.

0. To start streaming, the broadcaster should start the command line [Source Client app](https://github.com/ponomarevandrey/live-streamer-source-client) and log in to the application server. Authentication is implemented using a cookie session (stored in Redis).
1. When the broadcaster starts streaming, the Source Client app sends chunked audio stream in PUT request to `/stream` endpoint. Application server stores all live stream data (listener count, likes, etc.) in Redis.
2. Application server detects the start of the stream and sends a notification to the frontend over WebSocket.
3. On the client side, React receives WebSocket notification and switches into "LIVE" mode, displaying the stream status, timer, number of listeners online, and other data. When the user clicks the 'play' button, React fetches live audio using `GET /stream`.
4. During the stream, listeners can "like" the broadcast showing that they like the music by clicking the 'heart' button. After clicking, the button becomes inactive for 10 seconds. The API endpoint allowing to "like" the broadcast is rate limited, so if the client attempts to trick the app by sending multiple "like" requests directly to the API endpoint, Nginx will ban the client's IP for some time.
5. After the broadcast is finished, all stream data is saved from Redis to PostgreSQL. By default, the finished stream is hidden — it is not visible to listeners; only the user with broadcaster's permissions can log in and publish (make visible to everyone) the finished broadcasts. Broadcaster can also edit/update title, description, links, and other metadata of past broadcasts.
6. Broadcaster can schedule new broadcasts (this feature is currently supported only by API; React client doesn't provide an interface for this). To do this, the client should send the scheduled broadcast's title and start/end date, and time

All chat functionality, notifications as well as other real-time features are implemented over WebSocket + HTTP. Technically it is possible to implement everything solely over WebSocket, but it would end up in a pretty chaotic and unreliable client-server communication. So, to make the interaction more organized, I utilize both WebSocket and HTTP. For instance, this is how I implemented the chat:

1.  Client sends a chat message to REST API
2.  API saves the message to the database and returns 200 response to the sender.
3.  Then API broadcasts the saved message to all connected clients (except sender) over WebSocket.

    Thus we get the benefits of REST architecture and Websocket protocol at the same time. While WebSocket allows us to do everything in real-time, REST provides the structure and order in client-server communication.

# <del>Deployment</del>

**WARNING** This section is deprecated. I replaced the manual deployment with Bash and the only thing left is to set up the Workflow running these scripts in GitHub Actions. This is on my TODO list.

## Frontend

To build and deploy the app to production env, run `build-and-deploy.sh` script located in `livestreamer-frontend` directory.

It will start Compose with `client` container with all production environment variables, compile the code, stop the container and upload the compiled code to the server (`/var/www/...`) where the app will be served by Nginx.

### Backend

6. **SSH into VPS**

7. **Pull new image**
   ```shell
   # 'api' is the container name
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull api
   ```
8. **Restart the container**. If you need to restart only the containers whose image was updated (as we usually do) add the `--no-deps` flag.

   ```shell
   docker-compose \
     -f docker-compose.yml \
     -f docker-compose.prod.yml \
     up
       --force-recreate \
       --build
       # + optional `--no-deps` and `-d`
   ```

   - Without `--force-recreate` Compose will use the old image
   - Without `-d` flag Compose will run in "attached mode" outputing everything to console.
     > By default, Docker runs the container in attached mode. In the attached mode, Docker can start the process in the container and attach the console to the process’s standard input, standard output, and standard error ([source](https://www.java4coding.com/contents/docker/docker-attached-vs-detached-mode))
     > So later when we will be automating the deployment with GitHub Actions, always use `-d` everywhere to detach the terminal from Compose process stdout/stderr. When we write any deployment Bash scripts we should use the '-d' flag as well.

9. **Delete old image** to free up the disk space

   ```shell
   docker image prune -f
   ```

   - If you're deploying the app for the first time — refer to [my article on setting up CI/CD with GitHub Actions](https://andreyponomarev.ru/articles/2021-02-12-ci-cd-for-vps-with-github-actions.html), "Manual Deployment" section, from bullet point four and on.
   - If you want just to update the specific container — refer to [my article on setting up CI/CD with GitHub Actions](https://andreyponomarev.ru/articles/2021-02-12-ci-cd-for-vps-with-github-actions.html), "Redeployment" section.

# Testing

- **To run unit tests for the API (`/api`):**
  - in dev env:
    ```shell
    cd api
    docker compose --file docker-compose.dev.yml up api-dev
    docker exec -it api-dev bash
    npm run test:unit
    ```
  - in test env: `./ci-cd/run-unit-tests.sh` (normally, this should be executed only in CD pipeline but you can use it locally, before pushing the code, to double check that everything works).
- **To run integration tests:**
  - in dev env:
    ````shell
    cd api
    docker compose --file docker-compose.dev.yml up
    docker exec -it api-dev bash
    npm run test:int
    ```.
    ````
  - in test env: start all containers > `./ci-cd/run-int-test.sh` (normally, this should be executed only in CD pipeline but you can use it locally, before pushing the code, to double check that everything works).
    In both environments, while inside the container you can also run migrations, e.g. `npm run migratesql up`
- **To run e2e API test:**
  - in dev env:
    ````shell
    cd api
    docker compose --file docker-compose.dev.yml up
    docker exec -it api-dev bash
    npm run test:e2e-api
    ```.
    ````
  - in test env: start all containers > `./ci-cd/run-int-test.sh` (normally, this should be executed only in CD pipeline but you can use it locally, before pushing the code, to double check that everything works).
    In both environments, while inside the container you can also run migrations, e.g. `npm run migratesql up`
