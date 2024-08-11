const express = require("express");

const recordRoutes = express.Router();

const dbo = require("../db/conn");


// Retrieves all records but doesn't show the password 
recordRoutes.route("/record").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb("bank");
        //Get all results except don't show password 
        const result = await db_connect.collection("records").find({}, { projection: { password: 0 } }).toArray();
        res.json(result);
    } catch (err) {
        res.json({ message: "There was an error retrieving user accounts." });
        throw err;
    }
});

// Create a new entry in the db 
recordRoutes.route("/record/add").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let email = req.body.email;

        //Check to see if there is already someone in the db with that email account. 
        let acountAlreadyExists = await db_connect.collection("records").findOne({ email: email });
        if (acountAlreadyExists) {
            return res.status(401).json({
                message: "Sorry but an account with the email already exists.",
                email: req.body.email
            });
        }

        if(!req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name){
            res.status(401).json({ message: "You are missing required paramaters. Account can not be made." });
            return;
        }

        //Make object with passed params and defaults 
        let myobj = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            role: '',
            checking: 0,
            savings: 0,
        };

        //Insert record 
        const result = await db_connect.collection("records").insertOne(myobj)
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "There was an unexpected error when adding a record." });
        throw err;
    }
});
// Display a specific record based on email. Do not show the password 
recordRoutes.route("/record/:email").get(async (req, res) => {
    try {
        const db_connect = dbo.getDb();
        const myquery = { email: req.params.email };

        const result = await db_connect.collection("records").findOne(myquery, {
            // Exclude sensitive information (e.g., password) from being displayed 
            projection: { password: 0 }
        });

        if (!result) {
            return res.status(404).json({ message: `No record found for email: ${req.params.email}` });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Updates the specific users role
recordRoutes.route("/update/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };

        //Check to make sure that account exists 
        const account = await db_connect.collection("records").findOne(myquery);

        //Account not found 
        if (!account) {
            res.json({ message: `Error updating role: There is no account associated with the email: ${req.params.email}` });
            return;
        }

        //Get the new role value
        let newvalues = {
            $set: {
                role: req.body.role,
            },
        };
        //Update the role
        db_connect.collection("records").updateOne(myquery, newvalues);
        res.json({
            message: `Account for ${req.params.email} has been updated.`,
            role: req.body.role,
        });
    } catch (err) {
        res.json({ message: "Sorry but there was an error updating the role for this account." });
        throw err;
    }
});

//Deposits money into user account
recordRoutes.route("/deposit").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.session.email };
        let account_type = req.body.account;
        let amount = parseInt(req.body.amount);

        //Check account exists 
        const account = await db_connect.collection("records").findOne(myquery);
        if (!account) {
            res.status(401).json({ message: `Error deposing money: There is no account associated with the email: ${req.session.email}` });
            return;
        }

        //Check negative or zero deposit 
        if (amount <= 0) {
            res.status(401).json({ message: `-$${(amount / 100) * -1} is not a valid deposit. The amount must be positive.` });
            return;
        }

        //Check incorrect account type
        if (account_type != 'savings' && account_type != 'checking') {
            res.status(401).json({ message: `${account_type} is not a valid account type. Please select checking or savings.` });
            return;
        }

        //Get old balance and new balance 
        let current_balance = account[account_type];
        let new_balance = current_balance + amount;
        //Set values 
        let newvalues = {
            $set: {
                [account_type]: new_balance
            }
        };

        //Deposit Money
        db_connect.collection("records").updateOne(myquery, newvalues);
        res.status(200).json({
            message: `Money has been deposited into your ${account_type} account:`,
            amount_deposited: `$${amount / 100}`,
            starting_balance: `$${current_balance / 100}`,
            ending_balance: `$${new_balance / 100}`,
        });
    } catch (err) {
        res.status(500).json({ message: "Sorry but there was an error depositing money into this account." });
        throw err;
    }
});

// Withdraws money from a users account 
recordRoutes.route("/withdraw").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.session.email };
        let account_type = req.body.account;
        let amount = parseInt(req.body.amount);

        //Check account exists 
        const account = await db_connect.collection("records").findOne(myquery);
        if (!account) {
            res.json({ message: `Error withdrawing: There is no account associated with the email: ${req.session.email}` });
            return;
        }

        //Check negative or zero deposit 
        if (amount <= 0) {
            res.status(401).json({ message: `-$${(amount / 100) * -1}  is not a valid withdraw. The amount must be positive.` });
            return;
        }

        //Check incorrect account type
        if (account_type != 'savings' && account_type != 'checking') {
            res.status(401).json({ message: `${account_type} is not a valid account type. Please select checking or savings.` });
            return;
        }

        //Get old balance and new balance 
        let current_balance = account[account_type];
        let new_balance = current_balance - amount;

        //Check for overdraft 
        if (new_balance < 0) {
            res.status(401).json({
                message: `Can not withdraw $${amount / 100} from your ${account_type} acount.`,
                account_balance: `$${current_balance / 100}`,
                overdraft_amount: `$${new_balance / 100}`
            });
            return;
        }

        //Set values 
        let newvalues = {
            $set: {
                [account_type]: new_balance
            }
        };

        //Deposit Money
        db_connect.collection("records").updateOne(myquery, newvalues);
        res.status(200).json({
            message: `Money has been withdrawn from your ${account_type} account:`,
            amount_withdrawn: `$${amount / 100}`,
            starting_balance: `$${current_balance / 100}`,
            ending_balance: `$${new_balance / 100}`,
        });
    } catch (err) {
        res.status(500).json({ message: "Sorry but there was an error withdrawing money from this account." });
        throw err;
    }
});

