var async = require('async')
var myreq = require('sync-request');
var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mysql = require('mysql');
var url = require('url');
var app = express();
var rp=require('request-promise')
var leven= require('levenshtein');
var Client = require('node-rest-client').Client;
var client = new Client();
var data_refr=require('./data_refr.json')
var globalarray={}
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

//wit bot configuration

const WIT_TOKEN ='3UVQVOGN7BF3VDUY6TLYEQJVWXOOGDC2';
//const WIT_TOKEN = process.env.WIT_TOKEN || '7URTUU4SGVZOX5MZP5HJWWCYVDM4OOSS';
try {
  // if running from repo
  Wit = require('../').Wit;
  log = require('../').log;
} catch (e) {
  Wit = require('node-wit').Wit;
  log = require('node-wit').log;
}


const sessions = {};

const findOrCreateSession = (fbid) => {
  var sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {_fbid_:fbid}};
  }
  return sessionId;
};











// Our bot actions

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};
function checkWhetherLocationOrRest(location,recipientID){
 var  dict = [];
var gen=[];
             
var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){
    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  connection.query('select distinct cuisine_name  from top_dishes_cuisines',function(err,rows,fields){
    if(!err) { 
            if(rows.length > 0){
              count=0;
              while(rows.length>count)
              {
                val=leven(rows[count].cuisine_name,location)
              dict.push({
              key:   rows[count].cuisine_name,
              value: val,
              });
              gen.push('cuisine');
              count++;
              }
connection.query('select distinct res_name from top_dishes',function(err,rows,fields){
    if(!err) {
        if(rows.length > 0){
          count=0;
              while(rows.length>count)
              {
                val=leven(rows[count].res_name,location)
              dict.push({
              key:   rows[count].res_name,
              value: val
              });
              gen.push('rest');
              count++;
              }
            }  
  }
connection.query('select distinct location from top_rest',function(err,rows,fields){
    if(!err) {
        if(rows.length > 0){
          count=0;
              while(rows.length>count)
              {
              if(rows[count].location){
              val=leven(rows[count].location,location)
              dict.push({
              key:   rows[count].location,
              value: val
              });
              gen.push('location');
              }
              count++;

              }
              sort_dict1(dict,gen,recipientID);
              connection.end({ timeout: 60000 });
            }  
  }});

});
         }
              else{
          sendTextMessage(sender,'nothing');
              }
    }
    else
      console.log('error');
  });
}


