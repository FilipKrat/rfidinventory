# RFID Inventory App

RFID Inventory App je aplikace pro záznam skladové zásoby v reálném čase na konkrétní skladové pozici s využitím technologie RFID.

## Features

REST api

JSON Web Tokens security

React template front-end

Nodejs + express back-end

MongoDb database

## Links
[App Heroku deploy](https://rfidinventory.herokuapp.com)

[Git repository](https://github.com/FilipKrat/rfidinventory)

## API Specification

```api
FORMAT: 1A
HOST: https://polls.apiblueprint.org/

# RFIDInventoryApp API

RFID Inventory App API is a simple API, which allows to automatic RFID systems, to store number of parts stored in the warehousing area.


## Packaging [/packaging/{id}]

### Get all packages [GET]
You may get all packages in storages.
It takes a JSON with x-access-token.


+ Request (application/json)

    + Headers

            x-access-token: eyJhbGciOiJIUzI1NiJ9.e30.XmNK3GpH3Ys_7wsYBfq4C3M6goz71I7dTgUkuIa5lyQ (string, required) - valid JWT


+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

                [
                {
                    "package_id": "1",
                    "package_name": "DC1246511FGVGV",
                    "package_position_id": "1",
                    "parts_amount": "36",
                    "package_state": "N/A"
                },
                {
                    "package_id": "2",
                    "package_name": "DC1246611GHJWV",
                    "package_position_id": "2",
                    "parts_amount": "30",
                    "package_state": "Inserted"
                }
                ]

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Authentication failed!"
            }


### Create a New Package [POST]

You may create new package using this action. It takes a JSON with x-access-token and
object containing package name, package position and amount of parts in the package.

+ Request (application/json)

    + Headers

            x-access-token: eyJhbGciOiJIUzI1NiJ9.e30.XmNK3GpH3Ys_7wsYBfq4C3M6goz71I7dTgUkuIa5lyQ (string, required) - valid JWT

    + Body

                {
                    "package_name": "DC1246611GHJWV",
                    "package_position_id": "1",
                    "parts_amount": "30"
                }

+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

            {
                "status":"success"
            }

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }

+ Response 500 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "There was a problem adding the information to the database."
            }


### Update Package[PUT]

You may update existing package using this action. It takes a JSON with x-access-token and
object containing package name, position ID and parts amount stored in packaging.

+ Request (application/json)

    + Headers

            x-access-token: eyJhbGciOiJIUzI1NiJ9.e30.XmNK3GpH3Ys_7wsYBfq4C3M6goz71I7dTgUkuIa5lyQ (string, required) - valid JWT

    + Body

                {
                    "package_name": "DC1246611GHJWV",
                    "package_position_id": "1",
                    "parts_amount": "30"
                }

+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

            {
                "status":"success"
            }

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }

+ Response 500 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "There was a problem updating the information in the database."
            }



### Remove Package[DELETE]

You may remove existing package using this action. It takes a JSON with x-access-token.

+ Request (application/json)

    + Headers

            x-access-token: eyJhbGciOiJIUzI1NiJ9.e30.XmNK3GpH3Ys_7wsYBfq4C3M6goz71I7dTgUkuIa5lyQ (string, required) - valid JWT


+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

            {
                "status":"success"
            }

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }

+ Response 500 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "There was a problem while removing the information from the database."
            }

## Move Packages [/package/move-package/{id}]

### Update a Package Status[PUT]

You may create new package using this action. It takes a JSON with x-access-token and
object containing a package name, package position and amount of parts in the package.

+ Request (application/json)

        {
            "package_name": "DC1246611GHJWV"
            "antenna_name": "1"
        }

+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

            {
                "status":"success"
            }

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }

+ Response 500 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "There was a problem updating the information in the database."
            }

## Antennas [/antennas/{id}]

### Get all antennas [GET]
You may get all antennas.
It takes a JSON with x-access-token.


+ Request (application/json)

    + Headers

            x-access-token: eyJhbGciOiJIUzI1NiJ9.e30.XmNK3GpH3Ys_7wsYBfq4C3M6goz71I7dTgUkuIa5lyQ (string, required) - valid JWT



+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

                [
                {
                    "antenna_id": "1",
                    "antenna_name": "11",
                    "antenna_position_id": "1",
                    "antenna_state": "Inserted"
                },
                {
                    "antenna_id": "2",
                    "antenna_name": "12",
                    "antenna_position_id": "2",
                    "antenna_state": "Confirmed"
                }
                ]

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }


### Create a New Antenna [POST]

You may create new antenna using this action. It takes a JSON with x-access-token and
object containing antenna name, antenna position and antenna status, paired to the position in storage.

+ Request (application/json)

    + Headers

            x-access-token: eyJhbGciOiJIUzI1NiJ9.e30.XmNK3GpH3Ys_7wsYBfq4C3M6goz71I7dTgUkuIa5lyQ (string, required) - valid JWT

    + Body

                {
                    "antenna_name": "11",
                    "antenna_position_id": "1",
                    "antenna_status": "Inserted"
                }

+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

            {
                "status":"success"
            }

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }

+ Response 500 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "There was a problem adding the information to the database."
            }


### Update Antenna[PUT]

You may update existing antenna using this action. It takes a JSON with x-access-token and
object containing antenna name, antenna position and status of antenna (based on location in position).

+ Request (application/json)
    + Headers

            x-access-token: eyJhbGciOiJIUzI1NiJ9.e30.XmNK3GpH3Ys_7wsYBfq4C3M6goz71I7dTgUkuIa5lyQ (string, required) - valid JWT

    + Body


            {
                "antenna_name": "11",
                "antenna_position_id": "2",
                "antenna_status": "removed"
            }

+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

            {
                "status":"success"
            }

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }

+ Response 500 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "There was a problem updating the information in the database."
            }


### Remove Antenna[DELETE]

You may remove existing antenna using this action. It takes a JSON with x-access-token.

+ Request (application/json)

    + Headers

            x-access-token: eyJhbGciOiJIUzI1NiJ9.e30.XmNK3GpH3Ys_7wsYBfq4C3M6goz71I7dTgUkuIa5lyQ` (string, required) - valid JWT


+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

            {
                "status":"success"
            }

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }

+ Response 500 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "There was a problem while removing the information from the database."
            }



