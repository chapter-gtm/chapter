# Chapter

This is the chapter app.

## Quick Start

To quickly get a development environment running, run the following:

```shell
make install
. .venv/bin/activate
```

### Local Development

```bash
cp .env.local.example .env
pdm run start-infra # this starts a database and redis instance only
# this will start the SAQ worker, Vite development process, and Litestar
pdm run app run

# to stop the database and redis, run
pdm run stop-infra
```

### Docker

```bash
docker compose up
```

### Details

<summary>Command Examples</summary>

## App Commands

```bash
❯ app

 Usage: app [OPTIONS] COMMAND [ARGS]...

 Litestar CLI.

╭─ Options ────────────────────────────────────────────────────────────────────╮
│ --app          TEXT       Module path to a Litestar application (TEXT)       │
│ --app-dir      DIRECTORY  Look for APP in the specified directory, by adding │
│                           this to the PYTHONPATH. Defaults to the current    │
│                           working directory.                                 │
│                           (DIRECTORY)                                        │
│ --help     -h             Show this message and exit.                        │
╰──────────────────────────────────────────────────────────────────────────────╯
Using Litestar app from env: 'app.asgi:app'
Loading environment configuration from .env
╭─ Commands ───────────────────────────────────────────────────────────────────╮
│ assets       Manage Vite Tasks.                                              │
│ database     Manage SQLAlchemy database components.                          │
│ info         Show information about the detected Litestar app.               │
│ routes       Display information about the application's routes.             │
│ run          Run a Litestar app.                                             │
│ schema       Manage server-side OpenAPI schemas.                             │
│ sessions     Manage server-side sessions.                                    │
│ users        Manage application users and roles.                             │
│ version      Show the currently installed Litestar version.                  │
│ workers      Manage background task workers.                                 │
╰──────────────────────────────────────────────────────────────────────────────╯

```

## Database Commands

Alembic integration is built directly into the CLI under the `database` command.

```bash
❯ app database
Using Litestar app from env: 'app.asgi:create_app'

 Usage: app database [OPTIONS] COMMAND [ARGS]...

 Manage SQLAlchemy database components.

╭─ Options ────────────────────────────────────────────────────────────────────╮
│ --help  -h    Show this message and exit.                                    │
╰──────────────────────────────────────────────────────────────────────────────╯
╭─ Commands ───────────────────────────────────────────────────────────────────╮
│ downgrade              Downgrade database to a specific revision.            │
│ init                   Initialize migrations for the project.                │
│ make-migrations        Create a new migration revision.                      │
│ merge-migrations       Merge multiple revisions into a single new revision.  │
│ show-current-revision  Shows the current revision for the database.          │
│ stamp-migration        Mark (Stamp) a specific revision as current without   │
│                        applying the migrations.                              │
│ upgrade                Upgrade database to a specific revision.              │
╰──────────────────────────────────────────────────────────────────────────────╯

```

### Upgrading the Database

```bash
❯ app database upgrade
Using Litestar app from env: 'app.asgi:create_app'
Starting database upgrade process ───────────────────────────────────────────────
Are you sure you you want migrate the database to the "head" revision? [y/n]: y
2023-10-01T19:44:13.536101Z [debug    ] Using selector: EpollSelector
2023-10-01T19:44:13.623437Z [info     ] Context impl PostgresqlImpl.
2023-10-01T19:44:13.623617Z [info     ] Will assume transactional DDL.
2023-10-01T19:44:13.667920Z [info     ] Running upgrade  -> c3a9a11cc35d, init
2023-10-01T19:44:13.774932Z [debug    ] new branch insert c3a9a11cc35d
2023-10-01T19:44:13.783804Z [info     ] Pool disposed. Pool size: 5  Connections
 in pool: 0 Current Overflow: -5 Current Checked out connections: 0
2023-10-01T19:44:13.784013Z [info     ] Pool recreating
```

## Worker Commands

```bash
❯ app worker
Using Litestar app from env: 'app.asgi:create_app'

 Usage: app worker [OPTIONS] COMMAND [ARGS]...

 Manage application background workers.

╭─ Options ────────────────────────────────────────────────────────────────────╮
│ --help  -h    Show this message and exit.                                    │
╰──────────────────────────────────────────────────────────────────────────────╯
╭─ Commands ───────────────────────────────────────────────────────────────────╮
│ run       Starts the background workers.                                     │
╰──────────────────────────────────────────────────────────────────────────────╯

```

## Run Commands

To run the application through Granian (HTTP1 or HTTP2) using the standard Litestar CLI, you can use the following:

