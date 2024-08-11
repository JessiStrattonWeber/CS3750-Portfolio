## Project 7: Banking App - Back End

## Goal:

Previously you implemented the front end of a banking app. This assignment implements the back end.

## Approach:

* Front end design has a wonderful benefit in that it communicates well with all stakeholders what the product should do. Your group assignment is to get the site working.

## Assignment:

As a reminder, the site must have a functioning back end so the following works:

* Implement the functioning login system. This will have one catch from prior assignments. Hash the passwords using sha-256 instead of storing passwords plain text. The database should only store a hash of the password, and verifying credentials means the user supplied password is hashed and checked for exact matching with the data store's hash for this account.  (Normally a salt would also be added with each user to mitigate issues with dictionary attacks, but for now, just practice using sha-256. Also, normally a certificate would ensure a secure connection to avoid man-in-the-middle attacks, but that is not part of this assignment.)
* If credentials are not entered in correctly, simply state "The username and/or password was not entered in correctly". Do not tell the user what was entered in wrong, banks shouldn't be leaking any kind of account information if possible.
* Allow for three company roles: administrator, employee, customer

### Administrators:

* Can access all screens.
* Administrators can even have their own bank accounts. (This makes things simpler.)
* Can elevate/demote rights. Any customer, employee, or administrator can be reassigned into a different role

### Customers:

* All users should be assigned a bank customer ID number. This number should be simple to remember and later on cannot be a data store key.
* Allow the user deposit/withdraw money into three accounts labeled savings, checking, and investment. 
* Allow the user to transfer money into any of the three accounts.
* Show both a full account transaction history and an individual account transaction history, with date times and money changes. 

### Employees:

* Can view any account associated with a bank customer ID, and likewise deposit/withdraw/transfer money.
* Allow the user to transfer money to another customer's account. This requires knowledge of the other customer's ID
* Employees and Administrators can create new accounts. Customers cannot create new accounts.

### Clean UI:

* The site needs to have a consistent theme and CSS. Many options exist here. I personally find bootstrap easy and straightforward.
* The site should appear reasonably polished. Items aligned and justified, enough room per textbox, style shouldn't appear like plain HTML, etc.