const actions = {
  send({sessionId}, {text}) {
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
    const recipientId = sessions[sessionId].fbid;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      // We return a promise to let our bot know when we're done sending
      return 0//sendTextMessage(recipientId, text)
      .then(() => null)
      .catch((err) => {
        console.error(
          'Oops! An error occurred while forwarding the response to',
          recipientId,
          ':',
          err.stack || err
        );
      });
    } else {
      console.error('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
      return Promise.resolve()
    }
  },
//   merge({sessionId, context, entities, message}) {
//     // Retrieve the location entity and store it into a context field
//     const location = firstEntityValue(entities, 'location');
//     const cat = firstEntityValue(entities, 'cat');
//     var recipientID=sessions[sessionId].fbid;
//     if (location && cat) {
//       context.location = location;
//       context.cat = cat;
//       sessions[sessionId].context=context

//     }
//     if ((location) && (!cat)) {
//       sendTextMessage(recipientID,'Inside location but no cat merge module: '+JSON.stringify(context))

//       context.location = location; // store it in context
//       //if (context.missingcat)
//       context.missingcat = true;
//       context.cat = firstEntityValue(entities, 'cat') || mergeParams.cat
//       sessions[sessionId].context=context
//       mergeParams.location = location
//       //mergeParams.cat = cat
//     }
//      if ((cat) && (!location)) {
// sendTextMessage(recipientID,'Inside cat but no location merge module: '+JSON.stringify(context))
// //      sendTextMessage()
//       context.cat = cat; // store it in context
//       context.missinglocation = true;
//       context.location = firstEntityValue(entities, 'location') || mergeParams.location
//       sessions[sessionId].context=context
//       mergeParams.cat = cat

//     }
















    // if ((context.cat) && (context.missinglocation)) {
    //   context.location = firstEntityValue(entities, 'location')
    //   delete context.missinglocation
    //   sessions[sessionId].context=context

    // }

    // if ((context.location) && (context.missingcat)) {
    //   context.cat = firstEntityValue(entities, 'cat')
    //   delete context.missingcat
    //   sessions[sessionId].context=context

    // }

  //   return Promise.resolve(context);
  // },
complete(response){
  return Promise.resolve()
},



showThingsInALocation({text,sessionId,entities,context}) {
    if (sessionId) { 
 var user=sessions[sessionId];
 var message=text
 var recipientID=sessions[sessionId].fbid;
 var location = firstEntityValue(entities, 'location')
 var cat = firstEntityValue(entities, 'cat')
var cat=false,loc=false,cus=false,amen=false;
var set_key=false;
if(entities.hasOwnProperty('cat')){
cat=true;
cat_final=''
keys_to_check={'top_dishes':'top_dishes','top_rest':'top_rest','top_cuisines':'top_cuisines'}
category=entities.cat[0].value
if(data_refr.top_dishes.hasOwnProperty(category.toLowerCase()))
cat_final='top_dishes'
if(data_refr.top_rest.hasOwnProperty(category.toLowerCase()))
cat_final='top_rest'
if(data_refr.top_cuisines.hasOwnProperty(category.toLowerCase()))
 cat_final='top_cuisines'
if(cat_final===''){
  set_key=true;
cat_final=levenFor(keys_to_check,category).split('|')[1]
category=levenFor(keys_to_check,category).split('|')[0]}
}

if(entities.hasOwnProperty('location')){
loc=true;
loc_final=''
keys_to_check={'rests':'rests','cuisines':'cuisines','location':'location'}
location=entities.location[0].value
if(data_refr.location.hasOwnProperty(location))
loc_final='location'
if(data_refr.rests.hasOwnProperty(location))
loc_final='rests'
if(data_refr.cuisines.hasOwnProperty(location))
loc_final='cuisines'
if(loc_final===''){
  set_key=true;
loc_final=levenFor(keys_to_check,location).split('|')[1]
location=levenFor(keys_to_check,location).split('|')[0]}
// sendTextMessage(recipientID,'location received '+entities.location[0].value)
}
if(entities.hasOwnProperty('cuisine')){
cus=true;
cus_final=''
keys_to_check={'dishes':'dishes','cuisines':'cuisines','amenities':'amenities'}
cuisine=entities.cuisine[0].value
if(data_refr.amenities.hasOwnProperty(cuisine))
cus_final='amenities'
if(data_refr.cuisines.hasOwnProperty(cuisine))
cus_final='cuisines'
if(data_refr.dishes.hasOwnProperty(cuisine.toLowerCase()))
  cus_final='dishes'
if(cus_final===''){ 
  set_key=true;
cus_final=levenFor(keys_to_check,cuisine).split('|')[1]
cuisine=levenFor(keys_to_check,cuisine).split('|')[0]
if(cus_final==='cuisines')
cuisine=data_refr.cuisines[cuisine];
  }else{
    if(cus_final==='cuisines')
    cuisine=data_refr.cuisines[cuisine];
  }
  // sendTextMessage(recipientID,'cuisine received '+entities.cuisine[0].value)
}
if(entities.hasOwnProperty('amenities')){
amen=true;
amen_final=''
keys_to_check={'amenities':'amenities'}
amenity=entities.amenities[0].value
if(data_refr.amenities.hasOwnProperty(amenity))
amen_final='amenities'
if(amen_final===''){
  set_key=true;
amen_final=levenFor(keys_to_check,amenity).split('|')[1]
amenity=levenFor(keys_to_check,amenity).split('|')[0]
}
// sendTextMessage(recipientID,'amenities received '+entities.amenities[0].value)
}


if(!cat && !loc && !cus && !amen){
levenForAll(recipientID,message);
}


if(cat && loc && cus && amen){
  sendTextMessage(recipientID,'send '+cat_final+' in '+loc_final+' with '+amen_final+' that serves '+cus_final)

}else if(cat && loc && cus){
  switch(cat_final){
    case 'top_rest':
    switch(cus_final){
      case 'cuisines':
              if(set_key){
                                      params=[{ "content_type":"text",
                                                "title":"Yes",
                                                "payload":'cuis_loca|'+cuisine+'|'+location

                                      },
                                      {
                                         "content_type":"text",
                                          "title":"No",
                                           "payload":"no|nothing"
                                        }
                                      ];
                                      text='Did you mean Top restaurants that serves '+cuisine+' in '+location
                                      sendQuickReplyAsISay(recipientID,params,text);

                                  } 
                                  else{
                                    sendTopRestaurantsForACuisineInALocation(recipientID,cuisine,location);
                                  }

      break;
      case 'dishes':
       if(set_key){
                              params=[{ "content_type":"text",
                                        "title":"Yes",
                                        "payload":'loc_dish|'+cuisine+'|'+location

                              },
                              {
                                 "content_type":"text",
                                  "title":"No",
                                   "payload":"no|nothing"
                                }
                              ];
                              text='Did you mean Top restaurants that serves '+cuisine+' in '+location
                              sendQuickReplyAsISay(recipientID,params,text);

                          } 
                          else{
                            sendTopRestaurantsForADishInALocation(recipientID,cuisine,location);
                          }
      break;
      default:
      sendCuisineQuestion(cuisine,recipientID)
    }                    
    break;
  }
  // sendTextMessage(recipientID,'send '+cat_final+' in '+loc_final+' that serves '+cus_final)

}else if(cat && loc && amen){
  switch(cat_final){
    case 'top_rest':
    switch(loc_final){
      case 'location':
      switch(amen_final){
        case 'amenities':

if(set_key){
                  params=[{ "content_type":"text",
                            "title":"Yes",
                            "payload":'rest_loc_ame|'+location+'|'+amenity

                  },
                  {
                     "content_type":"text",
                      "title":"No",
                       "payload":"no|nothing"
                    }
                  ];
                  text='Did you mean Top Restaurants in '+location+' with '+amenity
                  sendQuickReplyAsISay(recipientID,params,text);

              } 
              else{
                sendRestInLocationWithAmenity(recipientID,location,amenity);
              }            

        break;
      }
      break;
    }
    break;
    default:
  sendTextMessage(recipientID,'send '+cat_final+' in '+loc_final+' with '+amen_final)
   
  }
 
}else if(cat && loc){
switch(cat_final){
      case 'top_dishes':
                switch(loc_final){
                  case 'location':
                      if(set_key){
                          params=[{ "content_type":"text",
                                    "title":"Yes",
                                    "payload":'yes|dish_loc|'+location

                          },
                          {
                             "content_type":"text",
                              "title":"No",
                               "payload":"no|nothing"
                            }
                          ];
                          text='Did you mean Top dishes in '+location
                          sendQuickReplyAsISay(recipientID,params,text);

                      } 
                      else{
                        sendTopDishesInALocation1(recipientID,location,location,location,location);
                      }              
                  break;
                  case 'rests':
                  if(set_key){
                          params=[{ "content_type":"text",
                                    "title":"Yes",
                                    "payload":'yes|dish_rest|'+location

                          },
                          {
                             "content_type":"text",
                              "title":"No",
                               "payload":"no|nothing"
                            }
                          ];
                          text='Did you mean Top dishes in '+location
                          sendQuickReplyAsISay(recipientID,params,text);

                      } 
                      else{
                        sendTopDishesInARest1(location,recipientID);
                      }

                  break;
                  case 'cuisines':
                    if(set_key){
                          params=[{ "content_type":"text",
                                    "title":"Yes",
                                    "payload":'yes|dish_cuis|'+location

                          },
                          {
                             "content_type":"text",
                              "title":"No",
                               "payload":"no|nothing"
                            }
                          ];
                          text='Did you mean Top dishes in '+location
                          sendQuickReplyAsISay(recipientID,params,text);

                      } 
                      else{
                        sendTopDishesFromCuisine(location,recipientID);
                      }
                 break;
                  default:
                sendTextMessage(recipientID,'What do you want in '+location+' !')
                }
               
      break;
      case 'top_rest':
                switch(loc_final){
                  case 'location':
                  if(set_key){
                          params=[{ "content_type":"text",
                                    "title":"Yes",
                                    "payload":'yes|rest_loc|'+location

                          },
                          {
                             "content_type":"text",
                              "title":"No",
                               "payload":"no|nothing"
                            }
                          ];
                          text='Did you mean Top Restaurants in '+location
                          sendQuickReplyAsISay(recipientID,params,text);

                      } 
                      else{
                        sendTopRestaurantsInALocation1(recipientID,location,location,location,location);
                      }
                  break;
                  case 'cuisines':
                  if(set_key){
                          params=[{ "content_type":"text",
                                    "title":"Yes",
                                    "payload":'show_rest|'+location
 
                          },
                          {
                             "content_type":"text",
                              "title":"No",
                               "payload":"no|nothing"
                            }
                          ];
                          text='Did you mean Top Restaurants in '+location+' Cuisine'
                          sendQuickReplyAsISay(recipientID,params,text);

                      } 
                      else{
                        sendTopRestaurantsForACuisine(recipientID,location);
                      }
                  break;
                  default:
                   params=[{
                              "content_type":"text",
                              "title":"Top dishes",
                              "payload":'rest|'+location
                            },{
                              "content_type":"text",
                              "title":"Amenities",
                              "payload":'rest_ameni|'+location
                            },
                            {
                              "content_type":"text",
                              "title":"Cuisines",
                              "payload":'rest_cuisines|'+location
                            }
                        ];
                          text='What do you want from '+location
                          sendQuickReplyAsISay(recipientID,params,text);
                break;
                }
                
        break;
  case 'top_cuisines':
                  switch(loc_final){
                    case 'location':
                    if(set_key){
                          params=[{ "content_type":"text",
                                    "title":"Yes",
                                    "payload":'yes|cuis_loc|'+location
 
                          },
                          {
                             "content_type":"text",
                              "title":"No",
                               "payload":"no|nothing"
                            }
                          ];
                          text='Did you mean Top Cuisines in '+location
                          sendQuickReplyAsISay(recipientID,params,text);

                      } 
                      else{
                        sendTopCuisinesInALocation1(recipientID,location);
                      }
                     break;
                     default:
                     sendTextMessage(recipientID,'What do you want in '+location+' !')
                  
                  }
  break;
default:
  sendTextMessage(recipientID,'send '+cat_final+' in '+loc_final)
}
}else if(cat && cus){
  switch(cat_final){
    case 'top_rest':
    switch(cus_final){
      case 'cuisines':
if(set_key){
                                      params=[{ "content_type":"text",
                                                "title":"Yes",
                                                "payload":'show_rest|'+cuisine

                                      },
                                      {
                                         "content_type":"text",
                                          "title":"No",
                                           "payload":"no|nothing"
                                        }
                                      ];
                                      text='Did you mean Top restaurants in '+cuisine
                                      sendQuickReplyAsISay(recipientID,params,text);

                                  } 
                                  else{
                                    sendTopRestaurantsForACuisine(recipientID,cuisine);
                                  }

      break;
      case 'dishes':
       if(set_key){
                              params=[{ "content_type":"text",
                                        "title":"Yes",
                                        "payload":'dish|'+cuisine

                              },
                              {
                                 "content_type":"text",
                                  "title":"No",
                                   "payload":"no|nothing"
                                }
                              ];
                              text='Did you mean Top restaurants that serves '+cuisine
                              sendQuickReplyAsISay(recipientID,params,text);

                          } 
                          else{
                            sendTopRestaurantsForADish(cuisine,recipientID);
                          }
      break;
      case 'amenities':
      if(set_key){
               params=[{ "content_type":"text",
                           "title":"Yes",
                            "payload":'amenities|'+cuisine
 
                          },
                          {
                             "content_type":"text",
                              "title":"No",
                               "payload":"no|nothing"
                            }
                          ];
                          text='Did you mean Top restaurants with '+cuisine
                          sendQuickReplyAsISay(recipientID,params,text);

                      } 
                      else{
                        sendTopRestaurantsForAmenitiy(recipientID,cuisine);
                      }
      break;
      default:
      sendCuisineQuestion(cuisine,recipientID)
    }
    break;
   case 'top_dishes':
                     switch(cus_final)
                            {
                            case 'cuisines':
                                             if(set_key){
                                                      params=[{ "content_type":"text",
                                                                "title":"Yes",
                                                                "payload":'yes|dish_cuis|'+cuisine

                                                      },
                                                      {
                                                         "content_type":"text",
                                                          "title":"No",
                                                           "payload":"no|nothing"
                                                        }
                                                      ];
                                                      text='Did you mean Top dishes in '+cuisine
                                                      sendQuickReplyAsISay(recipientID,params,text);

                                                  } 
                                                  else{
                                                    sendTopDishesFromCuisine(cuisine,recipientID);
                                                  }
                              }
     break; 
  case 'top_cuisines':
                  switch(cus_final){
                    case 'location':
                    if(set_key){
                          params=[{ "content_type":"text",
                                    "title":"Yes",
                                    "payload":'yes|cuis_loc|'+location
 
                          },
                          {
                             "content_type":"text",
                              "title":"No",
                               "payload":"no|nothing"
                            }
                          ];
                          text='Did you mean Top Cuisines in '+location
                          sendQuickReplyAsISay(recipientID,params,text);

                      } 
                      else{
                        sendTopCuisines(recipientID);
                      }
                     break;
                     default:
                     sendCuisineQuestion(recipientID,cus_final)
                  
                  }
  break;
default:
  sendTextMessage(recipientID,'send '+cat_final+' that serves '+cus_final)
}
}else if(cat && amen){
switch(cat_final){
  case 'top_rest':
  if(set_key){
               params=[{ "content_type":"text",
                           "title":"Yes",
                            "payload":'amenities|'+amenity
 
                          },
                          {
                             "content_type":"text",
                              "title":"No",
                               "payload":"no|nothing"
                            }
                          ];
                          text='Did you mean Top restaurants with '+amenity
                          sendQuickReplyAsISay(recipientID,params,text);

                      } 
                      else{
                        sendTopRestaurantsForAmenitiy(recipientID,amenity);
                      }
  break;
  default:
  sendTextMessage(recipientID,'send '+cat_final+' with '+amen_final)
}


}else if(loc){
switch(loc_final){
                  case 'location':
                  sendOptionsLocation(recipientID,location)
                  break;       
                  case 'rests':
                  sendOptionsRest(recipientID,location)
                  break;
                  case 'cuisines':
                  sendOptionsCuisines(recipientID,location)
                  break;
                  default:
                sendTextMessage(recipientID,'What do you want in '+location+' !')
                  }       

}else if(cat){
sendTextMessage(recipientID,'categro only')
}else if(cus){
switch(cus_final){
      case 'cuisines':
if(set_key){
                                      params=[{ "content_type":"text",
                                                "title":"Yes",
                                                "payload":'show_rest|'+cuisine

                                      },
                                      {
                                         "content_type":"text",
                                          "title":"No",
                                           "payload":"no|nothing"
                                        }
                                      ];
                                      text='Did you mean Top restaurants in '+cuisine
                                      sendQuickReplyAsISay(recipientID,params,text);

                                  } 
                                  else{
                                    sendTopRestaurantsForACuisine(recipientID,cuisine);
                                  }

      break;
      case 'dishes':
       if(set_key){
                              params=[{ "content_type":"text",
                                        "title":"Yes",
                                        "payload":'dish|'+cuisine

                              },
                              {
                                 "content_type":"text",
                                  "title":"No",
                                   "payload":"no|nothing"
                                }
                              ];
                              text='Did you mean Top restaurants that serves '+cuisine
                              sendQuickReplyAsISay(recipientID,params,text);

                          } 
                          else{
                            sendTopRestaurantsForADish(cuisine,recipientID);
                          }
      break;
      default:
      sendCuisineQuestion(cuisine,recipientID)
    }}
else if (amen){
sendOptionsAmenity(recipientID)
}







return Promise.resolve()

// if(!location && !cat){
//   levenForAll(recipientID,message);
// }


// if(sessions[sessionId].hasOwnProperty('location'))
//   context.location=sessions[sessionId].location

// if(sessions[sessionId].hasOwnProperty('cat'))
//   context.cat=sessions[sessionId].cat

// if(location){
//   sessions[sessionId].location=location
//   context.location=location
// }

// if(cat){
//   sessions[sessionId].cat=cat
//   context.cat=cat
// }

// if(user){
//   if(user.hasOwnProperty('location')){  
//     context.location=user.location
//   }
//   if(user.hasOwnProperty('cat')){  
//     context.cat=user.cat
//   }
// }
// if(!location===undefined){
//   context.location=location;
// sessions[sessionId].location=context.location;
// }

// if(!cat===undefined){
//   context.cat=cat;
//   sessions[sessionId].cat=context.cat;
// }
// if(context.cat){
//   if(!context.location)
//   {
//     context.missinglocation=true;
// sessions[sessionId].cat=context.cat;
// sendTextMessage(recipientID,JSON.stringify(context))
// return Promise.resolve(context);
// }}

// else {
//   if(context.location){
// context.missingcat=true
// sessions[sessionId].location=context.location;
// return Promise.resolve(context);   
// }
// }






 if (context.hasOwnProperty("location") && context.hasOwnProperty("cat")) {
    delete sessions[sessionId].location;
    delete sessions[sessionId].cat;
      top_dishes=['top dishes','top dish','best dishes','best dish','good dishes','good dish','special dishes','special dish','awesome dishes','awesome dish','superb dishes','superb dish','tasty dishes','tasty dish','great dishes','great dish','excellent dishes','excellent dish','beautiful dishes','beautiful dish','amazing dishes','amazing dish','goto dishes','goto dish','top notch dishes','top notch dish'];
      top_rest=['top restaurants','best restaurants','good restaurants','special restaurants','awesome restaurants','great restaurants','amazing restaurants','top restaurant','best restaurant','good restaurant','special restaurant','awesome restaurant','great restaurant','amazing restaurant']
      top_cuisines=['top cuisines','best cuisines','special cuisines','awesome cuisines','top cuisine','best cuisine','special cuisine','awesome cuisine']
                    if(top_dishes.indexOf((context.cat).toLowerCase())>=0)
                    {selected='top dishes'  }
                    else if(top_rest.indexOf((context.cat).toLowerCase())>=0 ){
                    selected='top restaurants'
                    }else if(top_cuisines.indexOf((context.cat).toLowerCase())>=0){ 
                    selected='top cuisines'
                          }
                      switch(selected){
                      case 'top dishes':
                     checkWhetherLocationOrRest(context.location,recipientID);
                     context={}
                     context.complet='You Request completed';
                     return Promise.resolve(context)
                      break;
                      case 'top restaurants':
                    sendTopRestaurantsInALocation1(recipientID,context.location,context.location,context.location,context.location);
                    context={}
                    return Promise.resolve(context);
                      break;
                      case 'top cuisines':
                         context={}
                     context.complet='You Request completed';
                     sendTopCuisines(recipientID);
                     context={}
                      return Promise.resolve(context);
                      break;}
                    }

      levenForAll(recipientID,message);
     // sendTextMessage(recipientID,'reached end')

                    return Promise.resolve(context); 

    }

     else {
      console.error('Oops! Couldn\'t find user for session:', sessionId);
    }
  },

getDish({text,sessionId,entities,context}) {
    if (sessionId) {
 var user=sessions[sessionId];
 var recipientID=sessions[sessionId].fbid;
 var dish = firstEntityValue(entities, 'dish')
var intent = firstEntityValue(entities, 'intent') 

if(dish){

//sendTextMessage(recipientID,"searching for dish"+dish);
sendTopRestaurantsForADish(recipientID,dish);


}

    }

     else {
      console.error('Oops! Couldn\'t find user for session:', sessionId);
    }
  },

showThingsInALocation1({text,sessionId,entities,context}) {
    if (sessionId) {
 var context=sessions[sessionId].context;
 var user=sessions[sessionId];
 var message=text
 var recipientID=sessions[sessionId].fbid;
 var location = firstEntityValue(entities, 'location')
sendTextMessage(recipientID,'Context: '+JSON.stringify(context))
sendTextMessage(recipientID,'Entities: '+JSON.stringify(entities))
 var cat = firstEntityValue(entities, 'cat')
 var intent = firstEntityValue(entities, 'intent') 

if((context.location) && (context.cat)){
//  sendTextMessage(recipientID,'hi in location & cat module')
  //context.location=location
  //context.cat=cat
  top_dishes=['top dishes','top dish','best dishes','best dish','good dishes','good dish','special dishes','special dish','awesome dishes','awesome dish','superb dishes','superb dish','tasty dishes','tasty dish','great dishes','great dish','excellent dishes','excellent dish','beautiful dishes','beautiful dish','amazing dishes','amazing dish','goto dishes','goto dish','top notch dishes','top notch dish'];
  top_rest=['top restaurants','best restaurants','good restaurants','special restaurants','awesome restaurants','great restaurants','amazing restaurants','top restaurant','best restaurant','good restaurant','special restaurant','awesome restaurant','great restaurant','amazing restaurant']
top_cuisines=['top cuisines','best cuisines','special cuisines','awesome cuisines','top cuisine','best cuisine','special cuisine','awesome cuisine']
  if(top_dishes.indexOf((context.cat).toLowerCase())>=0)
  {selected='top dishes'  }
else if(top_rest.indexOf((context.cat).toLowerCase())>=0 ){
  selected='top restaurants'
}else if(top_cuisines.indexOf((context.cat).toLowerCase())>=0){ 
selected='top cuisines'
}
sendTextMessage(recipientID,'Outgoing Context: '+JSON.stringify(context))
sendTextMessage(recipientID,'Selected Category: '+selected)
  switch(selected){
  case 'top dishes':
  sessions[sessionId].context=context
return checkWhetherLocationOrRest(context.location,recipientID).then(Promise.resolve())
  break;
  case 'top restaurants':
  sessions[sessionId].context=context
return sendTopRestaurantsInALocation1(recipientID,context.location,context.location,context.location,context.location).then(Promise.resolve())
  break;
  case 'top cuisines':
  sessions[sessionId].context=context

return sendTopCuisines(recipientID).then(Promise.resolve())
  break;
 }


return Promise.resolve()
}

// else if ((context.location && context.missingcat)) {
//  sendTextMessage(recipientID,'hi in second category module')
 
// if(context.location && context.missingcat){
//   //context.location=location
//   //context.cat=cat
//   top_dishes=['top dishes','top dish','best dishes','best dish','good dishes','good dish','special dishes','special dish','awesome dishes','awesome dish','superb dishes','superb dish','tasty dishes','tasty dish','great dishes','great dish','excellent dishes','excellent dish','beautiful dishes','beautiful dish','amazing dishes','amazing dish','goto dishes','goto dish','top notch dishes','top notch dish'];
//   top_rest=['top restaurants','best restaurants','good restaurants','special restaurants','awesome restaurants','great restaurants','amazing restaurants','top restaurant','best restaurant','good restaurant','special restaurant','awesome restaurant','great restaurant','amazing restaurant']
// top_cuisines=['top cuisines','best cuisines','special cuisines','awesome cuisines','top cuisine','best cuisine','special cuisine','awesome cuisine']
//   if(top_dishes.indexOf((context.cat).toLowerCase())>=0)
//   {selected='top dishes'  }
// else if(top_rest.indexOf((context.cat).toLowerCase())>=0 ){
//   selected='top restaurants'
// }else if(top_cuisines.indexOf((context.cat).toLowerCase())>=0){ 
// selected='top cuisines'
// }
// sendTextMessage(recipientID,JSON.stringify(context))
// sendTextMessage(recipientID,selected)
//   switch(selected){
//   case 'top dishes':
//   sessions[sessionId].context=context
// return checkWhetherLocationOrRest(context.location,recipientID).then(Promise.resolve())
//   break;
//   case 'top restaurants':
//   sessions[sessionId].context=context
// return sendTopRestaurantsInALocation(context.location,recipientID).then(Promise.resolve())
//   break;
//   case 'top cuisines':
//   sessions[sessionId].context=context

// return sendTopCuisines(recipientID).then(Promise.resolve())
//   break;
//  }
// }
// return Promise.resolve()
//         }



// else if ((context.cat && context.missinglocation)) {
//    sendTextMessage(recipientID,'hi in third category module')

// if(context.location && context.cat){
//   //context.location=location
//   //context.cat=cat
//   top_dishes=['top dishes','top dish','best dishes','best dish','good dishes','good dish','special dishes','special dish','awesome dishes','awesome dish','superb dishes','superb dish','tasty dishes','tasty dish','great dishes','great dish','excellent dishes','excellent dish','beautiful dishes','beautiful dish','amazing dishes','amazing dish','goto dishes','goto dish','top notch dishes','top notch dish'];
//   top_rest=['top restaurants','best restaurants','good restaurants','special restaurants','awesome restaurants','great restaurants','amazing restaurants','top restaurant','best restaurant','good restaurant','special restaurant','awesome restaurant','great restaurant','amazing restaurant']
// top_cuisines=['top cuisines','best cuisines','special cuisines','awesome cuisines','top cuisine','best cuisine','special cuisine','awesome cuisine']
//   if(top_dishes.indexOf(context.cat.toLowerCase())>=0)
//   {selected='top dishes'  }
// else if(top_rest.indexOf(context.cat.toLowerCase())>=0 ){
//   selected='top restaurants'
// }else if(top_cuisines.indexOf(context.cat.toLowerCase())>=0){ 
// selected='top cuisines'
// }
// sendTextMessage(recipientID,JSON.stringify(context))
// sendTextMessage(recipientID,selected)
//   switch(selected){
//   case 'top dishes':
//   sessions[sessionId].context=context
// return checkWhetherLocationOrRest(context.location,recipientID).then(Promise.resolve())
//   break;
//   case 'top restaurants':
//   sessions[sessionId].context=context
// return sendTopRestaurantsInALocation(context.location,recipientID).then(Promise.resolve())
//   break;
//   case 'top cuisines':
//   sessions[sessionId].context=context

// return sendTopCuisines(recipientID).then(Promise.resolve())
//   break;
//  }

// }

// return Promise.resolve()
//         }

else {
      levenForAll(recipientID,message);
      return Promise.resolve(); 
      }
}     
else {
      console.error('Oops! Couldn\'t find user for session:', sessionId);
    }
},


getTopRests(response){
if (response) {
 var user=sessions[response['sessionId']];
 
  var recipientID=user.fbid;
  var message=response['text']
  var entities=response['entities']
  var context=response['context']
 var intent = firstEntityValue(entities, 'intent')
 var dish = firstEntityValue(entities, 'dish')
 if(dish){
  sendTopDishesInARest1(dish,recipientID);
 }


  }

  },
};





