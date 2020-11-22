
```
                        Table "trades"
  Column  |         Type          | Description
----------+-----------------------+--------------------------------------------
 pair     | character varying(50) | Pair of currencies exchanged
 type     | character varying(50) | Close position (short/long)       
 quantity | integer               | Amount exchanged
 open     | double precision      | Value at which exchange was established
 close    | double precision      | Value at which exchange was executed
 pnl      | double precision      | Profit/Loss
 class    | character varying(50) | Type of exchange
 date     | date                  | Time of exchange          


                        Table "users"
  Column   |          Type          | Description
-----------+------------------------+------------------------------------------
 username  | character varying(260) | Account username
 salt      | character varying(260) | Salting for password
 hash      | character varying(260) | Hash of password + salt
 apikey    | character varying(260) | BitMEX Key cryptography
 apisecret | character varying(260) | BitMEX secret cryptography
 
 
                       Table "wallethistory"
    Column     |         Type          | Description
---------------+-----------------------+----------------------------------------
 date          | date                  | Status of wallet history at given time
 walletbalance | integer               | Amount of money in balance   
 amount        | integer               | Amount changed
 account       | character varying(50) | Account name

```

Division of Labor:

Eliezer created the register page linked in account page.

Kevin hooked up the main page charts to receive data from postgres via api requests and made an objective input skeleton.

Nicholas set up api to access bitmex wallet history, updated the postgress database, troubleshooted heroku bs.

All three (3) working together in Zoom meeting.
