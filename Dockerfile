# Use an official Node.js runtime as a parent image
FROM node:25.6-alpine AS builder

WORKDIR /app
COPY . .
RUN yarn 
RUN yarn build

FROM node:25.6-alpine AS dev
WORKDIR /app
COPY . .
ENTRYPOINT [ "npm", "run" ]
CMD [ "start:dev" ]

# Final production image
FROM node:25.6-alpine AS runtime
WORKDIR /app

COPY ./package.json ./package.json
RUN npm install --omit=dev
COPY --from=builder /app/build ./build

ENTRYPOINT [ "npm", "run" ]
CMD [ "start" ]