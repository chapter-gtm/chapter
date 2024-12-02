# Chapter - Lead research. Purpose-built for developer tools

Chapter builds lead pipelines for founders and GTM teams at developer tool companies, identifying who to talk to and providing evidence on why they need their product.

Note: This project is under ongoing development.

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

Note: This project integrates with third-party APIs. You will need to obtain the necessary API keys for these services and update them in your `.env` file. For example, see the provided `.env.docker.example` file for the required format.
