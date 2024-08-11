## Project 6: Banking App - Front End

## Goal:

Previously you implemented a basic banking app. We want to expand this banking app into something larger.

## Approach:

* The instructions here are somewhat higher level to correlate with a course's theme of increased independence.
* Many software engineers, myself included, believe that designing the front-end first is the optimal approach. This assignment will do the same. The approach will be to design a *clean* front end, and then implement the backend pieces in a second assignment.
* A basic backend for filler / testing data is still a good idea.

## Assignment:

### Make a React front end for a banking app with the following features:

* A functioning login system which requests a username, password, and verification of credentials.
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

### Clean UI:

* The site needs to have a consistent theme and CSS. Many options exist here. I personally find bootstrap easy and straightforward.
* The site should appear reasonably polished. Items aligned and justified, enough room per textbox, style shouldn't appear like plain HTML, etc.

## Additional details:

* Employees and Administrators can create new accounts. Customers cannot create new accounts.
* If credentials are not entered in correctly, simply state "The username and/or password was not entered in correctly". Do not tell the user what was entered in wrong, banks shouldn't be leaking any kind of account information if possible.
No requirement to publish the site publicly.
* The project must have a single code repo, the group shares the project.
* Each group member must be able to build and run the project locally. 
* The backend need not check for validity of data, such as login or withdrawing more money than exists. But the site should be navigable with dummy data.