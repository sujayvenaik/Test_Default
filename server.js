    var express = require('express');  
    var app = express();  

    var pg = require('pg');
    var radians = require('degrees-radians');

    var connectionString  = 'postgresql://postgres:sujay123@localhost:5432/redcarpet';

  

    app.use(express.static('public'));  
  //First end for obtaining values    
    app.post('/index.html', function (req, res) {  
       res.sendFile( __dirname + "/" + "index.html" );  
    })  
    app.get('/process_get', function (req, res) {  
    response = {  
           name:req.query.name,  
           lat:req.query.lat,
           long1:req.query.long  
       };  
       console.log(response);  
  
       res.end(JSON.stringify(response));  
  
        pg.connect(connectionString,function(err,client,done) {
       if(err){
         console.log("in error clause for connect")
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
           console.log("in error clause for connect")
       } 
       client.query("INSERT INTO data values('"+req.query.name+"',"+req.query.lat+","+req.query.long +")",function(err,result) {
           done(); // closing the connection;
           
       });
    });
        console.log("Done")
    })
//Second for getting values through automatic functions
 app.get('/output.html', function (req, res) {  
       res.sendFile( __dirname + "/" + "output.html" );  
    })  
    app.get('/get_using_postgres', function (req, res) {  
    response = {  
           radius:req.query.rad,  
           lat:req.query.lat,
           long1:req.query.long  
       };  
       console.log(response);  
  
       res.end(JSON.stringify(response));  
        pg.connect(connectionString,function(err,client,done) {
       if(err){
         console.log("in error clause for connect")
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
           console.log("in error clause for connect")
       } 
   

     var query =   client.query("SELECT data.name FROM data WHERE earth_box( {"+req.query.lat+"}, {"+req.query.long+"}, {"+req.query.rad+"}) @> ll_to_earth(data.latitude, data.longitude);",function(err,result) {
            if(err){
                console.log("in error of insert")
                console.log(err);
                res.status(400).send(err);
            }
         query.on("row", function (row, result) {
    result.addRow(row);
    console.log("!!@@")
});
query.on("end", function (result) {
    console.log(JSON.stringify(result.rows, null, "    "));
      console.log("**&&")
    client.end();
});

           done(); // closing the connection;
           // if(err){
           //     console.log("in error of insert")
           //     console.log(err);
           //     res.status(400).send(err);
           // }
           // res.status(200).send(result.rows);
       });
    });
        console.log("Done")
    })  
  
    //Third Api End Point

    app.get('/output1.html', function (req, res) {  
       res.sendFile( __dirname + "/" + "output.html" );  
    })  
    app.get('/get_using_self', function (req, res) {  
    response = {  
           radius:req.query.rad,  
           lat:req.query.lat,
           long1:req.query.long  
       };  
       console.log(response);  
  
       res.end(JSON.stringify(response));  
        pg.connect(connectionString,function(err,client,done) {
       if(err){
         console.log("in error clause for connect")
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
           console.log("in error clause for connect")
        } 
//        var sinlat = Math.sin(radians(Number(req.query.lat)));
//        var coslat = Math.cos(radians(Number(req.query.lat)));
//        console.log(sinlat)
//        console.log(coslat)
// var n = radians(Number(req.query.long));
//         console.log("Sine value " + Math.sin(radians(Number(req.query.lat))))
//        // Math.acos(0.5);
//        var n1 = Number(Math.sin(1.3963));
//        console.log(n1)
//        var n2 = Number(Math.cos(1.3963))
//        console.log(n2)
//        var n3 = Number(Math.cos(n))
//        console.log(n3)
//        var n3_1 = n1 * sinlat + n2 * coslat * n3 - (-0.6981)
//        console.log(n3_1)
//        var n4 = Math.acos(n3_1)
//        console.log(n4)
//         var answer = Number(n4)
//       console.log(Number(answer))
//     var answer1 = answer *6371;
//     console.log(Number(answer1))
//         //SELECT * FROM data WHERE  * 6371 <= radius;
//     var sql = "select * from data where "+answer1+" <= "+req.query.rad; 
//     console.log(sql);

var sql = "SELECT `name`, ( 6371 * acos(cos( radians("+ radians(Number(req.query.lat))+" ) ) * cos( radians( `lat` ) ) * cos( radians( `long` ) - radians("+ radians(Number(req.query.long)) +")) + sin(radians("+radians(Number(req.query.long))+")) *sin(radians(`lat`)))) `distance`FROM `data` HAVING `distance` < "+Number(req.query.rad)  


    console.log(sql)
     var query =  client.query(sql,function(err,result){
            if(err){
                console.log("in error of insert")
                console.log(err);
                res.status(400).send(err);
            }
         query.on("row", function (row, result) {
    result.addRow(row);
    console.log("!!@@")
});
query.on("end", function (result) {
    console.log(JSON.stringify(result.rows, null, "    "));
      console.log("**&&")
    client.end();
});

           done(); // closing the connection;
           // if(err){
           //     console.log("in error of insert")
           //     console.log(err);
           //     res.status(400).send(err);
           // }
           // res.status(200).send(result.rows);
       });
    });
        console.log("Done")
    }) 
  

//END OF Third API ENDPOINT


    var server = app.listen(3001, function () {  
      
      var host = server.address().address  
      var port = server.address().port  
      console.log("Example app listening at http://%s:%s", host, port)  
      
    })  