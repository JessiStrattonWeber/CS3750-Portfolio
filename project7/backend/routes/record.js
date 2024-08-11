const express = require("express");

const recordRoutes = express.Router();

const dbo = require("../db/conn");

const crypto = require('crypto');

const ObjectId = require('mongodb').ObjectId;

//Password hash function 
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

//Adds a 0 to the front of minute values less than 10. EX: 8 converts to - 08
function formatMinutes(time) {
    let formattedTime = "0";
    if(time < 10) {
        formattedTime += time.toString();
    }
    else {
        formattedTime = time.toString();
    }
    return formattedTime;
}

function formatTime(hour, formattedMinute) {
    let formattedTime = "";
    if(hour === 0) {
        formattedTime = "12:" + formattedMinute + " AM";
    }
    else if(hour < 12) {
        formattedTime = hour.toString() + ":" + formattedMinute + " AM";
    }
    else if(hour === 12) {
        formattedTime = "12:" + formattedMinute + " PM";
    }
    else if(hour > 12) {
        formattedTime = (hour - 12).toString() + ":" + formattedMinute + " PM";
    }
    return formattedTime;
}


/*********************************************************************
 *                          GET ALL RECORDS
**********************************************************************/
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

/*********************************************************************
 *                          CREATE NEW RECORD 
**********************************************************************/
recordRoutes.route("/record/add").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let email = req.body.email;

        // Check if an account with the same email already exists
        let accountAlreadyExists = await db_connect.collection("records").findOne({ email: email });
        if (accountAlreadyExists) {
            return res.status(401).json({
                message: "Sorry but an account with the email already exists.",
                email: req.body.email
            });
        }

        if (!req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name) {
            res.status(401).json({ message: "You are missing required parameters. Account cannot be created." });
            return;
        }

        // Generate a unique account ID
        let generatedID;
        let idAlreadyTaken = true;
        while (idAlreadyTaken) {
            generatedID = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6 digit number
            let checkIDTaken = await db_connect.collection("records").findOne({ id: generatedID });
            if (!checkIDTaken) {
                idAlreadyTaken = false;
            }
        }

        // Hash the password
        let hashedPassword = hashPassword(req.body.password);

        // Create the user object
        let myobj = {
            id: parseInt(generatedID),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            role: req.body.role,
            checking: 0,
            investment: 0,
            savings: 0,
        };

        // Insert the new user record
        const result = await db_connect.collection("records").insertOne(myobj);
        res.status(200).json({ id: generatedID });
    } catch (err) {
        res.status(500).json({ message: "There was an unexpected error when adding a record." });
        throw err;
    }
});
/*********************************************************************
 *                            DEPOSIT
**********************************************************************/
//Deposits money into user account
recordRoutes.route("/deposit").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery;

        // Employee/Admin request
        if (req.body.id && (req.session.role === 'admin' || req.session.role === 'employee')) {
            myquery = { id: parseInt(req.body.id) };
        } else {
            // Customer request
            myquery = { email: req.session.email };
        }

        let account_type = req.body.account;
        let amount = parseInt(req.body.amount);

        //Check account exists 
        const account = await db_connect.collection("records").findOne(myquery);
        if (!account) {
            res.status(401).json({ message: `Error depositing money: No account found for the provided ID or email.` });
            return;
        }

        //Check negative or zero deposit 
        if (amount <= 0) {
            res.status(401).json({ message: `-$${(amount / 100) * -1} is not a valid deposit. The amount must be positive.` });
            return;
        }

        //Check incorrect account type
        if (account_type !== 'savings' && account_type !== 'checking' && account_type !== 'investment') {
            res.status(401).json({ message: `${account_type} is not a valid account type. Please select checking, savings, or investment.` });
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
        let myDate = new Date();
        let myMinutes = formatMinutes(myDate.getMinutes());
        let myTime = formatTime(myDate.getHours(), myMinutes);
        console.log(myTime);
        let historyObj = {
            from_account_id: 0,
            to_account_id: account.id,
            from_account_type: "",
            to_account_type: account_type,
            date: myDate.toDateString(),
            sortingdate: new Date(),
            time: myTime,
            transaction_type: "deposit",
            amount: amount
        };

        db_connect.collection("history").insertOne(historyObj);

    } catch (err) {
        res.status(500).json({ message: "Sorry but there was an error depositing money into this account." });
        throw err;
    }
});