const wit = new Wit({
  accessToken: WIT_TOKEN,
  actions,
  logger: new log.Logger(log.INFO)
});



//testing for git 
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'yalibot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;
      // Iterate over each messaging event
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.message)
          receivedMessage(messagingEvent);
        else if (messagingEvent.postback)
          receivedPostback(messagingEvent);
         else 
          console.log("Webhook received unknown messagingEvent: ");
        
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've 
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
});

function receivedQuickReply(event,quick_payload) {
var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  const sessionId = findOrCreateSession(senderID);
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;
if(globalarray.hasOwnProperty(senderID)){
console.log(globalarray)
}else{
   globalarray[senderID]={stat:false,loc1:'',loc2:'',loc3:'',loc4:'',rest_stack:[],dish_stack:[],res_name:'',dish_name:''}

}
  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
switch(event.postback.payload.split('|')[0])
{
   case 'crd':
    sendTopDishesInARestForACuisine(senderID,event.postback.payload.split('|')[1],event.postback.payload.split('|')[2])
    break;
  case 'cui_dish':
  sendTopDishesFromCuisine(event.postback.payload.split('|')[1],senderID);
  break;
  case 'choosing_rest':
  sendRestQuickMessage(senderID);
  break;
  case 'choosing_cuisine':
  sendCuisineMessage(senderID);
  break;
  case 'cuisine_yes':
  if(globalarray.hasOwnProperty(senderID))
  globalarray[senderID].payload_array='cuisine_yes2';
else{
globalarray[senderID]={stat:false,loc1:'',loc2:'',loc3:'',loc4:'',rest_stack:[],dish_stack:[],res_name:'',dish_name:''}
  globalarray[senderID].payload_array='cuisine_yes2';
}
  sendCuisineQuestion(senderID);
  break;
  case 'cuisine_yes2':
  sendTopDishesFromCuisine(event.postback.payload.split('|')[1],senderID);
  break;
  
  case 'cuisine_no':
  sendTopCuisines(senderID);
  break;
 
  case 'choosing_aspects':
  sendAspects(senderID);
  break;
  case 'choosing_aspect':
  switch(event.postback.payload.split('|')[1])
  {
      case 'service':
      if(globalarray[senderID].hasOwnProperty('locationset'))
          {
       globalarray[senderID].location_checker='service'
      sendBestServiceRestaurants(senderID,globalarray[senderID].loc1,globalarray[senderID].loc2,globalarray[senderID].loc3,globalarray[senderID].loc4);
      break;
                }
                      sendShowMeHow(senderID);
            globalarray[senderID].location_checker='service'
      break;
      case 'value':
      if(globalarray[senderID].hasOwnProperty('locationset'))
        {
            globalarray[senderID].location_checker='value'
      sendBestValueRestaurants(senderID,globalarray[senderID].loc1,globalarray[senderID].loc2,globalarray[senderID].loc3,globalarray[senderID].loc4);
          break;
        }
          sendShowMeHow(senderID);
          globalarray[senderID].location_checker='value';
     
      break;
      case 'food':
      if(globalarray[senderID].hasOwnProperty('locationset'))
        {
      globalarray[senderID].location_checker='food'
      sendBestFoodRestaurants(senderID,globalarray[senderID].loc1,globalarray[senderID].loc2,globalarray[senderID].loc3,globalarray[senderID].loc4);
          break;
        }
      sendShowMeHow(senderID);
          globalarray[senderID].location_checker='food';
          
      break;
      case 'ambience':
      if(globalarray[senderID].hasOwnProperty('locationset'))
        {
      globalarray[senderID].location_checker='ambience'
      sendBestAmbienceRestaurants(senderID,globalarray[senderID].loc1,globalarray[senderID].loc2,globalarray[senderID].loc3,globalarray[senderID].loc4);
          break;
        }
         sendShowMeHow(senderID);
          globalarray[senderID].location_checker='ambience';    
      break;
  }
  break;
  case 'show_me_how':
  sendTextMessage(senderID,"GIF attachment comes here");
  break;
  case 'rest_yes':
  globalarray[senderID].payload_array='rest_yes';
  sendRestQuestion(senderID);
  break;
  case 'rest_no':
  if(globalarray[senderID].hasOwnProperty('locationset'))
  {
  sendTopRestaurantsInALocation1(senderID,globalarray[senderID].loc1,globalarray[senderID].loc2,globalarray[senderID].loc3,globalarray[senderID].loc4);
  break;
  }
  else
    sendShowMeHow(senderID);
    location_checker='rest'
    break;
    //sendTopRestaurantsInALocation('chennai',senderID);  
case 'loc_dish':
  sendTopRestaurantsForADishInALocation(senderID,event.postback.payload.split('|')[1],event.postback.payload.split('|')[2])
  break;
  case 'cuis_loca':
  // sendTextMessage(senderID,event.postback.payload.split('|')[1])
  sendTopRestaurantsForACuisineInALocation(senderID,event.postback.payload.split('|')[1],event.postback.payload.split('|')[2])
  break;
  case 'show_rest':
  // sendTextMessage(senderID,event.postback.payload.split('|')[1])
  sendTopRestaurantsForACuisine(senderID,event.postback.payload.split('|')[1])
  break;
  case 'dish':
  globalarray[senderID].dish_stack.push(event.postback.payload.split('|')[0])
  sendTopRestaurantsForADish(event.postback.payload.split('|')[1],senderID);
  break;
  case 'Take_dish':
  takeMeThere(senderID,event.postback.payload.split('|')[1]);
  break;
  case 'cuisine':
  sendTopDishesFromCuisine(event.postback.payload.split('|')[1],senderID);
  break;
  case 'rest':
  sendTopDishesInARest1(event.postback.payload.split('|')[1],senderID);
  break;
    case 'location':
  sendTopRestaurantsInALocation1(senderID,event.postback.payload.split('|')[1],event.postback.payload.split('|')[1],event.postback.payload.split('|')[1],event.postback.payload.split('|')[1]);
  break;
  case 'choosing_dish':
  sendDishQuickMessage(senderID);
  break;
  case 'send_hi':
  sendHiMessage(senderID);
  break;
  case 'res_cuisine':
  sendMoreRestCuisine(event.postback.payload.split('|')[1],senderID)
  break;
  case 'dish_yes':
  globalarray[senderID].payload_array='dish_yes';
  sendDishQuestion(senderID);
  break;
  case 'dish_no':
  if(globalarray[senderID].hasOwnProperty('locationset'))
  {
    sendTopDishesInALocation1(senderID,globalarray[senderID].loc1,globalarray[senderID].loc2,globalarray[senderID].loc3,globalarray[senderID].loc4);
  break;
  }
  else
    sendShowMeHow(senderID);
    location_checker='dish'
    break;
  

  

  default:
  sendTextMessage(senderID,'Try Something like Show/Send top rests/dishes from location/rests');
}
  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  
}




