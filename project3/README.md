## Project 3: Node, Express, Mongo, and RESTful API

## Goal:

Introduction to Mongo and RESTful API with Node and Express. React is avoided in this assignment so as not to overwhelm. A React frontend will come later. (Note that normally a majority of developers prefer developing a front end first, and I agree with them. But for now, this will suffice.)

## Assignment overview:

Create a Node/Express/Mongo backend website.  The purpose is to have a site which has a user account/login system as well as a checking account and a savings account tracker. Create all the necessary routes that a later front end can use. All routes must accept JSON and/or return JSON. Plain text input or output is not allowed. All RESTful routs should be either GET or POST (we can avoid PUTs and DELETEs for now to help with testing.) Use GET if data is only being requested without any kind of query, such as display all users. Use POST if data is being sent to narrow down the query (most of these upcoming routes will use POST.)  The RESTful routes are as follows:

## Backend:

* Accepts a new account profile with a first name, last name, email address, phone number, and password. (We will handle security in the next assignment, for now it will be a plain text password.). The email address will act as the username. Duplicate email accounts are not allowed. Accounts will have roles, but for now the role should be blank. Accounts will have 0 in savings and 0 in checking when the account is created. 

* Checks if a given email address / password pair matches one found in the data store. If so, returns a successful message, otherwise returns a failure message.

* Retrieves all user accounts. Also displays their role. Also their checkings and savings amounts. Does not display passwords. 

* Displays all information for one particular account associated with an email address. Do not show the password.

* Updates an account related to an email address one of the following three roles: customer, manager, administrator.

* Deposits money into the account related to an email address. The deposit must specify savings or checking. The money is given as an integer in total cents. For example, if a savings account has $3.01 in it and someone deposits $12.57, then the account stored 301, this API call accepts 1257, and backend adds the amount and stores 1558 for the savings value.

* Withdraws money from a checking or savings account related to an email address. The withdrawal cannot go below 0. If a request is made to withdraw more money than exists, do not compute anything. If the withdrawal is successful return a successful message. Otherwise return a failure message.

* Transfers money from checking/savings to the other checkings/savings within an account associated with an email address. Does not transfer to other user accounts. Like before, the transfer cannot exceed funds. If the withdrawal is successful return a successful message. Otherwise return a failure messages.

## Testing and Debugging:

User a RESTful API tool to help verify these routes. The lectures used RESTer. Postman is likely to be even more powerful for this assignment as it can better manage multiple API calls without having to retype often.

## Frontend:

No frontend is needed for this assignment. Though you are welcome to create one  unit testing purposes. This frontend would simply need various web forms and buttons to obtain the request, packages any queries as JSON objects, calls the backend route, and displays the result. It would definitely be good practice and help for later work.

## Future work:

This website is missing a React frontend and session tracking via cookies. They will come later.
