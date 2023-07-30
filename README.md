<h1 align="center">Dns check right ip</h1>

## Getting Started

### With Docker

Using docker compose:

```yaml
version: "3"
services:
  app:
    image: ghcr.io/jeufore/dns-check-right-ip:latest
    container_name: dns-check-right-ip
    environment:
      - PORT=8080 # optional
    ports:
      - "80:8080"
```

or docker run
```bash
docker run -d \
    --name dns-check-right-ip \
    -p 80:8080
    ghcr.io/jeufore/dns-check-right-ip:latest
```

### For the development

```bash
# install dependencies project
npm i

# start project
npm start
```

## .env
| Parameter             | Example value                                 | Description                               |
|-----------------------|-----------------------------------------------|-------------------------------------------|
| PORT                  | "8080"                                        | Service exposing port                     |

<br/>

## For use

```js
fetch('http://localhost:8080?dns=example.com&ip=93.184.216.34&prefer=https')
```

### `dns`

**Required** The dns record.

### `ip`

**Required** The ip for resolve dns.

### `prefer`

The prefer scheme. Default `"https"`.

<br/>

<b>For more details see the postman [collection](/docs/postman.json)</b>