## Positions [/position/{id}]

### Get all positions [GET]
You may get all positions.
It takes a JSON with x-access-token.


+ Request (application/json)

    + Headers

            x-access-token: eyJhbGciOiJIUzI1NiJ9.e30.XmNK3GpH3Ys_7wsYBfq4C3M6goz71I7dTgUkuIa5lyQ (string, required) - valid JWT


+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

                [
                {
                    "position_id": "1",
                    "position_name": "712A1-N000"
                },
                {
                    "position_id": "2",
                    "position_name": "713A1-N000"
                }
                ]

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }


### Create a New Position [POST]

You may create new position using this action. It takes a JSON with x-access-token and
object containing position name you may want to automize through RFID.

+ Request (application/json)

    + Headers

            x-access-token: eyJhbGciOiJIUzI1NiJ9.e30.XmNK3GpH3Ys_7wsYBfq4C3M6goz71I7dTgUkuIa5lyQ` (string, required) - valid JWT

    + Body

                {
                    "position_name": "712A1-N000"
                }

+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

            {
                "status":"success"
            }

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }

+ Response 500 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "There was a problem adding the information to the database."
            }

### Update Position[PUT]

You may update existing position using this action. It takes a JSON with x-access-token and
object containing current position name you may want to automize through RFID.

+ Request (application/json)

    + Headers

            x-access-token: eyJhbGciOiJIUzI1NiJ9.e30.XmNK3GpH3Ys_7wsYBfq4C3M6goz71I7dTgUkuIa5lyQ (string, required) - valid JWT

    + Body

                {
                    "position_name": "712A1-N000"
                }

+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

            {
                "status":"success"
            }

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }

+ Response 500 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "There was a problem updating the information in the database."
            }



### Remove Position[DELETE]

You may remove existing position using this action. It takes a JSON with x-access-token.

+ Request (application/json)

    + Headers

            x-access-token: eyJhbGciOiJIUzI1NiJ9.e30.XmNK3GpH3Ys_7wsYBfq4C3M6goz71I7dTgUkuIa5lyQ (string, required) - valid JWT


+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

            {
                "status":"success"
            }

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }

+ Response 500 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "There was a problem while removing the information from the database."
            }





##Authorization [/api/auth/login]

### Login User [POST]

You can login a user, using this action. It takes a JSON
object containing users email and password.

+ Request (application/json)

        {
            "user_email": "test@test.com",
            "user_password": "$2y$12$gVy4Olgxud6qERZnPb4p5O5oG73eqdBMsajgh7/4h9QylJBu897oW"
        }

+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

            {
                "user_data":
                        {
                        "user_id": "1",
                        "user_firstname":"Filip",
                        "user_lastname":"Kratochvil",
                        "user_token":"qgqdcfohwubguzhdqwijixbztgrewoeiwe",
                        "auth": "true"
                        }
            }

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }


##Registration [/api/auth/signup]
### Sign up User [POST]

You can register new user, using this action. It takes a JSON
object containing users firstname, lastname, unique email and password.

+ Request (application/json)

        {
            "user_fistname": "Filip",
            "user_lastname": "Kratochvil"
            "user_email": "test@test.com"
            "user_password": "$2y$12$gVy4Olgxud6qERZnPb4p5O5oG73eqdBMsajgh7/4h9QylJBu897oW"
        }

+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "user_data":{
                        "user_id": "fdwuisinwjwxdwjwd",
                        "user_firstname":"Filip",
                        "user_lastname":"Kratochvil",
                        "status": "success"
                        }
            }

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }

+ Response 500 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "There was a problem registering the user."
            }


##User [/api/auth/{id}]
### Update User [PUT]

You can update existing user info, using this action. It takes a JSON
object containing users firstname, lastname, unique email and password.

+ Request (application/json)

        {
            "user_fistname": "Filip",
            "user_lastname": "Kratochvil"
            "user_email": "test@test.com"
            "user_password": "$2y$12$gVy4Olgxud6qERZnPb4p5O5oG73eqdBMsajgh7/4h9QylJBu897oW"
        }

+ Response 200 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "user_data":{
                        "user_id": "fdwuisinwjwxdwjwd",
                        "user_firstname":"Filip",
                        "user_lastname":"Kratochvil",
                        "status": "success"
                        }
            }

+ Response 400 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "Request body is missing"
            }

+ Response 500 (application/json)

    + Headers

            Location: /

    + Body

            {
                    "There was a problem registering the user."
            }
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
