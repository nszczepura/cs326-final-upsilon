# Upsilon
## Edgetrack

Find Your Edge

## Semester

Fall 2020

## Overview
Edgetrack is a web application that allows active traders to easily track track there performance. Users are able to take a csv file from their exchange and upload it to get a a breakdown of their trading. Edgetrack is innovative because it offers a convenient way for a user to gain insights on their training in a free online package.

## Team Members

Nicholas Szczepura - nszczepura

Kevin Sanchez - knsanchez0001

Eliezer Encarnacion - eliel15000

## User Interface
Home -
Portfolio vs Objective chart

Bar charts
W/L , 
Total $ Gain/Loss, and 
Best vs. Worst performer



In depth-statistics breakdown

Objective settings for performance comparison

![Home Page](./finalhome.png)

Trades -
Table of trade history uploaded by user

![Trade History](./finaltrades.png)

Notes - 
A place to write comments for the trading week/month, allows users to download a txt file with their stats and comments for archiving.


![Notes Page](./finalnotes.png)

Account - 
Log in and register to upload your history and see your stats

![Account Page](./finalaccount.png)
![Register Page](./finalregister.png)
![Login Page](./finallogin.png)

## APIs

POST /account - Inputs username and password for login verification

POST /uploadcsv - uploads csv data to the database

GET /account - Renders account.html page

GET /logout - Logs out of account, redirects to account page

POST /register - Inputs username and passowrd for registration

GET /register - Renders register.html page

GET /private - If logged in, redirects to private page given user ID (calls the request below)

GET /private/:userID/ - Redirects to the private page with the user ID (given the request above)

GET /walletHistory - Retrieves the raw data from the database

GET /winLoss - Calls a function that uses an SQL query to return the ratio of the number profits and losses

GET /gainsLosses - Calls a function that uses an SQL query to return the comparison of the sum of profits and losses

GET /avgGainLoss - Calls a function that uses an SQL query to return the comparison of average profit and average loss

GET /bestGainWorstLoss - Calls a function that uses an SQL query to return the comparison of the best profit and worst loss

GET /largestPercentWinner - Calls a function that uses an SQL query to return the largest profit relative to the balance at the time

GET /largestPercentLoser - Calls a function that uses an SQL query to return the largest loss relative to the balance at the time 

GET /largetsDollarWinner - Calls a function that uses an SQL query to return the largest profit

GET /largestDollarLoser - Calls a function that uses an SQL query to return the largest loss

GET /sumFeesPaid - Calls a function that uses an SQL query to return the sum of paid fees

GET /avgWinner - Calls a function that uses an SQL query to return the average profit

GET /avgLoser - Calls a function that uses an SQL query to return the average loss

GET /totalPNL - Calls a function that uses an SQL query to return the net profit/loss 


## Database
```
                                          Table "wallethistory"
     Column     |         Type          | Description
----------------+-----------------------+------------------------------------------------------------------
 transacttime   | date                  | Date of transaction
 transacttype   | character varying(50) | Type of transaction
 amount         | numeric(20,2)         | Amount change for transaction
 fee            | numeric(20,2)         | Fee for transaction
 address        | character varying(50) | Pair of currencies exchanged
 transactstatus | character varying(50) | Status of transaction
 walletbalance  | numeric(20,2)         | Balance as the of the date
 walletid       | character varying(50) | Username/ID for the wallet
 ```
 
 ```
                                            Table "users"
  Column  |          Type          | Description
----------+------------------------+-------------------------------------------------------------------
 username | character varying(50)  | Username of account
 salt     | character varying(32)  | Unique salt of account
 hash     | character varying(128) | Hashed password of account
 ```
## URL Routes/Mappings

/(index.html) - Home page

/trades.html - Trades page

/notes.html - Notes page

/account.html - Account page

/register.html - Registration page

/account_private.html - Account page after login

/account - Relates to retrieving and posting information on the account.html page

/uploadcsv - Used uploading csv to database

/logout - Used for loggin out

/register - Relates to retrieving and posting information on the register.html page

/private - Relates to user authentication

/private/:userID/ - Relates to user authentication

/walletHistory - Retrieves sql data

/winLoss - Retrieves sql data

/gainsLosses - Retrieves sql data

/avgGainLoss - Retrieves sql data

/bestGainWorstLoss - Retrieves sql data

/largestPercentWinner - Retrieves sql data

/largestPercentLoser - Retrieves sql data

/largetsDollarWinner - Retrieves sql data

/largestDollarLoser - Retrieves sql data

/sumFeesPaid - Retrieves sql data

/avgWinner - Retrieves sql data

/avgLoser - Retrieves sql data

/totalPNL - Retrieves sql data

## Authentication/Authorization
Users are authenticated cryptographically; passwords with a salt will be checked against hashes in the database.
Username registration will be checked against the database as well to avoid duplicate usernames.
This relates to the UI in the account and registration page.


## Division of Labor

Nicholas Szczepura 
- Created wireframes
- Started up the server 
- Set up api to access bitmex wallet history (deprecated due to api failure thanks to bitmex), updated the postgress database, troubleshooted heroku bs.
- Continued to chug along with heroku s***
- Added a private account page that can be used to upload csv files (bitmex just had to crap out on the last moment)
- Modified Home page to load objective and csv data to a Objective chart
- Connected login and registration to authentication processes
- Bug fixes

Kevin Sanchez
- Started HTML/CSS skeleton for Home page and Notes page
- Worked on front end for Account and Notes
- Hooked up the main page charts to receive data from postgres via api requests and made an objective input skeleton (made endpoints).
- Made more endpoints for statistics
- Bug fixes

Eliezer Encarnacion
- Started HTML/CSS skeleton for Trades page and Account page
- Worked on front end for Home and Trade History
- Created the register page linked to account page.
- Bug fixes

## Conclusion

We've learned about new levels of pain in regards to troubleshooting. We've also gained experience in how to progressively build up a website, from the initial wirerframes, to basic front end with bootstrap, server setup, database management, and api endpoint implementations. Most of our difficulties lie in tying up the client with the server, truggling to work with git version control (branches failing to be up to date with latest commits, having suddenly broken code pushed), occasional reminders of having to make certain functions asychronous when necessary, handling promise rejections, and working with Heroku.  

