#!/bin/bash

VER=0.00005a
docker build . --tag ihadev/iha_web:$VER && docker push ihadev/iha_web:$VER
