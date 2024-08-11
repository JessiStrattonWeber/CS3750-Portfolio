const express = require("express");
 
const recordRoutes = express.Router();
 
const dbo = require("../db/conn");
 
 
// Retrieves all records but doesn't show the password 
recordRoutes.route("/record").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb("bank");
        //Get all results except don't show password 
        const result = await db_connect.collection("records").find({}, {projection : { password: 0 }}).toArray();
        res.json(result);
    } catch(err){
        res.json({ message: "There was an error retrieving user accounts." });
        throw err;
    }
});
 
// Create a new entry in the db 
recordRoutes.route("/record/add").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let email = req.body.email;

        //Check to see if there is already someone in the db with that email account. 
        let acountAlreadyExists = await db_connect.collection("records").findOne({ email: email });
        if (acountAlreadyExists) {
            return res.json({ 
                message: "Sorry but an account with the email already exists.",
                email :  req.body.email
            });
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
        res.json(result);
    } catch (err) {
        res.json({ message: "There was an unexpected error when adding a record." });
        throw err;
    }
});

// Display a specific record based on email. Do not show the password 
recordRoutes.route("/record/:email").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };

        const result = await db_connect.collection("records").findOne(myquery, {
            //Exclude the password from being displayed 
            projection: {password: 0}
        });

        //No results are found with that email address
        if(!result){
            res.json({ message: `Error displaying account: There is no account associated with the email: ${req.params.email}` });
            return;
        }

        res.json(result);
    } catch (err) {
        res.json({ message: "There was an error retrieving this account." });
        throw err;
    }
});

// Check to see if there is a user with this email and password pair
recordRoutes.route("/login/:email").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email, password: req.body.password };

        const result = await db_connect.collection("records").findOne(myquery)

        //No results are found with that email address
        if(!result){
            res.json({ message: `Error loging in: Incorrect password or there is no account associated with: ${req.params.email}` });
            return;
        }

        res.json(`Successful login.`);
    } catch (err) {
        res.json({ message: "There was an error retrieving this account." });
        throw err;
    }
});

//Updates the specific users role
recordRoutes.route("/update/:email").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };

        //Check to make sure that account exists 
        const account = await db_connect.collection("records").findOne(myquery);

        //Account not found 
        if(!account){
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
            role : req.body.role,
         });
    } catch (err) {
        res.json({ message: "Sorry but there was an error updating the role for this account." });
        throw err;
    }
});

//Deposits money into user account
recordRoutes.route("/deposit/:email").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let account_type = req.body.account;
        let amount = parseInt(req.body.amount);

        //Check account exists 
        const account = await db_connect.collection("records").findOne(myquery);
        if(!account){
            res.json({ message: `Error deposing money: There is no account associated with the email: ${req.params.email}` });
            return;
        }

        //Check negative or zero deposit 
        if( amount <= 0 ){
            res.json({ message: `-$${(amount/100) * -1 } is not a valid deposit. The amount must be positive.`});
            return;
        }

        //Check incorrect account type
        if (account_type != 'savings' && account_type != 'checking'){
            res.json({ message: `${account_type} is not a valid account type. Please select checking or savings.` });
            return;
        }
        
        //Get old balance and new balance 
        let current_balance = account[account_type];
        let new_balance = current_balance + amount;
        //Set values 
        let newvalues = {
            $set: {
                [account_type] : new_balance
            }
        };

        //Deposit Money
        db_connect.collection("records").updateOne(myquery, newvalues);
        res.json({
            message : `Money has been deposited into your ${account_type} account:`,
            amount_deposited: `$${amount/100}`,
            starting_balance: `$${current_balance/100}`,
            ending_balance: `$${new_balance/100}`,
        });
    } catch (err) {
        res.json({ message: "Sorry but there was an error depositing money into this account." });
        throw err;
    }
});

// Withdraws money from a users account 
recordRoutes.route("/withdraw/:email").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let account_type = req.body.account;
        let amount = parseInt(req.body.amount);

        //Check account exists 
        const account = await db_connect.collection("records").findOne(myquery);
        if(!account){
            res.json({ message: `Error withdrawing: There is no account associated with the email: ${req.params.email}` });
            return;
        }

        //Check negative or zero deposit 
        if( amount <= 0 ){
            res.json({ message: `-$${(amount/100) * -1 }  is not a valid withdraw. The amount must be positive.`});
            return;
        }

        //Check incorrect account type
        if (account_type != 'savings' && account_type != 'checking'){
            res.json({ message: `${account_type} is not a valid account type. Please select checking or savings.` });
            return;
        }
        
        //Get old balance and new balance 
        let current_balance = account[account_type];
        let new_balance = current_balance - amount;

        //Check for overdraft 
        if(new_balance < 0) {
            res.json({ 
                message: `Can not withdraw $${amount/100} from your ${account_type} acount.`,
                account_balance: `$${current_balance/100}`,
                overdraft_amount: `$${new_balance/100}`
            });
            return;
        }

        //Set values 
        let newvalues = {
            $set: {
                [account_type] : new_balance
            }
        };

        //Deposit Money
        db_connect.collection("records").updateOne(myquery, newvalues);
        res.json({
            message : `Money has been withdrawn from your ${account_type} account:`,
            amount_withdrawn: `$${amount/100}`,
            starting_balance: `$${current_balance/100}`,
            ending_balance: `$${new_balance/100}`,
        });
    } catch (err) {
        res.json({ message: "Sorry but there was an error withdrawing money from this account." });
        throw err;
    }
});

//Transfers money between users accounts 
recordRoutes.route("/transfer/:email").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let transfer_from = req.body.account;
        let amount = parseInt(req.body.amount);
        let transfer_to = '';

        //Check account exists 
        const account = await db_connect.collection("records").findOne(myquery);
        if(!account){
            res.json({ message: `Error with transfer: There is no account associated with the email: ${req.params.email}` });
            return;
        }

        //Check negative or zero deposit 
        if( amount <= 0 ){
            res.json({ message: `-$${(amount/100) * -1 }  is not a valid transfer. The amount must be positive.`});
            return;
        }

        //Check incorrect account type
        if (transfer_from == 'savings'){
            transfer_to = 'checking'
        }
        else if(transfer_from == 'checking') {
            transfer_to = 'savings'
        }
        else {
            res.json({ message: `${account_type} is not a valid account type. Please select checking or savings.` });
            return;
        }

        //Get old balance and new balance 
        let from_start_balance = account[transfer_from];
        let to_start_balance = account[transfer_to];

        let from_new_balance = from_start_balance - amount
        let to_new_balance = to_start_balance + amount

        //Check for overdraft 
        if(from_new_balance < 0) {
            res.json({ 
                message: `Can not transfer $${amount/100} out of your ${transfer_from} account.`,
                account_balance: `$${from_start_balance/100}`,
                overdraft_amount: `$${from_new_balance/100}`
            });
            return;
        }

        //Set values 
        let newvalues = {
            $set: {
                [transfer_from] : from_new_balance,
                [transfer_to] : to_new_balance,
            }
        };

        //Deposit Money
        db_connect.collection("records").updateOne(myquery, newvalues);
        res.json({
            message : `$${amount/100} has been transfered from your ${transfer_from} account to your ${transfer_to} account:`
        });
    } catch (err) {
        res.json({ message: "Sorry but there was an error transfering money in this account." });
        throw err;
    }
});
 
module.exports = recordRoutes;