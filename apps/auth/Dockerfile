FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json tsconfig.json

# RUN npm install -g yarn

RUN yarn install

COPY apps/auth apps/auth
COPY libs libs

RUN cd apps/auth && yarn

RUN npm run build auth

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

# RUN npm install -g yarn

RUN yarn install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]