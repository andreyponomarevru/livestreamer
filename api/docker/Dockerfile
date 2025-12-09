# Specify node version to make the build deterministic.
# This ARG is available globally to all stages in this file.
ARG NODE_VERSION=22.13.1

# Setting 'USER node' forces us to keep everything in /home/node, otherwise
# there is a permissions error at build time. The thing is that by default in
# node image the only dir owned by the 'node' user is the /home/node dir. When
# you create/set another WORKDIR, it will ALWAYS be owned by the 'root', hence
# the build will always be failing with permissions error.

FROM node:${NODE_VERSION}-slim AS base
# If you use the alpine image, download Bash package > install Bash (to be able 
# to execute scripts) > remove the downloaded package to free up space (Bash 
# remains installed)
# RUN apk add --upgrade --no-cache bash
USER node
WORKDIR /home/node
COPY --chown=node:node package*.json ./

#
# Development env image
#

FROM base AS development
# Install curl and ping for debugging
#USER root
#RUN apt-get update && apt-get install -y curl inetutils-ping
USER node
WORKDIR /home/node
# Install all deps including development
RUN yarn install --frozen-lockfile
# Copy the whole dir instead of only "./src", otherwise directories with test
# files won't be included
COPY --chown=node:node . .
CMD [ "npm", "run", "serve:dev" ]

#
# Production env image
#

# Stage 1: compile TS to JS

FROM base AS js
USER node
WORKDIR /home/node
COPY --chown=node:node tsconfig*.json ./
# Install dependencies before copying .src, to leverage Docker build cache
RUN yarn install --frozen-lockfile && yarn cache clean
COPY --chown=node:node ./src ./src
RUN yarn build

# Stage 2: strip all things TypeScript from our image.

FROM base AS production_base
USER node
WORKDIR /home/node
COPY --chown=node:node --from=js /home/node/build ./
# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Stage 3: create final production image ready to be deployed - copy only the
# required files from stages above.

FROM node:${NODE_VERSION}-slim AS production
USER node
WORKDIR /home/node
COPY --from=production_base /home/node ./
# Run the app direcly, without NPM to be able to handle error signals.
# If you run it via NPM, if error happens, the process that will recieve an error wiill be the initial process - NPM - instead of node.
CMD ["node", "index.js"]

#
# Test env image
#

# In general, this image should be more like production, but here it's more like dev because I use typescript and it's impossible to run tests if I compile the code

FROM base AS test
USER node
WORKDIR /home/node
RUN yarn install --frozen-lockfile
COPY --chown=node:node . .
CMD [ "npm", "run", "serve:dev" ]
# CMD ["tail", "-f", "/dev/null"] # for debugging
