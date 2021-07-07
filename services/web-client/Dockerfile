FROM node:14-alpine3.13 AS builder
WORKDIR /app

ARG BASE_GAME_MATCHING_CARDS_URL
ARG BASE_GAME_MATCHING_CARDS_URL_SSR

ENV BASE_GAME_MATCHING_CARDS_URL $BASE_GAME_MATCHING_CARDS_URL
ENV BASE_GAME_MATCHING_CARDS_URL_SSR $BASE_GAME_MATCHING_CARDS_URL_SSR

COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN npm run build

FROM node:14-alpine3.13
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json /app/yarn.lock ./
RUN yarn
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["yarn", "run", "start"]

# FROM node:14-alpine3.13 AS base
# WORKDIR /app
# ENV NODE_ENV=production
# COPY package.json yarn.lock ./
# RUN yarn

# FROM base AS builder
# WORKDIR /app
# COPY . .
# RUN yarn run build

# FROM base
# WORKDIR /app
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# EXPOSE 3000
# CMD yarn run start