/*********************************************************************
 *                            WITHDRAW
**********************************************************************/
// Withdraws money from a user's account 
recordRoutes.route("/withdraw").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery;

        // Employee/Admin request
        if (req.body.id && (req.session.role === 'admin' || req.session.role === 'employee')) {
            myquery = { id: parseInt(req.body.id) };
        } else {
            // Customer request
            myquery = { email: req.session.email };
        }

        let account_type = req.body.account;
        let amount = parseInt(req.body.amount);

        //Check account exists 
        const account = await db_connect.collection("records").findOne(myquery);
        if (!account) {
            res.status(401).json({ message: `Error withdrawing: No account found.` });
            return;
        }

        //Check negative or zero withdraw 
        if (amount <= 0) {
            res.status(401).json({ message: `-$${(amount / 100) * -1}  is not a valid withdraw. The amount must be positive.` });
            return;
        }

        //Check incorrect account type
        if (account_type !== 'savings' && account_type !== 'checking' && account_type !== 'investment') {
            res.status(401).json({ message: `${account_type} is not a valid account type. Please select checking or savings.` });
            return;
        }

        //Get old balance and new balance 
        let current_balance = account[account_type];
        let new_balance = current_balance - amount;

        //Check for overdraft 
        if (new_balance < 0) {
            res.status(401).json({
                message: `Cannot withdraw $${amount / 100} from your ${account_type} account.`,
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

        //Withdraw Money
        db_connect.collection("records").updateOne(myquery, newvalues);
        res.status(200).json({
            message: `Money has been withdrawn from your ${account_type} account:`,
            amount_withdrawn: `$${amount / 100}`,
            starting_balance: `$${current_balance / 100}`,
            ending_balance: `$${new_balance / 100}`,
        });

        let myDate = new Date();
        let myMinutes = formatMinutes(myDate.getMinutes());
        let myTime = formatTime(myDate.getHours(), myMinutes);

        let historyObj = {
            from_account_id: account.id,
            to_account_id: 0,
            from_account_type: account_type,
            to_account_type: "",
            date: myDate.toDateString(),
            sortingdate: new Date(),
            time: myTime,
            transaction_type: "withdraw",
            amount: amount
        };

        db_connect.collection("history").insertOne(historyObj);

    } catch (err) {
        res.status(500).json({ message: "Sorry but there was an error withdrawing money from this account." });
        throw err;
    }
});

/*********************************************************************
 *                            TRANSFER 
**********************************************************************/
//Transfers money between users accounts.

// PROBABLY DOESN'T WORK YET !!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

