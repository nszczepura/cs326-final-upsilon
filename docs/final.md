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


## URL Routes/Mappings


