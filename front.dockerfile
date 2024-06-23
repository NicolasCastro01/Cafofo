# Build Stage
FROM node:latest AS BUILD_IMAGE
WORKDIR /app
COPY ./front/package.json ./
COPY ./front/yarn.lock ./
COPY ./front/next.config.js ./
COPY ./front/tsconfig.json ./
RUN yarn install --frozen-lockfile
COPY ./front/ .
RUN npm run build


# Production Stage
FROM node:alpine AS PRODUCTION_STAGE
WORKDIR /app
COPY --from=BUILD_IMAGE /app/package.json ./
COPY --from=BUILD_IMAGE /app/yarn.lock ./
COPY --from=BUILD_IMAGE /app/next.config.js ./
COPY --from=BUILD_IMAGE /app/tsconfig.json ./
COPY --from=BUILD_IMAGE /app/.next ./.next
COPY --from=BUILD_IMAGE /app/public ./public
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules

EXPOSE 8080
CMD ["npm", "start"]
