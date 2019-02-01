var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost", 
    port: "3306",
    database: "bamazon_db",
    user: "root",
    password: "password",
});

connection.connect(function (){
connection.query("select * from products", function(err, res){
    console.log(res);

    inquirer
    .prompt([
        {
            type: "number",
            name: "q1", 
            message: "What is the id of the item you would like to buy?",
        },
        {
            type: "number",
            name: "q2", 
            message: "How many would you like to buy?",
        }
    ])
    .then(answers => {
      console.log(answers);
      connection.query(`select * from products where item_id = ${answers.q1} `, function(err,res){
        if (err) throw err;
        console.log(res); 
        var itemPurchased = res[0];
        if (answers.q2 > itemPurchased.stock_quantity) {
          console.log("Insufficient Quantity!");
          setTimeout(purchaseProduct, 1500);
        } else {
          connection.query("UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: res[0].stock_quantity - answers.q2, 
              product_sales: itemPurchased.price * answers.q2
            },
            {
              item_id: answers.q1
            }
          ],
          function(err, res) {
            if (err) throw err;
            console.log("Thank you for your order! \n Your total comes to: $" + (itemPurchased.price * answers.q2).toFixed(2));
            //with an if statement determine if there is enough quantity based on what user asked for
            //if there is not enough, tell the user that there is not enough
            //if there is enough, then query db and update quantity
            //tell cust you made successful purchase and we charged your card x amount
          });
        }
      }
      );
        // connection.end()
    });
  });
});