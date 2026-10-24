FROM node:20-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# The API base URL is compiled into the bundle, so it must be known at build
# time. Without it Vite falls back to the repo's .env.production, and if that
# is absent too the client ends up with API_BASE_URL='' — same-origin requests
# that this image's nginx has no proxy for, so the app renders and then loads
# no data.
#
# Written to .env.production.local (Vite's highest-precedence file) only when
# the arg is non-empty: an empty VITE_BASE_URL would otherwise override the
# committed .env.production with nothing, which is the same failure.
ARG VITE_BASE_URL
RUN if [ -n "$VITE_BASE_URL" ]; then \
      printf 'VITE_BASE_URL=%s\n' "$VITE_BASE_URL" > .env.production.local; \
      echo "building against $VITE_BASE_URL"; \
    else \
      echo "no VITE_BASE_URL build arg; using committed .env.production"; \
    fi \
 && npm run build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY <<'NGINX' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
