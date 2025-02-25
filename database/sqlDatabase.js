const { query } = require('express');

const sqlite3 = require('sqlite3').verbose();

class dbInstance {
    constructor(tableName) {
        this.dbName = global.dbName;
        this.tableName = tableName
        // Open the database inside the constructor
        this.db = new sqlite3.Database(`${this.dbName}.db`, (err) => {
            if (err) {
                console.error('Database opening error: ', err);
            } else {
                console.log('Connected to the mini SQL server.');
            }
        });
        this.initializeDatabase(); // Initialize the database when an instance is created
    }

    // Function to initialize the database and create a table
    initializeDatabase() {
        let tableQuery = ``
        if(this.tableName == "users"){
            tableQuery = `CREATE TABLE IF NOT EXISTS ${this.dbName} (name TEXT, email TEXT, hashedPassword TEXT , uniqueId TEXT)`
        }
        if(this.tableName == "shopDetails"){
            tableQuery = `CREATE TABLE IF NOT EXISTS ${this.dbName} (userId TEXT , phoneNumber TEXT , shopName TEXT , panOwnerName TEXT , panNumber TEXT , frontPanImage TEXT , googleLocation TEXT , shopAddress TEXT , pinCode TEXT , businessType TEXT , deliveryTime TEXT)`
        }
        this.db.serialize(() => {
            this.db.run(tableQuery, (err) => {
                if (err) {
                    console.error('Error initializing the database:', err);
                } else {
                    console.log('Database initialized');
                }
            });
        });
    }

    // Function to insert a record with transaction support (ACID)
    insertUser(fieldsArray,valueArray) {
        // Generate a string of placeholders based on the number of fields (e.g., "?, ?, ?")
        placeholders = fieldsArray.map(() => '?').join(', ');

        // Create the SQL query
        const query = `INSERT INTO ${this.tableName} (${fieldsArray.map((e) => `${e}`).join(', ')}) VALUES (${placeholders})`;

        this.db.serialize( ()=>{

            // Prepare the SQL statement
            const stmt = this.db.prepare(query);
            
            // Run the query with the values from the array
            stmt.run(...valueArray, (err) => {
                if (err) {
                    console.error('Error inserting data:', err);
                } else {
                    console.log('Data inserted successfully');
                }
                stmt.finalize();
            });
            
        } )
    }

    updateUsers(condition, settings) {
        // settings should be an array of [column, value] pairs
        const setQuery = settings.map(([field]) => `${field} = ?`).join(', ');
    
        // Condition should be [column, value]
        const query = `UPDATE ${this.tableName} SET ${setQuery} WHERE ${condition[0]} = ?`;
    
        this.db.serialize(() => {
            // Prepare the SQL statement
            const stmt = this.db.prepare(query);
    
            // Extract values for the placeholders
            const values = [...settings.map(([_, val]) => val), condition[1]];
    
            // Run the query with values
            stmt.run(values, function (err) {
                if (err) {
                    console.error('Error updating data:', err);
                } else {
                    console.log('Data updated successfully');
                }
                stmt.finalize();
            });
        });
    }
    

    // Function to get all users
    getAllUsers() {
        this.db.all(`SELECT * FROM ${this.tableName}`, (err, rows) => {
            if (err) {
                console.error("Error fetching users:", err);
            } else {
                console.log('Users:', rows);
            }
        });
    }

    // Function to search for a value in a column
    findInColumn(column, value) {
        const query = `SELECT * FROM ${this.tableName} WHERE ${column} = ?`;
  
        this.db.all(query, [value], (err, rows) => {
          if (err) {
            console.error('Error executing query:', err);
            return [err, null];
          } else {
            return [null, rows];
          }
        });
  }
}

module.exports = dbInstance;
