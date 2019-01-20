FROM jamiehewland/alpine-pypy:3

MAINTAINER Ovidiu Serban, o.serban@imperial.ac.uk

WORKDIR /code

COPY . .

RUN apk add --no-cache bash

RUN apk --no-cache add --virtual build-base && \
    pip install -r requirements.txt && \
    apk del build-base

CMD "./start.sh"