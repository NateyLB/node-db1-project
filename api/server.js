const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/", (req, res)=>{
    var sortby;
    var sortdir;
    var queryLimit;
    !req.query.sortby ? sortby = "id": sortby = req.query.sortby;
    !req.query.sortdir? sortdir = "asc": sortdir = req.query.sortdir;
    !req.query.limit? queryLimit = null: queryLimit = req.query.limit;

    db("accounts")
    .orderBy(sortby, sortdir)
    .limit(queryLimit)
    .then(accounts =>{
        res.status(200).json({data: accounts})
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({message: err.message})
    })
})

server.post("/", (req, res)=>{
    db("accounts")
    .insert(req.body)
    .then(id=>{
        res.status(201).json({data: id[0]})
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ message: error.messsage });
      });
})

server.put("/:id", (req,res)=>{
    db("accounts")
    .where({id: req.params.id})
    .update(req.body)
    .then(count =>{
        res.status(200).json({data: count})
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ message: error.messsage });
      });
})

server.delete("/:id", (req, res)=>{
    db("accounts")
    .where({id: req.params.id})
    .del()
    .then(count=>{
        if(count > 0){
            db("accounts")
            .then(accounts =>{
                res.status(200).json({data: accounts})
            })
        }
        else{
            res.status(500).json({message: "The account could not be deleted"})
        }
    })
})



module.exports = server;