recordRoutes.route("/transfer").post(async (req, res) => {
    try {
        let fromAccountNewBalance;
        let toAccountNewBalance;
        let db_connect = dbo.getDb();

        // Extract details from the request body
        const { account_from, from_account_id, accountid_to, account_to, amount } = req.body;
        if (!account_from || !accountid_to || !account_to || !amount) {
            return res.status(400).json({ message: "Invalid data" });
        }

        // Parse the amount to a number
        const amountToTransfer = parseFloat(amount);
        if (isNaN(amountToTransfer) || amountToTransfer <= 0) {
            return res.status(400).json({ message: "Invalid transfer amount" });
        }

        // Employee transactions will pass an ID
        let myquery;
        if (from_account_id && (req.session.role === 'admin' || req.session.role === 'employee')) {
            myquery = { id: parseInt(from_account_id) };
        } else {
            // Regular customer transaction 
            myquery = { email: req.session.email };
        }

        // Find the right account. 
        const accountFrom = await db_connect.collection("records").findOne(myquery);
        if (!accountFrom) {
            return res.status(404).json({ message: "Source account not found" });
        }

        // Find the recipient account by ID
        const accountTo = await db_connect.collection("records").findOne({ id: parseInt(accountid_to) });
        if (!accountTo) {
            return res.status(404).json({ message: "Recipient account not found" });
        }

        // Perform the transfer based on the account type
        switch (account_from) {
            case 'savings':
                if (amountToTransfer > accountFrom.savings) {
                    return res.status(400).json({ message: "Insufficient funds in savings account." });
                }
                fromAccountNewBalance = accountFrom.savings - amountToTransfer;
                break;
            case 'checking':
                if (amountToTransfer > accountFrom.checking) {
                    return res.status(400).json({ message: "Insufficient funds in checking account." });
                }
                fromAccountNewBalance = accountFrom.checking - amountToTransfer;
                break;
            case 'investment':
                if (amountToTransfer > accountFrom.investment) {
                    return res.status(400).json({ message: "Insufficient funds in investment account." });
                }
                fromAccountNewBalance = accountFrom.investment - amountToTransfer;
                break;
            default:
                return res.status(400).json({ message: "Invalid account type" });
        }

        // Update the recipient account's balance based on the account type
        switch (account_to) {
            case 'checking':
                toAccountNewBalance = accountTo.checking + amountToTransfer;
                break;
            case 'savings':
                toAccountNewBalance = accountTo.savings + amountToTransfer;
                break;
            case 'investment':
                toAccountNewBalance = accountTo.investment + amountToTransfer;
                break;
            default:
                return res.status(400).json({ message: "Invalid recipient account type" });
        }

        // Update the balances in the database
        const updateFromAccount = {};
        updateFromAccount[account_from] = fromAccountNewBalance;

        const updateToAccount = {};
        updateToAccount[account_to] = toAccountNewBalance;

        await db_connect.collection("records").updateOne(
            { id: accountFrom.id }, // Use the correct source account ID
            { $set: updateFromAccount }
        );

        await db_connect.collection("records").updateOne(
            { id: parseInt(accountid_to) },
            { $set: updateToAccount }
        );

        let myDate = new Date();
        let myMinutes = formatMinutes(myDate.getMinutes());
        let myTime = formatTime(myDate.getHours(), myMinutes);

        // Store the transaction record in the database
        const transactionRecord = {
            from_account_id: accountFrom.id,
            to_account_id: parseInt(accountid_to),
            from_account_type: account_from,
            to_account_type: account_to,
            date: myDate.toDateString(),
            sortingdate: new Date(),
            time: myTime,
            transaction_type: 'transfer',
            amount: amountToTransfer
        };

        await db_connect.collection("history").insertOne(transactionRecord);

        res.status(200).json({ message: "Transfer successful" });
    } catch (error) {
        console.error("Error processing transfer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
/*********************************************************************
 *                            LOGIN 
**********************************************************************/
recordRoutes.route("/login").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let hashedPassword = hashPassword(req.body.password);
        let myquery = { email: req.body.email, password: hashedPassword };

        const result = await db_connect.collection("records").findOne(myquery);

        // No results are found with that email address or password
        if (!result) {
            res.status(401).json({ message: "The username and/or password was not entered in correctly" });
            return;
        }

        req.session.email = req.body.email;
        req.session.role = result.role;

        console.log('In /login, sessions is: ' + JSON.stringify(req.session));

        res.status(200).json({ message: 'Successful login', role: result.role });
    } catch (err) {
        res.status(500).json({ message: "There was an error retrieving this account." });
        throw err;
    }
});


/*********************************************************************
 *                            LOGOUT
**********************************************************************/
recordRoutes.route('/logout').get(async function (req, res) {
    console.log('In /logout, sessions is: ' + JSON.stringify(req.session));
    req.session.destroy();

    const resultObj = { message: 'Logged Out' };
    res.json(resultObj);
});

/*********************************************************************
 *                           ACCOUNT SUMMARY
**********************************************************************/
// Return account summary informaiton 
recordRoutes.route("/summary").post(async (req, res) => {
    if (!req.session.email) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    const db_connect = dbo.getDb();
    let myquery;

    //Employee query with an ID
    if (req.body.id && (req.session.role === 'admin' || req.session.role === 'employee')) {
        myquery = { id: parseInt(req.body.id) };
    } else {
        //Default customer query. Using the session 
        myquery = { email: req.session.email };
    }

    try {
        const result = await db_connect.collection("records").findOne(myquery, {
            projection: { password: 0 }
        });

        if (!result) {
            return res.status(404).json({ message: `No record found` });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

/*********************************************************************
 *                           ACCOUNT BALANCE 
**********************************************************************/
// Return account balance informaiton 
recordRoutes.route("/balance").post(async (req, res) => {
    if (!req.session.email) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    try {
        const db_connect = dbo.getDb();

        let myquery;

        //Employee query 
        if (req.body.id && (req.session.role === 'admin' || req.session.role === 'employee')) {
            myquery = { id: parseInt(req.body.id) };
        } else {
            //defualt customer query 
            myquery = { email: req.session.email };
        }

        const result = await db_connect.collection("records").findOne(myquery, {
            projection: { password: 0 }
        });

        if (!result) {
            return res.status(404).json({ message: `No record found` });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

/*********************************************************************
 *                        ACCOUNT ID LOOKUP 
**********************************************************************/
// Return account information using an account ID 
recordRoutes.route("/lookup").post(async (req, res) => {
    if (!req.session.email) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    try {
        const db_connect = dbo.getDb();

        const userRole = req.session.role;
        if (userRole !== 'admin' && userRole !== 'employee') {
            return res.status(401).json({ message: 'You are not authorized to perform this action' });
        }

        const myquery = { id: parseInt(req.body.id) };

        const result = await db_connect.collection("records").findOne(myquery, {
            projection: { password: 0 }
        });

        if (!result) {
            return res.status(404).json({ message: `No record found for id: ${req.body.id}` });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

/*********************************************************************
 *                           EDIT A RECORD 
**********************************************************************/


recordRoutes.route("/record/update/:id").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb("bank");
        const myquery = { id: parseInt(req.params.id) };

        // Fields to be updated
        let newValues = {
            $set: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                phone: req.body.phone,
                role: req.body.role,
            }
        };

        const result = await db_connect.collection("records").updateOne(myquery, newValues);

        res.status(200).json({ message: "Account updated successfully", result });
    } catch (err) {
        res.status(500).json({ message: "Error updating account" });
        throw err;
    }
});


/*********************************************************************
 *                           GET ACCOUNT HISTORY
**********************************************************************/

recordRoutes.route("/account-history").post(async (req, res) => {
    try {
        const db_connect = dbo.getDb();
        let myquery;

        // Employee/Admin request
        if (req.body.id && (req.session.role === 'admin' || req.session.role === 'employee')) {
            myquery = { id: parseInt(req.body.id) };
        } else {
            // Customer request
            myquery = { email: req.session.email };
        }

        const idResult = await db_connect.collection("records").findOne(myquery);

        if (!idResult) {
            return res.status(404).json({ message: `No record found for the provided ID or email` });
        }

        const accountQuery = {
            $or: [{ from_account_id: idResult.id }, { to_account_id: idResult.id }]
        };
        const accountResult = await db_connect.collection("history").find(accountQuery).sort({sortingdate: -1}).toArray();
        res.status(200).json(accountResult);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

/*********************************************************************
 *                           GET FULL HISTORY
**********************************************************************/
//Return all records in the transactions history
recordRoutes.route('/full-history').get(async (req, res) => {
    try {
        const db_connect = dbo.getDb();
        const result = await db_connect.collection('history').find({}).sort({sortingdate: -1}).toArray();
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/*********************************************************************
 *                      Grab a Record via ID
**********************************************************************/
  // Fetch a single record by id
  recordRoutes.route("/record/:id").get(async (req, res) => {
      try {
          let db_connect = dbo.getDb();
          const myquery = { id: parseInt(req.params.id) };

          const result = await db_connect.collection("records").findOne(myquery, { projection: { password: 0 } });  
  
          if (result) {
              res.json(result);
          } else {
              res.status(404).json({ message: "Record not found" });
          }
      } catch (err) {
          res.status(500).json({ message: "Error retrieving record", error: err });
          console.error("Error retrieving record:", err);
      }
  });

  recordRoutes.get('/testing', (req, res) => {
    res.status(200).json({ message: 'Passed test' });
  });
  
  
  module.exports = recordRoutes;
  

module.exports = recordRoutes;