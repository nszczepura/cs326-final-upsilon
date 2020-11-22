
```
                        Table "public.trades"
  Column  |         Type          | Description
----------+-----------------------+-----------------------------
 pair     | character varying(50) |          
 type     | character varying(50) |          
 quantity | integer               |        
 open     | double precision      |         
 close    | double precision      |
 pnl      | double precision      |         
 class    | character varying(50) |        
 date     | date                  |           


                        Table "public.users"
  Column   |          Type          | Description
-----------+------------------------+-----------------------------
 username  | character varying(260) |                   
 salt      | character varying(260) |               
 hash      | character varying(260) |        
 apikey    | character varying(260) |         
 apisecret | character varying(260) |          
 
 
                       Table "public.wallethistory"
    Column     |         Type          | Description
---------------+-----------------------+-----------------------------
 date          | date                  |        
 walletbalance | integer               |        
 amount        | integer               |          
 account       | character varying(50) |          
```
