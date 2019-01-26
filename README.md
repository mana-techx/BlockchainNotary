# Blockchain based Notary Service

An Implementation of Notary service to authorize Proof of Ownership and a private Blockchain persistence.

## Installation Instructions

 Action| Instructions |
|--|--|
| Clone the GIT repository |[https://github.com/homeawaymg/BlockchainNotary.git]
| Install the npm packages using the following command  | npm install 
| Run the Notary Service server using the following command |node app.js

## Notary Workflow
Broadly the Notary service support operations in the following 3 broad categories.

 1. Verification
 2. Registration
 3. Lookup Registered Information

### Verification workflow commands:
|Action  | URL & Data |
|--|--|
|Wallet Verification Request  | curl -X POST \ http://localhost:8000/requestValidation \ -H 'Content-Type: application/json' \ -H 'cache-control: no-cache' \ -d '{ "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL" }'  |
|Message and Signature Verification with Wallet  | curl -X POST \ http://localhost:8000/message-signature/validate \ -H 'Content-Type: application/json' \ -H 'cache-control: no-cache' \ -d '{ "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL", "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q=" }' |

### Registration Workflow Command
|Action| URL & Data  |
|--|--|
|Register Star Ownership  | curl -X POST \ http://localhost:8000/block \ -H 'Content-Type: application/json' \ -H 'cache-control: no-cache' \ -d '{ "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL", "star": { "dec": "68° 52' 56.9", "ra": "16h 29m 1.0s", "story": "Found star using https://www.google.com/sky/" } } |


### Lookup Registered Stars
| Action | Query |
|--|--|
| Get Star block by hash with JSON response. | http://localhost:8000/stars/hash:[HASH] |
|Get Star block by wallet address (blockchain identity) with JSON response.| http://localhost:8000/stars/address:[ADDRESS] |
| Get star block by star block height with JSON response.| http://localhost:8000/block/[HEIGHT] |