function receivedMessage(event) {
  var senderID = event.sender.id;

if(globalarray.hasOwnProperty(senderID)){
 console.log(globalarray)
}
else{
  globalarray[senderID]={message:[],stat:false,loc1:'',loc2:'',loc3:'',loc4:'',rest_stack:[],cuisine_stack:[],dish_stack:[],res_name:'',dish_name:''}
}

  const sessionId= findOrCreateSession(senderID);
  var message = event.message;
  var messageText = message.text;

 if(message.quick_reply){
  if(message.quick_reply.payload){
  switch(message.quick_reply.payload.split('|')[0]){
    case 'no':
    sendTextMessage(senderID,'sORrY aM sTiLl a lEaRNiNg bOT. \n Try Something like Show/Send top rests/dishes from location/rests')
    break;
    case 'dish_location':
                if(globalarray[senderID].hasOwnProperty('locationset'))
              {
                sendTopRestaurantsThatServesInALocation1(senderID,globalarray[senderID].loc1,globalarray[senderID].loc2,globalarray[senderID].loc3,globalarray[senderID].loc4,message.quick_reply.payload.split('|')[1])
                break;
              }
              else
                sendShowMeHow(senderID);
                location_checker='dish'
    break;

    case 'loc_dish':
  sendTopRestaurantsForADishInALocation(senderID,message.quick_reply.payload.split('|')[1],message.quick_reply.payload.split('|')[2])
  break;
    case 'cuis_loca':
  sendTopRestaurantsForACuisineInALocation(senderID,message.quick_reply.payload.split('|')[1],message.quick_reply.payload.split('|')[2])
  break;
    case 'show_rest':
  //sendTextMessage(senderID,message.quick_reply.payload.split('|')[1])
  sendTopRestaurantsForACuisine(senderID,message.quick_reply.payload.split('|')[1])
  break;
    case 'rest':
             sendTopDishesInARest1(message.quick_reply.payload.split('|')[1],senderID)
    break;
    case 'rest_ameni':
             sendAminitiesOfARestaurants(senderID,message.quick_reply.payload.split('|')[1])
    break;


    case 'rest_cuisines':
      sendCuisineForARest(senderID,message.quick_reply.payload.split('|')[1])
    break;
    case 'dish':
             sendTopRestaurantsForADish(message.quick_reply.payload.split('|')[1],senderID)
    break;
    case 'cuisine':
             sendTopDishesFromCuisine(message.quick_reply.payload.split('|')[1],senderID)
    break;
    case 'amenities':
            sendTopRestaurantsForAmenitiy(senderID,message.quick_reply.payload.split('|')[1])
   break;
   case 'location_dish':
   sendTopDishesInALocation1(senderID,message.quick_reply.payload.split('|')[1],message.quick_reply.payload.split('|')[1],message.quick_reply.payload.split('|')[1],message.quick_reply.payload.split('|')[1])
break;
    case 'location':
            sendTopDishesInALocation1(message.quick_reply.payload.split('|')[1],message.quick_reply.payload.split('|')[1],message.quick_reply.payload.split('|')[1],message.quick_reply.payload.split('|')[1],senderID)
    break;
   








   case 'rest_loc_ame':
sendRestInLocationWithAmenity(senderID,message.quick_reply.payload.split('|')[1],message.quick_reply.payload.split('|')[2])
   break;
   case 'yes':
   switch(message.quick_reply.payload.split('|')[1]){
    case 'dish_loc':
    locat=message.quick_reply.payload.split('|')[2]
    sendTopDishesInALocation1(senderID,locat,locat,locat,locat);
    break;
    case 'dish_rest':
    resta=message.quick_reply.payload.split('|')[2]
    sendTopDishesInARest1(resta,senderID)
    break;
    case 'dish_cuis':
    cuis=message.quick_reply.payload.split('|')[2]
    sendTopDishesFromCuisine(cuis,senderID)
    break;
    case 'rest_loc':
    locat=message.quick_reply.payload.split('|')[2]
    sendTopRestaurantsInALocation1(senderID,locat,locat,locat,locat)
    break;
    case 'rest_cuis':
    cuis=message.quick_reply.payload.split('|')[2]
    // sendTopCuisines(senderID)
    sendTopRestaurantsForACuisine(senderID,cuis) 
    break;
    case 'cuis_loc':
    locat=message.quick_reply.payload.split('|')[2]
    sendTopCuisinesInALocation1(senderID,locat)
    break;
    
   }
   break;
   case 'location_rest':
    locat=message.quick_reply.payload.split('|')[1]
   sendTopRestaurantsInALocation1(senderID,locat,locat,locat,locat)
   break; 
   






    default:
           sendTextMessage(senderID,'Try Something else '+message.quick_reply.payload.split('|')[1])
    break;
} 
  }return 0
 }

  var messageAttachments = message.attachments;

  //  wit.runActions(
  //             sessionId, // the user's current session
  //             messageText, // the user's message
  //             sessions[sessionId].context // the user's current session state
  //           ).then((context) => {
  //             // Our bot did everything it has to do.
  //             // Now it's waiting for further messages to proceed.
  //             console.log('Waiting for next user messages');

  //             // Based on the session state, you might want to reset the session.
  //             // This depends heavily on the business logic of your bot.
  //             // Example:
  //             // if (context['done']) {
  //             //   delete sessions[sessionId];
  //             // }

  //             // Updating the user's current session state
  //             sessions[sessionId].context = context;
  //           })
  //           .catch((err) => {
  //             console.error('Oops! Got an error from Wit: ', err.stack || err);
  //           })
  // var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;
  var messageId = message.mid;

  // You may get a text or attachment but not both
// if(quick_payload){
//  console.log('inside if')
//  console.log(quick_payload[0].payload)
  // switch (quick_payload) {
 //    case 'yes_rest':
 //    receivedQuickReply(senderID,quick_payload);
 //    break;
 //    default:
 //    sendTextMessage(senderID,'quick_reply');
    // }

  if (messageText) {





    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    
    switch (messageText.toLowerCase()) {
      case 'add':
      persistentMenu();
      break;    
      case 'remove':
      removePersistentMenu();
      break;    
      
      case 'hey':
        sendHiMessage(senderID);
        break;
      case 'hello':
        sendHiMessage(senderID);
        break;
        case 'changelocation':
        setLocationForTopDishes(senderID);
        break;
        case 'whadup':
        sendHiMessage(senderID);
        break;
        case 'oye':
        sendHiMessage(senderID);
        break;
      case 'hi':
        sendHiMessage(senderID);
        break;
      case 'sup':
        sendHiMessage(senderID);
        break;
      case 'whatsup':
        sendHiMessage(senderID);
        break;
      case 'whaddup':
        sendHiMessage(senderID);
        break;
        default:
        check_payload_array(event);
        break;
    }
  } else if (messageAttachments) 
  {
 if(event.message.attachments[0].payload.coordinates)
locationMatcher(senderID,event);

}
}


function check_payload_array(event){
var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;
  if(globalarray[senderID].hasOwnProperty("payload_array")){
 switch(globalarray[senderID].payload_array)
 {
    case 'rest_yes':
     if(message.text==='Know a place'){
    //  sendTextMessage(senderID,'yes');
    }
    else{
    sendTopDishesInARest1(message.text,senderID);   
    delete globalarray[senderID].payload_array;
    }
    break;
    case 'dish_yes':
      if(globalarray[senderID].hasOwnProperty('payload_array'))
    delete globalarray[senderID].payload_array;
    sendTopRestaurantsForADish(message.text,senderID);  
    break;
    case 'cuisine_yes2':
     if(globalarray[senderID].hasOwnProperty('payload_array'))
    delete globalarray[senderID].payload_array;
    sendTopDishesFromCuisine(message.text,senderID);
    break;
    default:
    wit_assitance(event);
    break;
}
}
else
{
  wit_assitance(event);
}
}



function wit_assitance(event){
 var senderID = event.sender.id;
 const sessionId = findOrCreateSession(senderID);
  var message = event.message;
  var messageText = message.text;
   var messageAttachments = message.attachments;

if(data_refr.rests.hasOwnProperty(messageText)){
  globalarray[senderID].rest_stack.push(messageText);
  sendOptionsRest(senderID,messageText);
// sendTopDishesInARest(messageText,senderID)
}
else if(data_refr.dishes.hasOwnProperty(messageText.toLowerCase())){
sendOptionsDish(senderID,messageText);
//sendTopRestaurantsForADish(messageText,senderID)
}else if(data_refr.location.hasOwnProperty(messageText)){
sendOptionsLocation(senderID,messageText);
// sendTopRestaurantsInALocation1(senderID,messageText,messageText,messageText,messageText)
}else if(data_refr.cuisines.hasOwnProperty(messageText)){
sendOptionsCuisines(senderID,messageText);
// sendTopDishesFromCuisine(messageText,senderID)
}
else if(data_refr.amenities.hasOwnProperty(messageText)){
sendTextMessage(senderID,'amenity')
// sendOptionsAmenity(senderID,messageText);
// sendTopDishesFromCuisine(messageText,senderID)
}
else{
 wit.runActions(
          sessionId, // the user's current session
          messageText, // the user's message
          sessions[sessionId].context, // the user's current session state
    (error, context) => {
          if (error) {
            console.log('Oops! Got an error from Wit:', error);
          } else {
            // Our bot did everything it has to do.
            // Now it's waiting for further messages to proceed.
            console.log('Waiting for futher messages.');

            // Based on the session state, you might want to reset the session.
            // This depends heavily on the business logic of your bot.
            // Example:
            // if (context['done']) {
            //   delete sessions[sessionId];
            // }

            // Updating the user's current session state
            sessions[sessionId].context = context;
          }
        }
      );

}
   // wit.runActions(
   //            sessionId, // the user's current session
   //            messageText, // the user's message
   //            sessions[sessionId].context // the user's current session state
   //          ).then(function(context){
   //            console.log('Waiting for next user messages');
   //         sessions[sessionId].context = context;
   //          })
   //          .catch((err) => {
   //            console.error('Oops! Got an error from Wit: ', err.stack || err);
   //          })

}


