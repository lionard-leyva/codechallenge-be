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

Inspired by [Bank Kata](https://github.com/sandromancuso/Bank-kata)