```bash
❯ app run --help
Using Litestar app from env: 'app.asgi:app'
Loading environment configuration from .env

 Usage: app run [OPTIONS]

 Run a Litestar app.
 The app can be either passed as a module path in the form of <module
 name>.<submodule>:<app instance or factory>, set as an environment variable
 LITESTAR_APP with the same format or automatically discovered from one of
 these canonical paths: app.py, asgi.py, application.py or app/__init__.py.
 When auto-discovering application factories, functions with the name
 ``create_app`` are considered, or functions that are annotated as returning a
 ``Litestar`` instance.

╭─ Options ────────────────────────────────────────────────────────────────────╮
│ --port                   -p  INTEGER                 Serve under this port   │
│                                                      (INTEGER)               │
│                                                      [default: 8000]         │
│ --wc,--web-concurrency…  -W  INTEGER RANGE           The number of processes │
│                              [1<=x<=7]               to start.               │
│                                                      (INTEGER RANGE)         │
│                                                      [default: 1; 1<=x<=7]   │
│ --threads                    INTEGER RANGE [x>=1]    The number of threads.  │
│                                                      (INTEGER RANGE)         │
│                                                      [default: 1; x>=1]      │
│ --blocking-threads           INTEGER RANGE [x>=1]    The number of blocking  │
│                                                      threads.                │
│                                                      (INTEGER RANGE)         │
│                                                      [default: 1; x>=1]      │
│ --threading-mode             THREADMODES             Threading mode to use.  │
│                                                      (THREADMODES)           │
│ --http                       HTTPMODES               HTTP Version to use     │
│                                                      (HTTP or HTTP2)         │
│                                                      (HTTPMODES)             │
│ --opt                                                Enable additional event │
│                                                      loop optimizations      │
│ --backlog                    INTEGER RANGE [x>=128]  Maximum number of       │
│                                                      connections to hold in  │
│                                                      backlog.                │
│                                                      (INTEGER RANGE)         │
│                                                      [default: 1024; x>=128] │
│ --host                   -H  TEXT                    Server under this host  │
│                                                      (TEXT)                  │
│                                                      [default: 127.0.0.1]    │
│ --ssl-keyfile                FILE                    SSL key file (FILE)     │
│ --ssl-certificate            FILE                    SSL certificate file    │
│                                                      (FILE)                  │
│ --create-self-signed-c…                              If certificate and key  │
│                                                      are not found at        │
│                                                      specified locations,    │
│                                                      create a self-signed    │
│                                                      certificate and a key   │
│ --http1-buffer-size          INTEGER RANGE           Set the maximum buffer  │
│                              [x>=8192]               size for HTTP/1         │
│                                                      connections             │
│                                                      (INTEGER RANGE)         │
│                                                      [default: 417792;       │
│                                                      x>=8192]                │
│ --http1-keep-alive/--n…                              Enables or disables     │
│                                                      HTTP/1 keep-alive       │
│                                                      [default:               │
│                                                      http1-keep-alive]       │
│ --http1-pipeline-flush…                              Aggregates HTTP/1       │
│                                                      flushes to better       │
│                                                      support pipelined       │
│                                                      responses               │
│                                                      (experimental)          │
│ --http2-adaptive-windo…                              Sets whether to use an  │
│                                                      adaptive flow control   │
│                                                      for HTTP2               │
│ --http2-initial-connec…      INTEGER                 Sets the max            │
│                                                      connection-level flow   │
│                                                      control for HTTP2       │
│                                                      (INTEGER)               │
│ --http2-initial-stream…      INTEGER                 Sets the                │
│                                                      `SETTINGS_INITIAL_WIND… │
│                                                      option for HTTP2        │
│                                                      stream-level flow       │
│                                                      control                 │
│                                                      (INTEGER)               │
│ --http2-keep-alive-int…      OPTIONAL                Sets an interval for    │
│                                                      HTTP2 Ping frames       │
│                                                      should be sent to keep  │
│                                                      a connection alive      │
│                                                      (OPTIONAL)              │
│ --http2-keep-alive-tim…      INTEGER                 Sets a timeout for      │
│                                                      receiving an            │
│                                                      acknowledgement of the  │
│                                                      HTTP2 keep-alive ping   │
│                                                      (INTEGER)               │
│ --http2-max-concurrent…      INTEGER                 Sets the                │
│                                                      SETTINGS_MAX_CONCURREN… │
│                                                      option for HTTP2        │
│                                                      connections             │
│                                                      (INTEGER)               │
│ --http2-max-frame-size       INTEGER                 Sets the maximum frame  │
│                                                      size to use for HTTP2   │
│                                                      (INTEGER)               │
│ --http2-max-headers-si…      INTEGER                 Sets the max size of    │
│                                                      received header frames  │
│                                                      (INTEGER)               │
│ --http2-max-send-buffe…      INTEGER                 Set the maximum write   │
│                                                      buffer size for each    │
│                                                      HTTP/2 stream           │
│                                                      (INTEGER)               │
│ --url-path-prefix            TEXT                    URL path prefix the app │
│                                                      is mounted on           │
│                                                      (TEXT)                  │
│ --debug                  -d                          Run app in debug mode   │
│ --pdb,--use-pdb          -P                          Drop into PDB on an     │
│                                                      exception               │
│ --respawn-failed-worke…                              Enable workers respawn  │
│                                                      on unexpected exit      │
│ --reload                 -r                          Reload server on        │
│                                                      changes                 │
│ --help                   -h                          Show this message and   │
│                                                      exit.                   │
╰──────────────────────────────────────────────────────────────────────────────╯

```
