# Bank Account API
Develop a Bank REST API using Node.js, with the following functionalities

### Deposit

`/deposit` with **accountId** and **amount** as parameters 

### Withdrawal

`/withdraw` with **accountId** and **amount** as parameters

### Transfer

`/transfer` with **fromAccountId** **toAccountId** and **amount** as parameters

## Considerations 
* Deposits can not be above $5000 per day.
* Withdrawal supports a $200 overdraft (balance, can be down to -$200).
* Transfers don’t support overdrafts (can’t leave the balance below 0).
* Add the validations and errors you see necessary.
* The Account entity is not the main focus of the exercise, so only add what’s needed for the functionalities above.
* The code provided is a boilerplate to save you some time. Feel free to change it as you see fit

## What we value
* Testing Strategy
  * Provide the right amount of unit/integration/end-to-end tests following the testing pyramid or any principle you choose.
* Effective Architectural decisions
  * Separating business rules from infrastructure details, either by Clean Architecture or other paradigm.
* Effective response/error handling
* Simple design
  * SOLID
  * KISS
  * DRY
* Straightforward setup and execution

  | :memo: | We understand that all decisions in Engineering are tradeoffs, so please include a readme with your decision-making process. |
  |--------|:-----------------------------------------------------------------------------------------------------------------------------|

## The Extra Mile
* Database management
* Docker
# Lionard Leyva Solutions

## Bank Account API

Este proyecto implementa una API REST para un sistema bancario básico utilizando Node.js, Express, y principios de Clean Architecture.

### Cuentas Predefinidas

El sistema inicia con dos cuentas predefinidas para pruebas:

1. **ID:** `123`, **Saldo inicial:** $1000
2. **ID:** `456`, **Saldo inicial:** $500

### Probar la API

Una vez que la aplicación esté en ejecución, puedes probar la API usando los siguientes comandos `curl`:

#### 1. Compilación y Ejecución del Entorno de Desarrollo

Primero, debes compilar y ejecutar la aplicación en un entorno de desarrollo utilizando Docker Compose:

```bash
test
docker-compose run --rm test npm test

dev
docker-compose up --build dev

Curls

Deposito
curl -X POST http://localhost:3300/deposit \
-H "Content-Type: application/json" \
-d '{"accountId": "123", "amount": 100}'

Retiro
curl -X POST http://localhost:3300/withdraw \
-H "Content-Type: application/json" \
-d '{"accountId": "123", "amount": 50}'

Trasferencia
curl -X POST http://localhost:3300/transfer \
-H "Content-Type: application/json" \
-d '{"fromAccountId": "123", "toAccountId": "456", "amount": 75}'
``` 



