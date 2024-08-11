# Project 4: MERN and Sessions

## Goal:

To implement all four pieces of MERN in one functioning project. Also use sessions to track a user across pages in preparation for later assignments.

## Assignment overview:

In a previous assignment, you created a handful of backend routes. Create a set of React frontend pages and components. Use those backend routes to make the website functional.

## Backend:

* Add session tracking information for the two routes handling registration and login.
    - A smart approach here would be to store just the user's id in a req.session.id field. That way you can simply refer to that id throughout other pages.
* Also add a logout route which destroys the session.

## Frontend:

* An account registration page that accepts a new account profile with a first name, last name, email address, phone number, and password. The email address will act as the username. Duplicate email accounts are not allowed. Accounts will have roles, but for now the role should be blank. Accounts will have 0 in savings and 0 in checking when the account is created.
    - If the registration is successful, move to a page which displays an account summary
    - If the registration is not successful, inform the user why
* A login page for existing accounts. The user will enter an email address and a password. The password will stay plaintext. (In production environments, this login page would be protected with a certificate and likely the password hashed in the database.)
    - If the email and password matches the backend, the user is logged in and goes to the account summary pages
    - If the login is not successful, inform the user why
* A logout page.

Note that in both prior pages, once the user is registered or logs in, the backend will set a session variable indicating they are logged in, and also tracks more information about the user.

* An account summary page which displays first name, last name, email, phone number.
    - All this information is retrieved in the backend according to info found in the session object.
    - If a user attempts to view this page and isn't logged in (i.e. doesn't have session info in the backend), redirect the user to the login page.
* A separate page which 1. shows account balances, and also 2. allows the user to deposit or withdraw money from savings or checking. Keep this proof-of-concept for now. If the user wants to deposit a million dollars, let the user do so. But a user can't withdraw beyond $0. Upon a successful action, navigate the user back to the account summary page.
    - All this information is retrieved in the backend according to info found in the session object.
    - If a user attempts to view this page and isn't logged in (i.e. doesn't have session info in the backend), redirect the user to the login page.

## You must:

* Store session info/cookies in the Mongo Database, and not to memory or a plain text file
* Use RESTful API to have the frontend talk to the backend.