function sendOptionsRest(sender,rest_na) {
    var messageData = {
      "text":"What do you want from there ?",
      "quick_replies":[{
          "content_type":"text",
          "title":"Top dishes",
          "payload":'rest|'+rest_na
        },{
          "content_type":"text",
          "title":"Amenities",
          "payload":'rest_ameni|'+rest_na
        },
        {
          "content_type":"text",
          "title":"Cuisines",
          "payload":'rest_cuisines|'+rest_na
        }
    ]
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};

function sendOptionsAmenity(sender,amentiy) {
    var messageData = {
      "text":"do you want ?",
      "quick_replies":[{
          "content_type":"text",
          "title":"Top restaurants",
          "payload":'ame_rest|'+amenity
        },{
          "content_type":"text",
          "title":"Rests in Location",
          "payload":'ame_rest_loc|'+amenity
        }
    ]
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};


function sendOptionsLocation(sender,loc_na) {
    var messageData = {
      "text":"What do You want from there ?",
      "quick_replies":[{
          "content_type":"text",
          "title":"Top Restaurants",
          "payload":'location_rest|'+loc_na
        },{
          "content_type":"text",
          "title":"Top Dishes",
          "payload":'location_dish|'+loc_na
        },
        {
          "content_type":"text",
          "title":"Top Cuisines",
          "payload":'yes|cuis_loc|'+loc_na
        }
    ]
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};



function sendOptionsDish(sender,dish_na) {
    var messageData = {
      "text":"Nice. So you are looking for "+dish_na+" what do you want with respect to "+dish_na+" ?",
      "quick_replies":[{
          "content_type":"text",
          "title":"Top Restaurants",
          "payload":'dish|'+dish_na
        },{
          "content_type":"text",
          "title":"Location",
          "payload":'dish_location|'+dish_na
        }
    ]
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};

function sendOptionsCuisines(sender,cuisine_na) {
    var messageData = {
      "text":"What do You want from that?",
      "quick_replies":[{
          "content_type":"text",
          "title":"Top Dishes",
          "payload":'cuisine|'+cuisine_na
        },{
          "content_type":"text",
          "title":"Top Restaurants",
          "payload":'show_rest|'+cuisine_na
        }
    ]
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};




// 1
function sendRestQuickMessage(sender) {
    sendTextMessage(sender,'Have a place in mind?\n\nWe will tell you the best things to order there and more.\n click – KNOW A PLACE\n\n Not sure where you wanna go? Click POPULAR RESTAURANTS Near You!\n')
    var messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Have a place in mind ? ",
                    "subtitle": "",
                    "buttons": [{
                        "type": "postback",
                        "title": " Know a place",
                        "payload": "rest_yes|yes"
                    }, {
                        "type": "postback",
                        "title": "Popular Restaurants",
                        "payload": "rest_no|no",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ')
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

};







// 1.1 payload Yes I Do!|Yes
function sendRestQuestion(sender) {
    var messageData = { "text":"Please type the name of the Restaurant..." }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ')
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};


// bestishes(rest_id) 

function sendTopDishesInARest(rest_id, sender) {
  var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  
  console.log('Query item inside: ' + rest_id)
  connection.query('select * from top_dishes where res_name="'+rest_id+'"',function(err,rows,fields){
              if(!err) {
            if(rows.length > 0){
                globalarray[sender].rest_stack.push(rest_id)
                sendTextMessage(sender,'These are the best dishes in '+rest_id)
               sendTopDishesInARestMessage(rows,sender);      }

              else{
                sendTextMessage(sender,"Sorry No Such Restaurant in our Database.");
                    levenForRest(sender,rest_id);
                delete globalarray[sender].payload_array;
            }
                        }
              else
                console.log('error');
  });
  connection.end({ timeout: 60000 });
}

function levenForRest(sender,rest_id){

var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){
    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  connection.query('select distinct res_name from top_dishes',function(err,rows,fields){
    if(!err) {
            if(rows.length > 0){
              var dict = [];
              count=0;
              while(rows.length>count)
              {
                val=leven(rows[count].res_name,rest_id)
              dict.push({
              key:   rows[count].res_name,
              value: val
              });
              count++;
              }
          

var arr=[];

limit=1;
cards=0;
while(arr.length<3){
cun=0;
while(dict.length>cun){
  if(cards===3)
    break;
        if(dict[cun].value===limit){
        arr.push(dict[cun]);
        cards++;
        }
        cun++;
}
limit++;
}   

cardForLeven(sender,arr);
         }
              else{
          sendTextMessage(sender,'Try Something Else -:n');
              }
    }
    else
      console.log('error');
  });
  connection.end({ timeout: 60000 });

}



function levenForAll(sender,rest_id){
var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){
    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  connection.query('select distinct dish_name from top_10_restaurants',function(err,rows,fields){
    if(!err) {
            if(rows.length > 0){
              var dict = [];
              var gen=[];
              count=0;
              while(rows.length>count)
              {
              val=leven(rows[count].dish_name,rest_id)
              dict.push({
              key:   rows[count].dish_name,
              value: val,
              });
              gen.push('dish');
              count++;
              }
connection.query('select distinct res_name from top_dishes',function(err,rows,fields){
    if(!err) {
        if(rows.length > 0){
          count=0;
              while(rows.length>count)
              {
                val=leven(rows[count].res_name,rest_id)
              dict.push({
              key:   rows[count].res_name,
              value: val
              });
              gen.push('rest');
              count++;
              }
            }  
  }
connection.query('select distinct location from top_rest',function(err,rows,fields){
    if(!err) {
        if(rows.length > 0){
          count=0;
              while(rows.length>count)
              {
                if(rows[count].location){
              val=leven(rows[count].location,rest_id)
              dict.push({
              key:   rows[count].location,
              value: val
              });
              gen.push('location');
              }
              count++;
              }
              sort_dict(dict,gen,sender);
              connection.end({ timeout: 60000 });
            }  
  }});

});





         }
              else{
          sendTextMessage(sender,'Try something else -:n');
              }
    }
    else
      console.log('error');
  });
  

}


function sort_dict(dict,gen,sender){
  var arr=[];
  var gen_sel=[];
  dont=false
limit=0;
cards=0;
while(arr.length<3){
cun=0;
while(dict.length>cun){
  if(cards===8)
    break;
        if(dict[cun].value===limit){
                        for(i=0;i<arr.length;i++){
                          if(dict[cun].key===arr[i].key){
                          dont=true
                          }
                        }
       if(dont){
        dont=false
       }else{       
        arr.push(dict[cun]);
        gen_sel.push(gen[cun]);
        cards++;
        }
           }
        cun++;
}
limit++;
}   
cardForLevenAll2(sender,gen_sel,arr);
}



function sort_dict1(dict,gen,sender){
  var arr=[];
  var gen_sel=[];
  dont=false
limit=0;
cards=0;
while(arr.length<3){
cun=0;
while(dict.length>cun){
  if(cards===3)
    break;
        if(dict[cun].value===limit){
                        for(i=0;i<arr.length;i++){
                          if(dict[cun].key===arr[i].key){
                          dont=true
                          }
                        }
       if(dont){
        dont=false
       }else{       
        arr.push(dict[cun]);
        gen_sel.push(gen[cun]);
        cards++;
        }
           }
        cun++;
}
limit++;
}   

switch(gen_sel[0]){
case 'rest':
sendTopDishesInARest1(arr[0].key,sender);
break;
case 'location':
sendTopDishesInALocation1(sender,arr[0].key,arr[0].key,arr[0].key,arr[0].key);
break;
case 'cuisine':
sendTopCuisines(sender);
}


}







function cardForLevenAll2(sender,gen_sel,arr){
var params=[]
    for(var i=0;i<arr.length;i++){
      params.push({
          "content_type":"text",
          "title":arr[i].key+" | "+gen_sel[i],
          "payload":gen_sel[i]+'|'+arr[i].key
        })
    }
    params.push({
         "content_type":"text",
          "title":"No I Dont!",
          "payload":'leven_no'+'|'+'leven'
    })
    var messageData = {
      "text":"Did you mean any of these ?",
      "quick_replies":params
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
      
}










function cardForLevenAll(sender,gen_sel,arr){
   cards_for_dishes=[];
   cards_for_dishes[0] ={
     "title": "Did you mean this???",
    "buttons": [{
        "type": "postback",
        "title": arr[0].key+" | "+gen_sel[0],
        "payload": gen_sel[0]+'|'+arr[0].key

    },{
        "type": "postback",
        "title": arr[1].key+" | "+gen_sel[1],
        "payload": gen_sel[1]+'|'+arr[1].key

    }, {
        "type": "postback",
        "title": arr[2].key+" | "+gen_sel[2],
        "payload": gen_sel[2]+'|'+arr[2].key
    }],
    }


    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ')
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
}

function cardForLeven(sender,arr){
  cards_for_dishes=[];
   cards_for_dishes[0] ={
     "title": "Did you mean this???",
    "buttons": [{
        "type": "postback",
        "title": arr[0].key,
        "payload": 'rest|'+arr[0].key

    },{
        "type": "postback",
        "title": arr[1].key,
        "payload": 'rest|'+arr[1].key

    }, {
        "type": "postback",
        "title": arr[2].key,
        "payload": 'rest|'+arr[2].key
    }],
    }


    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })

}
var foursquare_rating;
var zomato_rating;
//bestdishes(rest_id)->to card

function sendTopDishesInARestMessage(rows,sender) {
if(rows[0].f_rating===undefined)
  rat='N/A' 
  else
  rat=rows[0].f_rating+' '
if(rows[0].z_rating===undefined)
  zom='N/A' 
  else
  zom=rows[0].z_rating+' '
setTimeout(function(){

params=[ {      
          "content_type":"text",
          "title":"Zomato "+zom,
          "payload":"zom",
          "image_url":"http://lazylearners.in/img/icons/zomato.png"
        },{
          "content_type":"text",
          "title":"Yali "+rows[0].rating,
          "payload":"four",
          "image_url":"http://lazylearners.in/img/dishes/yali.jpg"
        },
        {
          "content_type":"text",
          "title":"Foursquare "+rat,
          "payload":"four",
          "image_url":"http://lazylearners.in/img/icons/fs.png"
        }
                ];
    sendQuickReplyAsISay(sender,params,'Yali is brining you ratings for '+globalarray[sender].rest_stack[globalarray[sender].rest_stack.length-1])
}, 3000);

cards_for_dishes=[]
 for(var i=0;i<rows.length;i++){
  var naa=rows[i].dish_name.split(' ').join('%20')
var path="http://lazylearners.in/img/dishes/"+naa+".jpg"
   cards_for_dishes[i] ={
     "title": rows[i].dish_name[0].toUpperCase()+rows[i].dish_name.substring(1),
    "subtitle": rows[i].pos+' Votes        '+rows[i].freq+' Reviews\n Foursquare '+rat+'      zomato '+zom,
   // "item_url":path,
    "image_url": path,
    "buttons": [{
        "type": "postback",
        "title": "Show similar rests",
        "payload": 'dish|'+rows[i].dish_name
    }, {
        "type": "web_url",
        "title": "Take me there",
        "url": 'http://maps.google.com/maps?q='+rows[i].coords.split(',')[0]+','+rows[i].coords.split(',')[1]
    }],
    }
}

 



    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
   





};


//1.1.1 when clicking Show similar rests input dish_id
function sendMoreRestaurantsForADish(sender,dish_id1)
{
var asdf=dish_id1.split('#')
dish_id=asdf[0]
globalarray[sender].dish_stack.push(dish_id);
var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  connection.query('select * from top_10_restaurants where dish_name="'+dish_id+'"',function(err,rows,fields){
    if(!err) {
            if(rows.length > 0){
              sendTextMessage(sender,'Yali is bringing you similar restaurants that serve the best '+dish_id)
              sendMoreRestaurantsForADishMessage(rows,sender);       
            }
              else{
                sendTextMessage(sender,"Sorry No Data Found! Please try another Dish");
                sendTopDishesInARest1(globalarray[sender].dish_stack[globalarray[sender].dish_stack.length-1],sender);
              }
    }
    else
      console.log('error');
  });
  connection.end({ timeout: 60000 });

}

function sendTopDishesInARest1(rest_id, sender) {
  var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  res_name=rest_id;
  console.log('Query item inside: ' + rest_id)
  connection.query('select * from (select *from dishes where res_name like "'+rest_id+'" group by dish_name order by pi desc limit 10) t1 left join (select *from restaurants where res_name like "'+rest_id+'" group by res_name) as t2 on t1.res_name=t2.res_name ;',function(err,rows,fields){
              if(!err) {
            if(rows.length > 0){
              sendTextMessage(sender,'Yali is brining you Best dishes in '+rest_id)
                globalarray[sender].rest_stack.push(rest_id)
               sendTopDishesInARestMessage(rows,sender,rest_id);      }
              else{
                sendTextMessage(sender,"Sorry no such Restaurant in our database.");
              sendTopRestaurantsForADish(globalarray[sender].dish_stack[globalarray[sender].dish_stack.length-1],sender);
              
            }
                        }
              else
                console.log('error');
  });
  connection.end({ timeout: 60000 });
}
function sendTopDishesInALocation(senderID,loc1,loc2,loc3,loc4){
  sendTextMessage(senderID,'what to show??')
}

function sendTopDishesInALocation1(sender,loc1,loc2,loc3,loc4) {
  var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  
  connection.query('select dish_name,res_name,freq,pos,pi,location,coords from dishes where location like "'+loc1+'" or location like "'+loc2+'" or location  like "'+loc3+'" or location like "'+loc4+'"  order by pi desc limit 10;',function(err,rows,fields){
    if(!err) {
if(rows.length > 0){
  sendTextMessage(sender,'These are the top dishes of different restaurants in '+loc1+'\nClick on the restaurant name to get more information')
                sendTopDishesInALocationMessage(rows,sender); 
                    }
            else{
                sendTextMessage(sender,"Sorry No Data Found from your location");
                sendHiMessage(sender);
            }
          }
    else
      console.log('error');
  });
  connection.end({ timeout: 60000 });
}

function sendTopDishesInALocationMessage(rows,sender) {
 cards_for_dishes=[];
 for(var i=0;i<rows.length;i++){
 var naa=rows[i].dish_name.split(' ').join('%20')
path="http://lazylearners.in/img/dishes/"+naa+".jpg"
   cards_for_dishes[i] ={
     "title": rows[i].dish_name[0].toUpperCase()+rows[i].dish_name.substring(1),
    "subtitle": rows[i].pos+' Votes\n '+rows[i].freq+' Reviews.',
     "image_url":path,
    "buttons": [{
        "type": "postback",
        "title": "Best Restaurants",
        "payload": 'dish|'+rows[i].dish_name
    }, {
        "type": "postback",
        "title": rows[i].res_name,
        "payload": 'rest|'+rows[i].res_name
    } ,{
        "type": "web_url",
        "title": "Take me there",
      "url": 'http://maps.google.com/maps?q='+rows[i].coords.split(',')[0]+','+rows[i].coords.split(',')[1]
    }],
    }
}

    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
};


function sendTopRestaurantsForAmenitiy(sender,amen) {
  var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  
  connection.query('select *from restaurants where res_name in (select res_name from aminities where a_name like "'+amen+'%" group by res_name) group by res_name order by z_rating desc limit 10;',function(err,rows,fields){
    if(!err) {
if(rows.length > 0){
  sendTextMessage(sender,'Yali is bringing you the restaurants that has '+amen)
                sendTopRestaurantsForAmenitiyMessage(rows,sender); 
                    }
            else{
                sendTextMessage(sender,"Sorry No Data Found from your location");
                sendHiMessage(sender);
            }
          }
    else
      console.log('error');
  });
  connection.end({ timeout: 60000 });
}

function sendTopRestaurantsForAmenitiyMessage(rows,sender) {
 cards_for_dishes=[];
 for(var i=0;i<rows.length;i++){
// if (fs.existsSync("http://lazylearners.in/img/dishes/"+top[0]+".jpg")) {
// var naa=data_refr.rests[rows[i].res_name].split(' ').join('%20')
//var a=myreq('GET',"http://lazylearners.in/img/dishes/"+top[0]+".jpg");
//if(a.statusCode===200)
path="http://lazylearners.in/img/rests/"+data_refr.rests[rows[i].res_name]+".jpg"
//else
//path="http://lazylearners.in/img/dishes/yali.jpg"
   cards_for_dishes[i] ={
     "title":rows[i].res_name,
   // "subtitle": rows[i].pos+' Votes\n '+rows[i].freq+' Reviews.',
    // "item_url":path,
    "image_url":path,
    "buttons": [{
        "type": "postback",
        "title": 'Best dishes',
        "payload": 'rest|'+rows[i].res_name
    },{
        "type": "postback",
        "title": "Show similar rests",
        "payload": 'show_rest|'+data_refr.cui_res[rows[i].dish_name]
    }, {
        "type": "web_url",
        "title": "Take me there",
      "url": 'http://maps.google.com/maps?q='+rows[i].coords.split(',')[0]+','+rows[i].coords.split(',')[1]
    }],
    }
}

    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
};












function sendTopRestaurantsThatServesInALocation1(sender,loc1,loc2,loc3,loc4,dish_na) {
  var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  
  connection.query('select * from top_rest where (location="'+loc1+'" or location="'+loc2+'" or location="'+loc3+'" or location="'+loc4+'") and dish_name="'+dish_na+'" order by freq desc limit 10',function(err,rows,fields){
    if(!err) {
if(rows.length > 0){
                sendTopRestaurantsThatServesInALocation1Message(rows,sender); 
                    }
            else{
                sendTextMessage(sender,"Sorry No Data Found from your location");
                sendHiMessage(sender);
            }
          }
    else
      console.log('error');
  });
  connection.end({ timeout: 60000 });
}



function sendTopRestaurantsThatServesInALocation1Message(rows,sender) {
  sendTextMessage(sender,'These are restaurants that serves '+rows[0].dish_name[0].toUpperCase()+rows[0].dish_name.substring(1)+' in '+rows[0].location+'. :)')
 cards_for_dishes=[];
 for(var i=0;i<rows.length;i++){
// if (fs.existsSync("http://lazylearners.in/img/dishes/"+top[0]+".jpg")) {
 
 var naa=data_refr.rests[rows[i].res_name].split(' ').join('%20')
//var a=myreq('GET',"http://lazylearners.in/img/dishes/"+top[0]+".jpg");
//if(a.statusCode===200)
path="http://lazylearners.in/img/rests/"+naa+".jpg"
//else
//path="http://lazylearners.in/img/dishes/yali.jpg"
   cards_for_dishes[i] ={
     "title":rows[i].res_name,
    "subtitle": rows[i].pos+' Votes\n '+rows[i].freq+' Reviews.',
  //  "item_url":path,
    "image_url":path,
    "buttons": [{
        "type": "postback",
        "title": "Show similar rests",
        "payload": 'dish|'+rows[i].dish_name
    }, {
        "type": "postback",
        "title": rows[i].res_name,
        "payload": 'rest|'+rows[i].res_name
    }],
    }
}

    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
};










//payload rest_no 


function sendTopRestaurantsInALocation(loc_id, sender) {
 var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
    connection.query('select * from restaurants where location like "'+loc_id+'" order by z_rating desc limit 10;',function(err,rows,fields){
    if(!err) {
if(rows.length > 0){
  sendTextMessage(sender,'Yali is bringing you the top restaurants in '+loc_id)
  connection.end({ timeout: 60000 });
                sendTopRestaurantsInALocationMessage1(rows,sender); 
                    }
                    else{
                      sendHiMessage(sender)
                    }
          }
    else
      console.log('error');
  });
}

// Dishes

function sendDishQuickMessage(sender) {
    var messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Craving for something ?",
                    "subtitle": "Let us know what your craving for, and we’ll tell you where it is best.",
                     "buttons": [{
                        "type": "postback",
                        "title": "What to eat?",
                        "payload": "dish_yes|yes"
                    }, {
                        "type": "postback",
                        "title": "Best dishes near U",
                        "payload": "dish_no|no",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

};

function sendDishQuestion(sender) {
    var messageData = { "text":"Please type the name of the Dish ..." }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};


function sendTopRestaurantsForADish(dish_id, sender) {
  globalarray[sender].dish_stack.push(dish_id);
  var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  
  connection.query('select res_name,freq,pos,pi,location,coords from dishes where dish_name like "'+dish_id+'" group by res_name order by pi desc limit 10;',function(err,rows,fields){
        if(!err) {
  
                if(rows.length > 0){
               globalarray[sender].dish_stack.push(dish_id)
                sendMoreRestaurantsForADishMessage(rows,sender);      }
                else{
                levenForAll(sender,dish_id)
                    } 
             }
    else
      console.log('error');
  });
  connection.end({ timeout: 60000 });
}


function sendMoreRestCuisine(rest_name, sender) {
  var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  
  connection.query('select distinct res_name,rest_id from cuisine_grouping_rests where cuisine_name="'+rest_name+'" limit 10',function(err,rows,fields){
        if(!err) {
                 globalarray[sender].cuisine_stack.push(rest_name);
                if(rows.length > 0){
                  sendTextMessage(sender,'Yali is bringing you the best restaurants that serve '+globalarray[sender].cuisine_stack[globalarray[sender].cuisine_stack.length-1]+' cuisine.')
                sendMoreRestCuisineMessage(rows,sender);      }
                else{
                levenForAll(sender,dish_id)
                // sendDishQuestion(sender);
                // sessions[sender].payload_array.push('dish_yes2');
                                } 
             }
    else
      console.log('error');
  });
  connection.end({ timeout: 60000 });
}


function sendMoreRestCuisineMessage(rows,sender) {
 cards_for_dishes=[];
 count=0
while(rows.length>count){
path="http://lazylearners.in/img/rests/"+rows[count].rest_id+".jpg"
   cards_for_dishes[count] ={
     "title": rows[count].res_name+"\t",
    //"subtitle": "Service PI    "+rows[count].service,
   // "item_url":path,
    "image_url": path,
    "buttons": [{
        "type": "postback",
        "title": "Best Dishes",
        "payload": 'rest|'+rows[count].res_name

    },{
        "type": "postback",
        "title": "Show similar rests",
        "payload": 'show_rest|'+data_refr.cui_res[rows[count].res_name]+'|'+rows[count].res_name

    }, {
        "type": "postback",
        "title": "Take me there",
        "payload": 'Take_rest|'+rows[count].res_name
    }],
    }
    count++;
}

    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
};



//2. sendMoreRestaurantsForADishMessage
function sendMoreRestaurantsForADishMessage(rows,sender) {
 cards_for_dishes=[];
 for(var i=0;i<rows.length;i++){
  path="http://lazylearners.in/img/rests/"+data_refr.rests[rows[i].res_name]+".jpg"
   cards_for_dishes[i] ={
     "title": rows[i].res_name,
    "subtitle": rows[i].pos+" Votes "+rows[i].freq+" Reviews ",
    "image_url": path, 
    "buttons": [{
        "type": "postback",
        "title": "Best Dishes",
        "payload": 'rest|'+rows[i].res_name

    },{
        "type": "postback",
        "title": "Show similar rests",
        "payload":'show_rest|'+data_refr.cui_res[rows[i].res_name]

    }, {
        "type": "web_url",
        "title": "Take me there",
      "url": 'http://maps.google.com/maps?q='+rows[i].coords.split(',')[0]+','+rows[i].coords.split(',')[1]
    }],
    }
}

    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
};







function sendTopRestaurantsForADishInALocation(sender,dish_id,loc_id) {
  globalarray[sender].dish_stack.push(dish_id);
  var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  
  connection.query('select res_name,freq,pos,pi,location,coords from dishes where dish_name like "'+dish_id+'" and location like "'+loc_id+'" group by res_name order by pi desc limit 10;',function(err,rows,fields){
        if(!err) {
  
                if(rows.length > 0){
                  sendTextMessage(sender,'These are the best '+dish_id+' restaurants in '+loc_id)
               globalarray[sender].dish_stack.push(dish_id)
                sendTopRestaurantsForADishInALocationMessage(rows,sender);      }
                else{
                levenForAll(sender,dish_id)
                    } 
             }
    else
      console.log('error');
  });
  connection.end({ timeout: 60000 });
}

function sendTopRestaurantsForADishInALocationMessage(rows,sender) {
 cards_for_dishes=[];
 for(var i=0;i<rows.length;i++){
  path="http://lazylearners.in/img/rests/"+data_refr.rests[rows[i].res_name]+".jpg"
   cards_for_dishes[i] ={
     "title": rows[i].res_name,
    "subtitle": rows[i].pos+" Votes "+rows[i].freq+" Reviews ",
    "image_url": path, 
    "buttons": [{
        "type": "postback",
        "title": "Best Dishes",
        "payload": 'rest|'+rows[i].res_name

    },{
        "type": "postback",
        "title": "Show similar rests",
        "payload":'show_rest|'+data_refr.cui_res[rows[i].res_name]

    }, {
        "type": "web_url",
        "title": "Take me there",
      "url": 'http://maps.google.com/maps?q='+rows[i].coords.split(',')[0]+','+rows[i].coords.split(',')[1]
    }],
    }
}

    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
};








function sendAspects(sender) {
    var messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Choose the Aspects that you are interested in?",
                    "subtitle": "Press any one aspect",
                    "buttons": [{
                        "type": "postback",
                        "title": "Best Service Rests",
                        "payload": "choosing_aspect|service"
                    }, {
                        "type": "postback",
                        "title": "Best Value Rests",
                        "payload": "choosing_aspect|value",
                    }],
                }, {
                    "title": "Choose the Aspects that you are interested in?",
                    "subtitle": "Press any one aspect",
                    "buttons": [{
                        "type": "postback",
                        "title": "Best Ambience Rests",
                        "payload": "choosing_aspect|ambience",
                    }, {
                        "type": "postback",
                        "title": "Best Food Rests",
                        "payload": "choosing_aspect|food",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};



function sendBestServiceRestaurants(sender,loc1,loc2,loc3,loc4)
{
 var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){
    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });

  connection.query('select * from restaurants where location="'+loc1+'" or location="'+loc2+'" or location="'+loc3+'" or location="'+loc4+'"order by service desc limit 10;',function(err,rows,fields){
        if(!err) {
                if(rows.length > 0){
                  connection.end({ timeout: 60000 });

                sendBestServiceRestaurantsMessage(rows,sender);    
              }
              }  
      else
          {
            sendTextMessage(sender,"Query Failed!!!");
            console.log('error');
          }
  });
}



function sendBestServiceRestaurantsMessage(rows,sender) {
 cards_for_dishes=[];
 count=0
while(rows.length>count){
path="http://lazylearners.in/img/restaurants/"+rows[count].rest_id+".jpg"
   cards_for_dishes[count] ={
     "title": rows[count].res_name+"\t"+rows[count].pi,
    "subtitle": "Service PI    "+rows[count].service,
    // "item_url":path,
    "image_url": path,
    "buttons": [{
        "type": "postback",
        "title": "Best Dishes",
        "payload": 'rest|'+rows[count].res_name

    },{
        "type": "postback",
        "title": "Show similar rests",
        "payload": 'show_rest|'+data_refr.cui_res[rows[count].res_name]+'|'+rows[count].res_name

    }, {
        "type": "postback",
        "title": "Take me there",
        "payload": 'Take_rest|'+rows[count].res_name
    }],
    }
    count++;
}

    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
};


function sendBestAmbienceRestaurants(sender,loc1,loc2,loc3,loc4)
{
 var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  
  connection.query('select * from restaurants where location="'+loc1+'" or location="'+loc2+'" or location="'+loc3+'"or location="'+loc4+'" order by ambience desc limit 10;',function(err,rows,fields){
        if(!err) {
  
                if(rows.length > 0){connection.end({ timeout: 60000 });
                sendBestAmbienceRestaurantsMessage(rows,sender);    }
               }
      else
          {
            sendTextMessage(sender,"Query Failed!!!");
            console.log('error');
          }
  });
}

function sendBestAmbienceRestaurantsMessage(rows,sender) {
 cards_for_dishes=[];
 count=0
while(rows.length>count){
path="http://lazylearners.in/img/restaurants/"+rows[count].rest_id+".jpg"
cards_for_dishes[count] ={
     "title": rows[count].res_name+"\t"+rows[count].pi,
    // "subtitle": "Ambience PI"+rows[count].ambience,
    // "item_url":path,
    "image_url": path,
    "buttons": [{
        "type": "postback",
        "title": "Best Dishes",
        "payload": 'rest|'+rows[count].res_name

    },{
        "type": "postback",
        "title": "Show similar rests",
        "payload": 'show_rest|'+data_refr.cui_res[rows[count].res_name]+'|'+rows[count].res_name

    }, {
        "type": "postback",
        "title": "Take me there",
        "payload": 'Take_rest|'+rows[count].res_name
    }],
    }
    count++;
}

    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
};









function sendBestFoodRestaurants(sender,loc1,loc2,loc3,loc4)
{
 var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  
  connection.query('select * from restaurants where location="'+loc1+'" or location="'+loc2+'" or location="'+loc3+'"or location="'+loc4+'" order by food desc limit 10;',function(err,rows,fields){
        if(!err) {
  
                if(rows.length > 0){connection.end({ timeout: 60000 });
                sendBestFoodRestaurantsMessage(rows,sender);    }
               }
      else
          {
            sendTextMessage(sender,"Query Failed!!!");
            console.log('error');
          }
  });
}

function sendBestFoodRestaurantsMessage(rows,sender) {
 cards_for_dishes=[];
 count=0
while(rows.length>count){
path="http://lazylearners.in/img/restaurants/"+rows[count].rest_id+".jpg"

   cards_for_dishes[count] ={
     "title": rows[count].res_name+"\t",
    "subtitle": "Food PI"+rows[count].food,
    // "item_url":path,
    "image_url":path,
    "buttons": [{
        "type": "postback",
        "title": "Best Dishes",
        "payload": 'rest|'+rows[count].res_name

    },{
        "type": "postback",
        "title": "Show similar rests",
        "payload": 'show_rest|'+data_refr.cui_res[rows[count].res_name]+'|'+rows[count].res_name

    }, {
        "type": "postback",
        "title": "Take me there",
        "payload": 'Take_rest|'+rows[count].res_name
    }],
    }
    count++;
}

    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
};






function sendBestValueRestaurants(sender,loc1,loc2,loc3,loc4)
{
 var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  
  connection.query('select * from restaurants where location="'+loc1+'" or location="'+loc2+'" or location="'+loc3+'"or location="'+loc4+'"  order by value desc limit 10;',function(err,rows,fields){
        if(!err) {
  
                if(rows.length > 0){connection.end({ timeout: 60000 });
                sendBestValueRestaurantsMessage(rows,sender);    } 
               }
      else
          {
            sendTextMessage(sender,"Query Failed!!!");
            console.log('error');
          }
  });
}

function sendBestValueRestaurantsMessage(rows,sender) {
 cards_for_dishes=[];
 count=0
while(rows.length>count){
path="http://lazylearners.in/img/restaurants/"+rows[count].rest_id+".jpg"
   cards_for_dishes[count] ={
     "title": rows[count].res_name+"\t",
    "subtitle": "Value PI"+rows[count].value,
   // "item_url":path,
    "image_url": path,
    "buttons": [{
        "type": "postback",
        "title": "Best Dishes",
        "payload": 'rest|'+rows[count].res_name

    },{
        "type": "postback",
        "title": "Show similar rests alternate loop",
        "payload": 'show_rest|'+data_refr.cui_res[rows[count].res_name]+'|'+rows[count].res_name

    }, {
        "type": "postback",
        "title": "Take me there",
        "payload": 'Take_rest|'+rows[count].res_name
    }],
    }
    count++;
}

    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
};

function setLocationForTopDishes(sender){
  var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  
  
 connection.query('select * from top_dishes',function(err,rows,fields)
 {count=0;
  while(rows.length>count){
client.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+rows[count].lat+","+rows[count].long_+"&key=AIzaSyCpmAfkM-X-BEvbrn_hvdyUF4tNy4uiPLg", function (data, response) {
if(data['results'][0])
  if(data['results'][0]['address_components']){
//var post  = {location:compo[0]['long_name'],location1:compo[1]['long_name'],location2:compo[2]['long_name'],location3:compo[3]['long_name']};
//var condition = {rest_id:rows[count].rest_id};
sendTextMessage(sender,'hi');
//var query = connection.query('UPDATE top_dishes SET ? WHERE ?', [post, condition] , function(err, result) {});
//connection.query('update top_dishes set location="'+compo[0]['long_name']+'",location1="'+compo[1]['long_name']+'",location2="'+compo[2]['long_name']+'",location3="'+compo[3]['long_name']+'" where rest_id="'+rows[count].rest_id+'";',function(erra,rws,fiels)
// {
// if(erra)
//   sendTextMessage(sender,'update query failed');;
// });        

  }
});
     count++;
    }
 });
}


function locationMatcher(sender,event){
client.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+event.message.attachments[0].payload.coordinates.lat+","+event.message.attachments[0].payload.coordinates.long+"&key=AIzaSyCpmAfkM-X-BEvbrn_hvdyUF4tNy4uiPLg",function (data) {
 completeTheLocationGlobal(data,sender);
});
}

function completeTheLocationGlobal(data,sender){
// for (i = 0; i < data['results'].length; i++) {
//   myAddress[i] = data['results'][i].formatted_address;
//   console.log(myAddress[i])
// }
if(data.hasOwnProperty('results')){
var compo=data.results[0].address_components;
  globalarray[sender].loc1=compo[1].long_name
  globalarray[sender].loc2=compo[2].long_name
  globalarray[sender].loc3=compo[3].long_name
  globalarray[sender].loc4=compo[0].long_name 
  globalarray[sender].locationset=true
  switch(globalarray[sender].location_checker)
{
  case 'rest':
  sendGenericMessageAsAmSaying(sender,"Top Restaurants From your Location",globalarray[sender].loc1+" "+globalarray[sender].loc2+" "+globalarray[sender].loc3+" "+globalarray[sender].loc4,'no');
  sendTopRestaurantsInALocation1(sender,globalarray[sender].loc1,globalarray[sender].loc2,globalarray[sender].loc3,globalarray[sender].loc4);
  break;
  case 'dish':
  sendGenericMessageAsAmSaying(sender,"Top Dishes From your Location",loc1+" "+loc2+" "+loc3+" "+loc4,'no');
  sendTopDishesInALocation1(sender,globalarray[sender].loc1,globalarray[sender].loc2,globalarray[sender].loc3,globalarray[sender].loc4);
  break;
  case 'cuisine':
  sendTextMessage(sender,"Top Cuisines From your Location")
  sendTextMessage(sender,globalarray[sender].loc1+" "+globalarray[sender].loc2+" "+globalarray[sender].loc3+" "+globalarray[sender].loc4)
  sendTopCuisinesInALocation1(sender,globalarray[sender].loc1,globalarray[sender].loc2,globalarray[sender].loc3,globalarray[sender].loc4);
  break;
  case 'value':
  sendTextMessage(sender,"Top Value Restaurants From your Location")
  sendTextMessage(sender,globalarray[sender].loc1+" "+globalarray[sender].loc2+" "+globalarray[sender].loc3+" "+globalarray[sender].loc4)
  sendBestValueRestaurants(sender,globalarray[sender].loc1,globalarray[sender].loc2,globalarray[sender].loc3,globalarray[sender].loc4)
  break;
  case 'ambience':
  sendTextMessage(sender,"Top Ambience Restaurants From your Location")
  sendTextMessage(sender,globalarray[sender].loc1+" "+globalarray[sender].loc2+" "+globalarray[sender].loc3+" "+globalarray[sender].loc4)
  sendBestAmbienceRestaurants(sender,globalarray[sender].loc1,globalarray[sender].loc2,globalarray[sender].loc3,globalarray[sender].loc4)
  break;
  case 'food':
  sendTextMessage(sender,"Top Food Restaurants From your Location")
  sendTextMessage(sender,globalarray[sender].loc1+" "+globalarray[sender].loc2+" "+globalarray[sender].loc3+" "+globalarray[sender].loc4)
  sendBestFoodRestaurants(sender,globalarray[sender].loc1,globalarray[sender].loc2,globalarray[sender].loc3,globalarray[sender].loc4)
  break;
  case 'service':
  sendTextMessage(sender,"Top Service Restaurants From your Location")
  sendTextMessage(sender,globalarray[sender].loc1+" "+globalarray[sender].loc2+" "+globalarray[sender].loc3+" "+globalarray[sender].loc4)
  sendBestServiceRestaurants(sender,globalarray[sender].loc1,globalarray[sender].loc2,globalarray[sender].loc3,globalarray[sender].loc4)
  break;
  default:
  sendGenericMessageAsAmSaying(sender,"Your Location Received What do you wanna search from this location?",globalarray[sender].loc1+" "+globalarray[sender].loc2+" "+globalarray[sender].loc3+" "+globalarray[sender].loc4,'no');
  sendHiMessage(sender)
  break;

    }
}

}

function sendTopRestaurantsInALocation1(sender,lc1,lc2,lc3,lc4){
 var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
    connection.query('select * from restaurants where location like "'+lc1+'" or location like "'+lc2+'" or location like "'+lc3+'" or location like "'+lc4+'" order by z_rating desc limit 10;',function(err,rows,fields){
    if(!err) {
if(rows.length > 0){
  connection.end({ timeout: 60000 });
                sendTopRestaurantsInALocationMessage1(rows,sender); 
                    }
                    else{
                      sendHiMessage(sender)
                    }
          }
    else
      console.log('error');
  });
}

function sendTopRestaurantsInALocationMessage(rows,sender){

cards_for_dishes=[];
 count=0
while(rows.length>count){
path="http://lazylearners.in/img/restaurants/"+rows[count].rest_id+".jpg"

   cards_for_dishes[count] ={
     "title": rows[count].res_name+"\t",
    "subtitle": rows[count].possum +" Votes\n"+rows[count].freqsum+" Reviews",
   // "item_url":path,
    "image_url": path,
    "buttons": [{
        "type": "postback",
        "title": "Best Dishes",
        "payload": 'rest|'+rows[count].res_name

    },{
        "type": "postback",
        "title": "Show similar rests",
        "payload": 'show_rest|'+data_refr.cui_res[rows[count].res_name]+'|'+rows[count].res_name

    }, {
        "type": "postback",
        "title": "Take me there",
        "payload": 'Take_rest|'+rows[count].res_name
    }],
    }
    count++;
}

    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })

 
}
function sendTopRestaurantsInALocationMessage1(rows,sender){

cards_for_dishes=[]
 for(var i=0;i<rows.length;i++){
if(rows[i].f_rating===undefined || rows[i].f_rating===null)
  rat='N/A' 
  else
  rat=rows[i].f_rating+' '
if(rows[i].z_rating===undefined)
  zom='N/A' 
  else
  zom=rows[i].z_rating+' '
var path="http://lazylearners.in/img/rests/"+data_refr.rests[rows[i].res_name]+".jpg"
   cards_for_dishes[i] ={
     "title": rows[i].res_name,
    "subtitle": ' Zomato '+zom+'\t\t Yali '+rows[i].rating+'\n\tFoursquare '+rat,
    "image_url": path,
    "buttons": [{
        "type": "postback",
        "title": "Best Dishes",
        "payload": 'rest|'+rows[i].dish_name
    }, 
    {
        "type": "postback",
        "title": "Show Similar Rests",
        "payload":  'show_rest|'+data_refr.cui_res[rows[i].res_name]+'|'+rows[i].res_name
    }, 
    {
        "type": "web_url",
        "title": "Take me there",
        "url": 'http://maps.google.com/maps?q='+rows[i].coords.split(',')[0]+','+rows[i].coords.split(',')[1]
    }],
    }
}

 



    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
   



}

function sendShowMeHow(sender){
  {
      var messageData = {
      "text":"Please share your location:",
      "quick_replies":[
      {
        "content_type":"location",
      }]
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
  }
}

function sendShowMeHow2(sender) {
    var messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                              "title": 'Please just let me know your location',
                "subtitle":"Use the location pin, or just mention your locality.",
                "buttons": [{
                  "type": "postback",
                  "title": "Show Me How",
                  "payload": 'show_me_how|rest'
                              }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
return Promise.resolve(sender);
};













// 


















function sendCuisineMessage(sender) {
    var messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Picky with Cuisines ?",
                    "subtitle": "Tell us what you have in mind & I’ll tell you where is the best place",
                    "buttons": [{
                        "type": "postback",
                        "title": "Type the Cuisine",
                        "payload": "cuisine_yes|yes"
                    }, {
                        "type": "postback",
                        "title": "Popular Cuisines",
                        "payload": "cuisine_no|no",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

};

// 1.1 payload 

function sendCuisineQuestion(sender) {
    var messageData = { "text":"Please type the name of the Cuisine ..." }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};




function sendTopDishesFromCuisine(cui_name, sender) {
  var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  
  console.log('Query item is: ' + cui_name)
    connection.query('select * from cuisine_grouping where cuisine_name like "'+cui_name+'" order by pi desc limit 10;',function(err,rows,fields){
      if(!err) {
if(rows.length > 0){
  sendTextMessage(sender,'Yali is bringing you top dishes in '+cui_name+' Cuisine')
                sendTopDishesFromCuisineMessage(rows,sender); 
                    }
            else{
                sendTextMessage(sender,"Sorry No Data Found Cuisine");
                sendHiMessage(sender);

            }
          }
    else
    {
      sendTextMessage(sender,"Data under construction.. \nCome back in a while......")
      console.log('error');
    }
  });
  connection.end({ timeout: 60000 });
}




function sendTopDishesInARestForACuisine(sender,cui_name,rest) {
  var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  
  console.log('Query item is: ' + cui_name+rest)
    connection.query('select *from dishes where res_name like "'+rest+'" and dish_name in (select dish_name from cuisine_grouping where cuisine_name like "'+cui_name+'") group by dish_name order by pi desc limit 10;',function(err,rows,fields){
      if(!err) {
if(rows.length > 0){
  sendTextMessage(sender,'Yali is bringing you top dishes in '+rest+' for '+cui_name+' Cuisine')
         sendTopDishesInARestForACuisineMessage(rows,sender); 
                    }
            else{
                sendTextMessage(sender,"Sorry No Data Found Cuisine");
                sendHiMessage(sender);

            }
          }
    else
    {
      sendTextMessage(sender,"Data under construction.. \nCome back in a while......")
      console.log('error');
    }
  });
  connection.end({ timeout: 60000 });
}




function sendTopDishesInARestForACuisineMessage(rows,sender) {
   cards_for_dishes=[];
 for(var i=0;i<rows.length;i++){
 var naa=rows[i].dish_name.split(' ').join('%20')
path="http://lazylearners.in/img/dishes/"+naa+".jpg"
   cards_for_dishes[i] ={
     "title": rows[i].dish_name[0].toUpperCase()+rows[i].dish_name.substring(1),
    "subtitle": rows[i].pos+' Votes\n '+rows[i].freq+' Reviews.',
     "image_url":path,
    "buttons": [{
        "type": "postback",
        "title": "Best Restaurants",
        "payload": 'dish|'+rows[i].dish_name
    }],
    }
}

    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })

};





//A=dsfd

function sendTopDishesFromCuisineMessage(rows,sender) {
   cards_for_dishes=[];
 for(var i=0;i<rows.length;i++){
 var naa=rows[i].dish_name.split(' ').join('%20')
path="http://lazylearners.in/img/dishes/"+naa+".jpg"
   cards_for_dishes[i] ={
     "title": rows[i].dish_name[0].toUpperCase()+rows[i].dish_name.substring(1),
    "subtitle": rows[i].pos+' Votes\n '+rows[i].freq+' Reviews.',
     "image_url":path,
    "buttons": [{
        "type": "postback",
        "title": "Best Restaurants",
        "payload": 'dish|'+rows[i].dish_name
    }],
    }
}

    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })

};

function sendTopCuisines(sender){
  sendTextMessage(sender,'create this one')

}

function sendTopCuisinesInALocation1(sender,location){
   var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){
    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
    connection.query('select cui_name,count(*) from cuisines where res_name in (select res_name from restaurants where location like "'+location+'" group by res_name order by (z_rating) desc) and location like "'+location+'" group by cui_name order by count(*) desc limit 10;',function(err,rows,fields){
      if(!err) {
if(rows.length > 0){
                sendTopCuisinesInALocation1Message(rows,sender); 
              }
            else{
                sendTextMessage(sender,"Sorry No Data Found Cuisine");
                sendHiMessage(sender);
            }
          } 
    else
    {
      sendTextMessage(sender,"Data under construction.. \nCome back in a while......")
      console.log('error');
    }
  });
  connection.end({ timeout: 60000 });


}


function sendTopCuisinesInALocation1Message(rows,sender){
cards_for_dishes=[]
 for(var i=0;i<rows.length;i++){
  path=rows[i].cui_name.split(' ').join('%20')
var path="http://lazylearners.in/img/cuisines/"+path+".jpg"
   cards_for_dishes[i] ={
     "title": rows[i].cui_name,
    "image_url": path,
    "buttons": [{
        "type": "postback",
        "title": "Best Dishes",
        "payload": 'cui_dish|'+rows[i].cui_name
    }, 
    {
        "type": "postback",
        "title": "Best Restaurants",
        "payload":  'show_rest|'+rows[i].cui_name
    }],
    }
}

 



    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
   


}


function sendTopRestaurantsForACuisine(sender,cui_name){
   var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){
    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
    connection.query('select * from restaurants where res_name in (select distinct res_name from cuisines where cui_name like "'+cui_name+'")group by res_name order by (z_rating) desc limit 10;',function(err,rows,fields){
      if(!err) {
if(rows.length > 0){
                sendTopRestaurantsForACuisineMessage(rows,sender); 
              }
            else{
                sendTextMessage(sender,"Sorry No Data Found Cuisine");
                sendHiMessage(sender);
            }
          } 
    else
    {
      sendTextMessage(sender,"Data under construction.. \nCome back in a while......")
      console.log('error');
    }
  });
  connection.end({ timeout: 60000 });


}


function sendTopRestaurantsForACuisineMessage(rows,sender){
cards_for_dishes=[]
 for(var i=0;i<rows.length;i++){
if(rows[i].f_rating===undefined || rows[i].f_rating===null)
  rat='N/A' 
  else
  rat=rows[i].f_rating+' '
if(rows[i].z_rating===undefined)
  zom='N/A' 
  else
  zom=rows[i].z_rating+' '
var path="http://lazylearners.in/img/rests/"+data_refr.rests[rows[i].res_name]+".jpg"
   cards_for_dishes[i] ={
     "title": rows[i].res_name,
    "subtitle": ' Zomato '+zom+'\t\t Yali '+rows[i].rating+'\n\tFoursquare '+rat,
    "image_url": path,
    "buttons": [{
        "type": "postback",
        "title": "Best Dishes",
        "payload": 'rest|'+rows[i].res_name
    }, 
    {
        "type": "postback",
        "title": "Show Similar Rests",
        "payload":  'show_rest|'+data_refr.cui_res[rows[i].res_name]+'|'+rows[i].res_name
    }, 
    {
        "type": "web_url",
        "title": "Take me there",
        "url": 'http://maps.google.com/maps?q='+rows[i].coords.split(',')[0]+','+rows[i].coords.split(',')[1]
    }],
    }
}

 



    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
   


}


function sendTopRestaurantsForACuisineInALocation(sender,cui_name,location){
   var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){
    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
    connection.query('select * from restaurants where res_name in (select distinct res_name from cuisines where cui_name like "'+cui_name+'") and location like "'+location+'" group by res_name order by (z_rating) desc limit 10;',function(err,rows,fields){
      if(!err) {
if(rows.length > 0){
                sendTopRestaurantsForACuisineInALocationMessage(rows,sender); 
              }
            else{
                sendTextMessage(sender,"Sorry No Data Found Cuisine");
                sendHiMessage(sender);
            }
          } 
    else
    {
      sendTextMessage(sender,"Data under construction.. \nCome back in a while......")
      console.log('error');
    }
  });
  connection.end({ timeout: 60000 });


}


function sendTopRestaurantsForACuisineInALocationMessage(rows,sender){
cards_for_dishes=[]
 for(var i=0;i<rows.length;i++){
if(rows[i].f_rating===undefined || rows[i].f_rating===null)
  rat='N/A' 
  else
  rat=rows[i].f_rating+' '
if(rows[i].z_rating===undefined)
  zom='N/A' 
  else
  zom=rows[i].z_rating+' '
var path="http://lazylearners.in/img/rests/"+data_refr.rests[rows[i].res_name]+".jpg"
   cards_for_dishes[i] ={
     "title": rows[i].res_name,
    "subtitle": ' Zomato '+zom+'\t\t Yali '+rows[i].rating+'\n\tFoursquare '+rat,
    "image_url": path,
    "buttons": [{
        "type": "postback",
        "title": "Best Dishes",
        "payload": 'rest|'+rows[i].res_name
    }, 
    {
        "type": "postback",
        "title": "Show Similar Rests",
        "payload":  'show_rest|'+data_refr.cui_res[rows[i].res_name]+'|'+rows[i].res_name
    }, 
    {
        "type": "web_url",
        "title": "Take me there",
        "url": 'http://maps.google.com/maps?q='+rows[i].coords.split(',')[0]+','+rows[i].coords.split(',')[1]
    }],
    }
}

 



    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })
   


}



function sendRestInLocationWithAmenity(sender,location,amenity){
   var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
  connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });

    connection.query('select *from restaurants where res_name in (select res_name from aminities where a_name="'+amenity+'" group by res_name) and location like "'+location+'" group by res_name order by z_rating desc limit 10;',function(err,rows,fields){
      if(!err) {
if(rows.length > 0){
                sendRestInLocationWithAmenityMessage(rows,sender); 
              }
            else{
                sendTextMessage(sender,"Sorry No Data Found Cuisine");
                sendHiMessage(sender);
            }
          }
    else
    {
      sendTextMessage(sender,"Data under construction.. \nCome back in a while......")
      console.log('error');
    }
  });
  connection.end({ timeout: 60000 });


}


