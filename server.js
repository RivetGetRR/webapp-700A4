/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Rahul Pankaja Edirisnghe Student ID: 133360222 Date: 10/03/2023 March 10th 2023
*
* Online (Cyclic) Link: https://victorious-dog-buckle.cyclic.app
*
********************************************************************************/


var express = require("express");
var path = require("path");
const moduleAccess = require('./modules/collegeData');
var app = express();

var HTTP_PORT = process.env.PORT || 8080;


//Main Paths 
//Get Students
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/students", (req, res) => {
    
    let response = undefined;

    if(req.query.course){//has course param:
        if(req.query.course <= 7 && req.query.course >= 1){
            moduleAccess.getStudentsByCourse(req.query.course).then(function(studentData){
                console.log("Successfully retrieved " + (studentData.length) + " students");
                //res.json
                res.json(studentData);
            }).catch(errorMessageS=>{
                console.log(errorMessageS);
                res.json({message: errorMessageS});
            });
        }else{
            res.json({message: "Enter Valid Course Number: 1-7"});
        }
    }else{//if no param then:
 
        moduleAccess.getAllStudents().then(function(studentData){
            console.log("Successfully retrieved " + (studentData.length) + " students");
            res.json(studentData);
        }).catch(errorMessageS=>{
            console.log(errorMessageS);
            res.json({message: errorMessageS});
        });
    }
});

//Students by Num
app.get("/student/:num", (req, res) => {
    moduleAccess.getStudentByNum(req.params.num).then(function(studentData){
        console.log("Successfully retrieved " + (studentData.firstName + " " + studentData.lastName + " " + studentData.course));
        res.json(studentData);
    }).catch(errorMessageS=>{
        console.log(errorMessageS);
        res.json({message: errorMessageS});
    });
});

//get TAs
app.get("/tas", (req, res) => {
    moduleAccess.getTAs().then(function(t_a_Data){
        console.log("Successfully retrieved " + (t_a_Data.length) + " TAs");
        res.json(t_a_Data);
    }).catch(errorMessageT=>{
        console.log(errorMessageT);
        res.json({message: errorMessageT});
    });
});

//
app.get("/courses", (req, res) => {
    moduleAccess.getCourses().then(function(courseData){
        console.log("Successfully retrieved " + (courseData.length) + " courses");
        
    }).catch(errorMessageC=>{
        console.log(errorMessageC);
        res.json({message: errorMessageC});
    });
});

//HTML Paths
//node --watch server.js
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname,"/views/htmlDemo.html"));
});

app.get("/test", (req, res) => {
    res.sendFile(path.join(__dirname,"/audio/sample-audio.mp3"));
});

app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname,"/views/addStudent.html"));
});

app.post("/students/add", (req, res) => {
    //res.json(req.body);
    moduleAccess.addStudent(req.body).then(function(Data){
        console.log("Successfully added new Student");
        //var path = "/student/" + Data;
        //res.redirect(path);
        res.redirect("/students");
    }).catch(errorMessageT=>{
        console.log(errorMessageT);
        res.json({message: errorMessageT});
    });
});

//Server Initialization and Error Handling
//<label><input checkbox></label> helps -> can click text
app.use((req,res,next)=>{
    //res.status(404).send("Uh Oh Bro - 4 0 4");
    res.status(404).sendFile(path.join(__dirname,"/views/E404.html"))
});

// setup http server to listen on HTTP_PORT
moduleAccess.initialize().then(function(returnedData){//create an object and use that? is this beacuse of local saved files?
    app.listen(HTTP_PORT, ()=>{console.log("Server listening on port: " + HTTP_PORT)});
}).catch(errorMessage=>{
    console.log(errorMessage);
});

