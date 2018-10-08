const express = require('express');
const router = express.Router();
const path = require('path');
const mongojs = require("mongojs");
const request = require("request");
const cheerio = require("cheerio");

// Database configuration
// Save the URL of our database as well as the name of our collection
const databaseUrl = "newsdb";
const collections = ["news"];

// Use mongojs to hook the database to the db variable
const db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
});


router.get('/',function(req,res){
    db.news.find({}, function(error, found) {
        // Throw any errors to the console
        if (error) {
          console.log(error);
        }
        // If there are no errors, send the data to page and render it
        else {
            console.log("root route - Came in here------------------------------------------------------------------------------------------------------------------------------");
            // console.log(found);
            if (found.length == 0){
                console.log("empty found");
                res.render('pages/index',found);
            }else{
                console.log(found);
                res.render('pages/index',{found:found});
            } 
        }
    }); 
});

// Scrape data from one site and place it into the mongodb db
router.get("/scrape", function(req, res) {

    request("https://www.nytimes.com/", function(error, response, html) {
        // console.log(html);
      // Load the html body from request into cheerio
      let $ = cheerio.load(html);
      let array =[];
      // For each element with a "title" class
      $("div.css-6p6lnl").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        let link = $(element).children("a").attr("href");
        let title = $(element).children().eq(0).children().eq(0).children().eq(0).children().text();
        let para = $(element).children("a").children().eq(1).children("li").eq(0).text();
        if(!para){
            para = $(element).children("a").children().eq(1).text();
        }
        
        
        // If this found element had both a title and a link, push into data array
        if (title && link) {
            array.push({title: title,
                link: "https://www.nytimes.com"+link,
                para:para,
                Saved: false,
                comments:[]
            });
            
            console.log(i+" pushed to array");
        }
      });
      console.log("Scrape Complete");
      //insert the array of data in to the db
      db.news.insert(array,
      function(err, inserted) {
        if (err) {
          // Log the error if one is encountered during the query
          console.log(err);
        }
        else {
          // Otherwise, log the inserted data
          console.log('All inserted in db');
          res.redirect('/');
        }
      });
    });
});

router.get('/delete',function(req,res){

    db.news.drop(function(error, found) {
        // Throw any errors to the console
        if (error) {
          console.log(error);
        }
        // If there are no errors, send the data to page and render it
        else {
            console.log("Delete route - Came in here--------------------------------------------------------------------------------------------------------------------------------");
            console.log(found);
            res.redirect('/');
        }
    }); 
});

router.get('/save/:id', function(req,res){
    db.news.update({"_id": mongojs.ObjectID(req.params.id)},{$set : {"Saved":true}}, 
        function(error, found){
            if (error) {
                console.log(error);
            }
            // If there are no errors, send the data to page and render it
            else {

                db.news.find({"_id": mongojs.ObjectID(req.params.id)}, function(error, found) {
                    // Throw any errors to the console
                    if (error) {
                      console.log(error);
                    }
                    // If there are no errors, send the data to page and render it
                    else {
                        console.log("root route - Came in here------------------------------------------------------------------------------------------------------------------------------");
                        // console.log(found[0].Saved);
                        if (found[0].Saved == true){
                            res.redirect('/');
                        }else{
                            console.log("Document not yet updated");
                        } 
                    }
                });
                
            }

    });
});

router.get('/saved', function(req,res){
    
    db.news.find({"Saved":true}, function(error,found){
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to page and render it
        else {
            console.log("saved route - Came in here------------------------------------------------------------------------------------------------------------------------------");
            // console.log(found[0]);
            if (found.length == 0){
                res.render('pages/saved', found);
            }else{
                res.render('pages/saved', {found: found});
                // console.log("Document not yet updated");
            } 
        }
    });
});

router.get('/remove-save/:id', function(req,res){
    db.news.update({"_id": mongojs.ObjectID(req.params.id)},{$set : {"Saved":false}}, 
        function(error, found){
            if (error) {
                console.log(error);
            }
            // If there are no errors, send the data to page and render it
            else {

                db.news.find({"_id": mongojs.ObjectID(req.params.id)}, function(error, found) {
                    // Throw any errors to the console
                    if (error) {
                      console.log(error);
                    }
                    // If there are no errors, send the data to page and render it
                    else {
                        console.log("root route - Came in here------------------------------------------------------------------------------------------------------------------------------");
                        // console.log(found[0].Saved);
                        if (found[0].Saved == false){
                            res.redirect('/saved');
                        }else{
                            console.log("Document not yet updated");
                        } 
                    }
                });
                
            }

    });
});

router.post('/save-comment/:id', function(req,res){
    console.log(req.params.id, req.body.comment);

    db.news.find({"_id": mongojs.ObjectID(req.params.id)}, function(error,found){
        if (error) {
            console.log(error);
        }else{
            // console.log(res);
            let commentArray = found[0].comments;
            commentArray.push(req.body.comment);

            db.news.update({"_id": mongojs.ObjectID(req.params.id)},{$set : {"comments":commentArray}}, 
            function(error, found){
                if (error) {
                    console.log(error);
                }
                // If there are no errors, send the data to page and render it
                else {

                    console.log("Comment Added");
                    res.redirect('/saved');

                    // db.news.find({"_id": mongojs.ObjectID(req.params.id)}, function(error, found) {
                    //     // Throw any errors to the console
                    //     if (error) {
                    //     console.log(error);
                    //     }
                    //     // If there are no errors, send the data to page and render it
                    //     else {
                    //         console.log("root route - Came in here------------------------------------------------------------------------------------------------------------------------------");
                    //         // console.log(found[0].Saved);
                    //         if (found[0].Saved == false){
                    //             res.redirect('/saved');
                    //         }else{
                    //             console.log("Document not yet updated");
                    //         } 
                    //     }
                    // });
                    
                }

            });
        }
        
    })
})

router.get("/all-comments/:id", function(req, res) {
    // When searching by an id, the id needs to be passed in
    // as (mongojs.ObjectId(IdYouWantToFind))
  
    // Find just one result in the notes collection
    db.news.findOne(
      {
        // Using the id in the url
        _id: mongojs.ObjectId(req.params.id)
      },
      function(error, found) {
        // log any errors
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {
            // Otherwise, send the note to the browser
            // This will fire off the success function of the ajax request
            //   console.log(found);
            res.json(found);
        }
      }
    );
  });

module.exports = router;