function sendRestInLocationWithAmenityMessage(rows,sender){
  cards_for_dishes=[];
 count=0 
while(rows.length>count){
path="http://lazylearners.in/img/rests/"+data_refr.rests[rows[count].res_name]+".jpg"
    cards_for_dishes[count] ={
     "title": rows[count].res_name+"\t",
    // "item_url":path,
    "image_url": path,
    "buttons": [{
        "type": "postback",
        "title": "Best Dishes",
        "payload": 'rest|'+rows[count].res_name

    }
    ,
    {
        "type": "postback",
        "title": "Best Restaurants",
        "payload": 'show_rest|'+data_refr.cui_res[rows[count].cuisine_name]

    }],
    } 
    count++;
} 


    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })


}













function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

  function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message."+error);
 
    }
  });  
}
 





 
 

 function sendHiMessage(sender) {
  sendTextMessage(sender,'Welcome to Yali – Want to know where to eat the best burger or biryani? Ask YALI. Slide left to know more about best cuisines or specific amenities like Wi-Fi, valet parking & more.(Y)')
    var messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{

                   "title": "I am Yali, Ask me about the best restaurants & food in town.",
                    "subtitle": "Currently available in Chennai, we are coming soon near you.",
                    "image_url": "http://lazylearners.in/img/dishes/yali.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Restaurant",
                        "payload": "choosing_rest|rest"
                    }, {
                        "type": "postback",
                        "title": "Dish",
                        "payload": "choosing_dish|dish",
                    }],
                }, {
                    "title": "I am Yali, Ask me about the best restaurants & food in town.",
                    "subtitle": "Currently available in Chennai, we are coming soon near you.",
                    "image_url": "http://lazylearners.in/img/dishes/yali.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Cuisine",
                        "payload": "choosing_cuisine|cuisine",
                    }, {
                        "type": "postback",
                        "title": "Wifi ,valet & more",
                        "payload": "choosing_aspects|aspects",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error:1 ', response.body.error)
        }
    })
