const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




public_users.post("/register", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;
  if (username && password){
    if (isValid(username)){
        users.push({"username":username,"password":password})
        return res.status(200).json({message:"User succesfully registered!You can now log in."});
    }
    else{
        return res.status(404).json({message:"User already exists!"});
    }
  }
  return res.status(404).json({message:"Unable to register user."});

  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).send(JSON.stringify(books,null,4));
  
});
public_users.get('/books',function(req,res){
    const get_books=new Promise((resolve,reject)=>{
        resolve(res.send(JSON.stringify({books},null,4)));
    });
    get_books.then(()=>console.log("promise for task 10 resolved"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  return res.status(300).json(books[isbn]);
 });

 public_users.get('/books/isbn/:isbn',function(req,res){
    const get_books_onisbn=new Promise((resolve,reject)=>{
        const isbn=req.params.isbn;
        resolve(res.json(books[isbn]));
    });
    get_books_onisbn.then(()=>console.log("promise for task 11 resolved"));
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author=req.params.author;
  let arrofkeys=Object.keys(books);
  const findauthor=(key)=>{
     if (books[key]["author"]==author){
        return res.status(300).json({"books by author":[books[key]]});
     }
    }
  arrofkeys.forEach(findauthor);
  

  return res.status(404).json({message: "Author not found"});
});

public_users.get('/books/author/:author',function(req,res){
    const get_books_onauthorPromise=new Promise((resolve,reject)=>{
        const author=req.params.author;
        let arrofkeys=Object.keys(books);
        const findauthor=(key)=>{
            if (books[key]["author"]==author){
                let result_key=key
                return result_key;
            }
            else{
                return 0;
            }
           }
        let keyno=arrofkeys.forEach(findauthor);
        if(keyno){
            resolve(res.json(books[keyno]));
        }
        else{
            reject(res.json({"message":"author not found"}))
        }
    
        
    });
    
    get_books_onauthorPromise.then(result=>console.log("books by author returned"),error=>console.log("author not found"));
});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code 
  const title=req.params.title;
  let arrofkeyst=Object.keys(books);
  const findtitle=(key)=>{
     if (books[key]["title"]==title){
        return res.status(300).json({"books by title":[books[key]]});
     }
    }
  arrofkeyst.forEach(findtitle);
  
});

public_users.get('/books/title/:title',function(req,res){
    const get_books_ontitlerPromise=new Promise((resolve,reject)=>{
        const title=req.params.title;
        let arrofkeys=Object.keys(books);
        const findtitle=(key)=>{
            if (books[key]["title"]==title){
                let result_key=key
                return result_key;
            }
            else{
                return 0;
            }
           }
        let keyno=arrofkeys.forEach(findtitle);
        if(keyno){
            resolve(res.json(books[keyno]));
        }
        else{
            reject(res.json({"message":"title not found"}))
        }
    
        
    });
    
    get_books_ontitlePromise.then(result=>console.log("book by title returned"),error=>console.log("title not found"));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  return res.status(300).json(books[isbn]["reviews"]);
});

module.exports.general = public_users;
