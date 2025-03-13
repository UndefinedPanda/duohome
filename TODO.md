# Todo List: 
### BUGS:
* When users create a family, the session doesn't get set properly with the family ID. This bug forces users to re-login before theyre able to view their family and create events 
* Figure out why 'today' event is showing a tomorrow event (maybe due to the server disconnection I had?)   
* Fix timeline current date to scroll automatically

### Main Todos: 
* Fix and reorganize components folder
* Add 'end time' to events. default will be one hour, users can select this when creating the event
* Add more information about the event on the timeline
* Fix interfaces. Make specific file for them instead of randomly everywhere
* Fix the session so im only using useSession instead of the janky useSession parsing im doing
* Allow parents to invite their coparent on the 'View Family' screen
* Allow parents to edit their family name
* Find better colour palette (light greens, pastel colours)
* Start Event Change Requests
* User Messaging between coparents
* Look into payment options and subscription models
* Image uploading
* Document scanning

### Future Todos: 
* Get Apple developer account 
* Get Google play account
* Email services

### Done
* Fix 'View Family' and 'Logout' buttons on home screen header @done(24-11-18 12:15)
* Only show 'today' events on home screen instead of all events @done(24-11-18 2:02)
* Show1 events on calendar as dots based on color chosen when creating the event @done(24-11-20 9:38)
* Add events into timeline (time, descripton, etc.) @done(24-11-22 11:47)