sendTextMessage(sender,'Click any of the options below to know more about the best dishes, cuisines and amenities of the restaurants...!:)')
};





function getADishFromRest(sender,dish,rest)
{
var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  connection.query('select * from top_rest where dish_name="'+dish+'" and res_name="'+rest+'" ',function(err,rows,fields){
    if(!err) {
            if(rows.length > 0){
              getADishFromRestMessage(sender,rows)
            }
              else{
                sendTextMessage(sender,"Sorry No Data Found! Please try another Dish");
                sendHiMessage(sender);
              }
    }
    else
      console.log('error');
  });
  connection.end({ timeout: 60000 });
}


function getADishFromRestMessage(sender,rows) {
   count=0;
   cards_for_dishes=[];
 path="http://lazylearners.in/img/dishes/"+rows[0].dish_name+".jpg"
   cards_for_dishes[0] ={
     "title": rows[0].dish_name +'['+rows[0].res_name+']',
    "subtitle": rows[0].pos+' Votes.' + rows[0].freq+' Reviews.',
    // "item_url":path,
    "image_url":path,
    "buttons": [{
        "type": "postback",
        "title": "Show similar Rests",
        "payload": 'dish|'+rows[0].dish_name
    },
    {
        "type": "postback",
        "title": "Dishes from "+rows[0].res_name,
        "payload": 'rest|'+rows[0].dish_name
    }],
    }


    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })

};








 function sendGenericMessageAsAmSaying(sender,title,subtitle,image_url) {
    if(image_url==='no'){
        var messageData = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": title,
                        "subtitle": subtitle
                    }]
                }
            }
        }
            }
  else{
        var messageData = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": title,
                        "subtitle": subtitle,
                        "image_url":image_url
                    }]
                }
            }
        }
  }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error:1 ', response.body.error)
        }
    })
};








