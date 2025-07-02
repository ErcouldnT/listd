FROM ghcr.io/railwayapp/nixpacks:ubuntu-1741046653

ENTRYPOINT ["/bin/bash", "-l", "-c"]
WORKDIR /app/


COPY .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix
RUN nix-env -if .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix && nix-collect-garbage -d
RUN sudo apt-get update && sudo apt-get install -y --no-install-recommends curl wget

ARG CI NIXPACKS_METADATA NIXPACKS_SPA_OUTPUT_DIR NODE_ENV NPM_CONFIG_PRODUCTION SOURCE_COMMIT
ENV CI=$CI NIXPACKS_METADATA=$NIXPACKS_METADATA NIXPACKS_SPA_OUTPUT_DIR=$NIXPACKS_SPA_OUTPUT_DIR NODE_ENV=$NODE_ENV NPM_CONFIG_PRODUCTION=$NPM_CONFIG_PRODUCTION SOURCE_COMMIT=$SOURCE_COMMIT

# setup phase
# noop

# install phase
ENV NIXPACKS_PATH=/app/node_modules/.bin:$NIXPACKS_PATH
COPY . /app/.
RUN --mount=type=cache,id=u04ckggwwss4g8wk84800wow-/root/npm,target=/root/.npm npm ci

# build phase
COPY . /app/.
RUN --mount=type=cache,id=u04ckggwwss4g8wk84800wow-node_modules/cache,target=/app/node_modules/.cache npm run build


RUN printf '\nPATH=/app/node_modules/.bin:$PATH' >> /root/.profile


# start
COPY . /app

CMD ["npm run start"]

