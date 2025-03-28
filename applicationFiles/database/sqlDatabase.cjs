const { query } = require('express');
const {databaseName,environementName} = require("../global.cjs");

const sqlite3 = require('sqlite3').verbose();


class dbInstance {
    constructor(tableName) {
        this.dbName = global.dbName;
        this.tableName = tableName
        // Open the database inside the constructor
        this.db = new sqlite3.Database(`./applicationFiles/database/${this.dbName}.db`, (err) => {
            if (err) {
                console.error('Database opening error: ', err);
            } else {
                console.log('Connected to the mini SQL server. (database)-> ',this.dbName);
            }
        });
        this.initializeTable(); // Initialize the database when an instance is created
    }

    // Function to initialize the database and create a table
    initializeTable() {
        let tableQuery = ``
        if(this.tableName == "users"){
            tableQuery = `CREATE TABLE IF NOT EXISTS ${this.tableName} (name TEXT, email TEXT, hashedPassword TEXT , uniqueId TEXT)`
        }
        if(this.tableName == "faqDetails"){
            tableQuery = `CREATE TABLE IF NOT EXISTS ${this.tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT,question TEXT, answer TEXT)`
        }
        if(this.tableName == "userAddressInformation"){
            tableQuery = `CREATE TABLE IF NOT EXISTS ${this.tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, address TEXT, email TEXT, phone TEXT, zipCode TEXT, googleMapLocation TEXT)`
        }
        if(this.tableName == "shopDetails"){
            tableQuery = `CREATE TABLE IF NOT EXISTS ${this.tableName} (userId TEXT , phoneNumber TEXT , shopName TEXT , panOwnerName TEXT , panNumber TEXT , frontPanImage TEXT , googleLocation TEXT , shopAddress TEXT , pinCode TEXT , businessType TEXT , deliveryTime TEXT)`
        }
        this.db.serialize(() => {
            this.db.run(tableQuery, (err) => {
                if (err) {
                    console.error('Error initializing the database:', err);
                } else {
                    console.log('Table initialized',this.tableName);
                }
            });
        });
    }

    // Function to insert a record with transaction support (ACID)
    insertData(fieldsArray,valueArray) {
        // Generate a string of placeholders based on the number of fields (e.g., "?, ?, ?")
        let placeholders = fieldsArray.map(() => '?').join(', ');
        // console.log(placeholders)

        // Create the SQL query
        const query = `INSERT INTO ${this.tableName} (${fieldsArray.map((e) => `${e}`).join(', ')}) VALUES (${placeholders})`;
        console.log("query => ",query)

        return new Promise((resolve,reject)=>{

            this.db.serialize( ()=>{
    
                // Prepare the SQL statement
                const stmt = this.db.prepare(query);
                
                // Run the query with the values from the array
                stmt.run(...valueArray, (err) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                        resolve("Error while inserting Data "+err)
                    } else {
                        console.log('Data inserted successfully');
                        resolve("Data inserted Sucessfully")
                    }
                    stmt.finalize();
                });
                
            } )
        })

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
    getAllData(query) {
        // this.db.all(`SELECT * FROM ${this.tableName}`, (err, rows) => {
        return new Promise((resolve,reject)=>{
            this.db.all(query, (err, rows) => {
                if (err) {
                    // console.error("Error fetching users:", err);
                    reject(err);
                } else {
                    // console.log('Data:\n', rows);
                    resolve(rows);
                }
            });
        })
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

  // Function to close the database connection
  close() {
    this.db.close((err) => {
        if (err) {
            console.error('Error closing the database:', err);
        } else {
            console.log('Database connection closed.');
        }
    });
  }
}

module.exports = dbInstance;