function takeMeThere(sender,payloada)
{
location=payloada.split('#');
sendTextMessage(sender,location[0]+" "+location[1])
}







function sendQuickReply(sender) {
    var params=[]
    for(var i=0;i<10;i++){
      params.push({
          "content_type":"text",
          "title":"choice"+i,
          "payload":"pay"+i
        })
    }
    var messageData = {
      "text":"Red",
      "quick_replies":params
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};


function persistentMenu(){
 request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json:{
        setting_type : "call_to_actions",
        thread_state : "existing_thread",
        call_to_actions:[
        {
              type:"postback",
              title:"Home",
              payload:"send_hi|yes"
            },
            {
              type:"postback",
              title:"Restaurants",
              payload:"choosing_rest|yes"
            },
            {
              type:"postback",
              title:"Dishes",
              payload:"choosing_dish|yes"
            },
            {
              type:"postback",
              title:"How to do it..",
              payload:"how_to|yes"
            },
            {
              type:"web_url",
              title:"Yali.tech",
              url:"http://www.yali.tech/"
            }
          ]
    }

}, function(error, response, body) {
    console.log(response)
    if (error) {
        console.log('Error sending messages: ', error)
    } else if (response.body.error) {
        console.log('Error: ', response.body.error)
    }
})

}

function removePersistentMenu(){
 request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json:{
        setting_type : "call_to_actions",
        thread_state : "existing_thread",
        call_to_actions:[ ]
    }

}, function(error, response, body) {
    console.log(response)
    if (error) {
        console.log('Error sending messages: ', error)
    } else if (response.body.error) {
        console.log('Error: ', response.body.error)
    }
})
}



function sendAminitiesOfARestaurants(sender,rest_na){
var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  connection.query('select distinct a_name from aminities where res_name="'+rest_na+'" limit 10',function(err,rows,fields){
    if(!err) {
            if(rows.length > 0){    
sendAminitiesOfARestaurantsMessage(sender,rows,rest_na)
   }
              else{
                sendTextMessage(sender,"Sorry No Data Found! Please try another Dish");
                sendHiMessage(sender);
              }
    }
    else
      console.log('error');
  });
  connection.end({ timeout: 60000 });


}
function sendAminitiesOfARestaurantsMessage(sender,rows,rest_na){
  var params=[]
    for(var i=0;i<rows.length;i++)
    {
      params.push({
          "content_type":"text",
          "title":rows[i].a_name.substring(0,19),
          "payload":'amenities|'+rows[i].a_name
        })
    }
    var messageData = {
      "text":"These are the amenities of "+rest_na,
      "quick_replies":params
    }


request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

}







function sendCuisineForARest(sender,rest)
{
var connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4aec715d54ead',
    password : 'c687f1c7',
    database : 'heroku_85faeaf548b898d'
  });
connection.connect(function(err){

    if(!err)
      console.log('Database is connected successfully !!!');
    else
      console.log('Error is: '+err);
  });
  connection.query('select * from cuisines where res_name="'+rest+'" group by cui_name',function(err,rows,fields){
    if(!err) {
            if(rows.length > 0){
              sendCuisineForARestMessage(rows,sender,rest)
            }
              else{
                sendTextMessage(sender,"Sorry No Data Found! Please try another Dish");
                sendHiMessage(sender);
              }
    }
    else
      console.log('error');
  });
  connection.end({ timeout: 60000 });
}


function sendCuisineForARestMessage(rows,sender,rest){
  cards_for_dishes=[];
 count=0 
while(rows.length>count){
path="http://lazylearners.in/img/cuisines/"+rows[count].cui_name.split(' ').join('%20')+".jpg"
    cards_for_dishes[count] ={
     "title": rows[count].cui_name+"\t",
    // "item_url":path,
    "image_url": path,
    "buttons": [{
        "type": "postback",
        "title": "Best Dishes",
        "payload": 'crd|'+rows[count].cui_name+'|'+rest

    }],
    } 
    count++;
} 


    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })


}







function getADishFromRestMessage(sender,rows) {
   count=0;
   cards_for_dishes=[];
 path="http://lazylearners.in/img/dishes/"+rows[0].dish_name+".jpg"
   cards_for_dishes[0] ={
     "title": rows[0].dish_name +'['+rows[0].res_name+']',
    "subtitle": rows[0].pos+' Votes.' + rows[0].freq+' Reviews.',
    // "item_url":path,
    "image_url":path,
    "buttons": [{
        "type": "postback",
        "title": "Show similar Rests",
        "payload": 'dish|'+rows[0].dish_name
    },
    {
        "type": "postback",
        "title": "Dishes from "+rows[0].res_name,
        "payload": 'rest|'+rows[0].dish_name
    }],
    }


    var messageData = {
     "attachment": {
    "type": "template",
        "payload": {
                     "template_type": "generic",
              "elements": cards_for_dishes
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test: ', response.body.error)
        }
    })

};


function levenFor(keys_to_check,query){
  var dict = [];
  var gen=[];
         for(var i in keys_to_check)
          {
            for(var j in data_refr[i])
            {
              val=leven(j,query.toLowerCase())
              dict.push({
              key:   j,
              value: val,
              });
              gen.push(i);     
            }
          }
var arr=[];
var gen_sel=[];
dont=false
limit=0;
cards=0;
while(arr.length<3){
cun=0;
while(dict.length>cun){
  if(cards===3)
    break;
        if(dict[cun].value===limit){
                        for(i=0;i<arr.length;i++){
                          if(dict[cun].key===arr[i].key){
                          dont=true
                          }
                        }
       if(dont){
        dont=false
       }else{       
        arr.push(dict[cun]);
        gen_sel.push(gen[cun]);
        cards++;
        }
           }
        cun++;
}
limit++;
}   

    return arr[0].key+'|'+gen_sel[0]
}
 

function sendQuickReplyAsISay(sender,params,text) {
    //       "content_type":"text",
    //       "title":"choice"+i,
    //       "payload":"pay"+i
    
     var messageData = {
      "text":text,
      "quick_replies":params
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};



console.log('initiated')