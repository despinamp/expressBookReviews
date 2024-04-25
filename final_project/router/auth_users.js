const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userswithsamename=users.filter((user)=>{
        return user.username===username
    });
    if (userswithsamename.length>0){
        return false;
    }  
    else{
        return true;
    } 
}


const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers=users.filter((user)=>{
        return user.username===username && user.password==password;
    })
    if (validusers.length>0){
        return true;
    } else{
        return false;
    }
}

//only registered users can login

regd_users.post("/login", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;
  if (!username||!password){
    return res.status(404).json({message:"error logging in"});
  }
  if (authenticatedUser(username,password)){
    let accessToken=jwt.sign({
        data:password},'access',{expiresIn:60*60});
    req.session.authorization={"accessToken":accessToken,"username":username}
    return res.status(200).send("user successfully logged in");
  }
  else{
    return res.status(208).send("invalid log in.please check username and password.");
  }


  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn=req.params.isbn;
  const username=req.session.authorization.username;
  const review=req.query.review;
  books[isbn]["reviews"][username]=review;
  return res.status(200).send(`the review for book with isbn ${isbn} has been added`)
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
    const isbn=req.params.isbn;
    const username=req.session.authorization.username;
    if (books[isbn]["reviews"][username]){
        delete books[isbn]["reviews"][username];
        return res.status(200).send(`reviews for book with isbn ${isbn} posted by that user deleted.`)
    }
    else{
        return res.status(404).send(`user has not added  review for book with isbn ${isbn}`)
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
