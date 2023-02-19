# imrok-notion

## Getting started

### Environment variables

A `.env.development` file must be created at the root of the project, with given properties filled :

```.env
WEBSITE_TITLE=
NOTION_TOKEN=
DATABASE_ID=
```

### Local server

```sh
npm start
```

## Troubleshooting

### Unable to connect (gstatic)

VPN can block first `gstatic.com` content load, and result in an "Unable to connect" error on `localhost:8000`.

_Gstatic dependencies should be investigated._