//Transfers money between users accounts 
recordRoutes.route("/transfer/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let transfer_from = req.body.account;
        let amount = parseInt(req.body.amount);
        let transfer_to = '';

        //Check account exists 
        const account = await db_connect.collection("records").findOne(myquery);
        if (!account) {
            res.status(401).json({ message: `Error with transfer: There is no account associated with the email: ${req.params.email}` });
            return;
        }

        //Check negative or zero deposit 
        if (amount <= 0) {
            res.status(500).json({ message: `-$${(amount / 100) * -1}  is not a valid transfer. The amount must be positive.` });
            return;
        }

        //Check incorrect account type
        if (transfer_from == 'savings') {
            transfer_to = 'checking'
        }
        else if (transfer_from == 'checking') {
            transfer_to = 'savings'
        }
        else {
            res.status(500).json({ message: `${account_type} is not a valid account type. Please select checking or savings.` });
            return;
        }

        //Get old balance and new balance 
        let from_start_balance = account[transfer_from];
        let to_start_balance = account[transfer_to];

        let from_new_balance = from_start_balance - amount
        let to_new_balance = to_start_balance + amount

        //Check for overdraft 
        if (from_new_balance < 0) {
            res.status(401).json({
                message: `Can not transfer $${amount / 100} out of your ${transfer_from} account.`,
                account_balance: `$${from_start_balance / 100}`,
                overdraft_amount: `$${from_new_balance / 100}`
            });
            return;
        }

        //Set values 
        let newvalues = {
            $set: {
                [transfer_from]: from_new_balance,
                [transfer_to]: to_new_balance,
            }
        };

        //Deposit Money
        db_connect.collection("records").updateOne(myquery, newvalues);
        res.status(200).json({
            message: `$${amount / 100} has been transfered from your ${transfer_from} account to your ${transfer_to} account:`
        });
    } catch (err) {
        res.status(500).json({ message: "Sorry but there was an error transfering money in this account." });
        throw err;
    }
});

//*************************************************************************************************************************************************** */

recordRoutes.route("/login/:email").post(async (req, res) => {

    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email, password: req.body.password };

        const result = await db_connect.collection("records").findOne(myquery)

        //No results are found with that email address
        if (!result) {
            res.status(401).json({ message: `Error logging in: Incorrect password or there is no account associated with: ${req.params.email}` });
            return;
        }

        req.session.email = req.params.email;

        console.log('In /login, sessions is: ' + JSON.stringify(req.session));

        res.status(200).json({ message: 'Successful login' });
    } catch (err) {
        res.status(500).json({ message: "There was an error retrieving this account." });
        throw err;
    }
});


recordRoutes.route('/logout').get(async function (req, res) {
    console.log('In /logout, sessions is: ' + JSON.stringify(req.session));
    req.session.destroy();

    const resultObj = { message: 'Logged Out' };
    res.json(resultObj);
});

recordRoutes.route('/session_get').get(async function (req, res) {
    console.log('In /session_get, sessions is: ' + JSON.stringify(req.session));

    if (!req.session.email) {
        message = 'Not logged in';
    } else {
        message = ('Session email is: ' + req.session.email);
    }

    const resultObj = { message: message };
    res.json(resultObj);
});


// Display a specific record based on email. Do not show the password 
recordRoutes.route("/summary").get(async (req, res) => {
    if (!req.session.email) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    try {
        const db_connect = dbo.getDb();
        const myquery = { email: req.session.email };

        const result = await db_connect.collection("records").findOne(myquery, {
            projection: { password: 0 }
        });

        if (!result) {
            return res.status(404).json({ message: `No record found for email: ${req.session.email}` });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Display a specific record based on email. Do not show the password 
recordRoutes.route("/balance").get(async (req, res) => {
    if (!req.session.email) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    try {
        const db_connect = dbo.getDb();
        const myquery = { email: req.session.email };

        const result = await db_connect.collection("records").findOne(myquery, {
            projection: { password: 0 }
        });

        if (!result) {
            return res.status(404).json({ message: `No record found for email: ${req.session.email}` });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = recordRoutes;