#!/bin/bash
docker build -t nft:v1 .                    
docker run -p 3000:3000 nft:v1 entrypoint.sh