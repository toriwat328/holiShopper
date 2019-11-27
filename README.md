# holiShopper - GA SEIR Group Project

## Collaborators

- Adam Hwung
- Tori-Ann Watkis
- Wincy Law

## Link to Live Website

https://holishopper.herokuapp.com/

## Overview

Created shopping application in order to allow users to create a shopping list for Christmas and keep track of all the presents for their loved ones

## Features

- User can create an account and see their own personal shopping list (Wishlist, Purchased)
- New items can be created with all the pertinent information about the item, like website, price, etc.
- Shopping list can be organized by price, to whom the present is for, and other categories
- Toggle item between Wishlist and Purchased
- Able to update, delete and return the items
- Budget table that shows how much money is being spent on each recipient category
- Filter the Wishlist and Purchased items based on recipient category
- Total budget shown on left sidebar to show how much money is being spent
- Countdown to Christmas
- Carousel of trending holiday gifts (with links to store website) based on all items in database contributed from all users

## Resources Used

- MongoDB Atlas
- Heroku

## Wire Framing
![wire framing](public/img/wireFraming.jpg)

## Technologies Used

- HTML
- CSS
- JavaScript
- Google fonts
- Materialize
- AngularJS with $http and $timeout

## Dependencies

- Bcrypt
- Dotenv
- Express
- Express-session
- Mongoose

## Approach Taken
Here are the steps taken to populate the index Page

### Wishlist/Purchased: Find wishlist based on username and complete.  User can enforce additional sort and filter
- Pulls in entire wishlist from the database and display the appropriate ones on index
```html
<div class="card sticky-action" ng-repeat="item in ctrl.wishlist
| filter:{'complete':false}:true | filter:{'recipientCategory':ctrl.searchBox}:true | filter:{'username':ctrl.loggedInUser.username}:true
| orderBy: order" ng-class="(item.priority === 'high') ? 'high' : ''">
```

### Budget table
- Filter out the wishlist into a userWishlist for calculations
```js
if (this.loggedInUser) {
  this.userWishlist = this.wishlist.filter((item) => {
    return item.username == this.loggedInUser.username;
  })
```

- Populate table with ng-repeat
```html
<tr>
  <td>Budget</td>
  <td ng-repeat="category in ctrl.uniqueRecipientCategory">{{ctrl.sumMoney(category, false)}} ({{ctrl.sumMoney(category, false)/ctrl.budget*100|number: 0}}%)</td>
  <td>{{ctrl.budget|currency}}</td>
</tr>
```

- this.budgetTable() to calculate uniqueRecipientCategory and the total amount
```js
this.paid = this.paidArray.reduce((a, b) => a + b);
this.budget = this.budgetArray.reduce((a, b) => a + b);

// Create unique recipient category for table
this.uniqueRecipientCategory = [...new Set(this.recipientCategoryArray)].sort();
```

- this.sumMoney(category, complete) to calculate the total for each unique category
```js
this.filteredWishlist = this.userWishlist.filter((item) => {
return item.recipientCategory.toLowerCase()===category;
})

for (var i = 0; i < this.filteredWishlist.length; i++) {
if (this.filteredWishlist[i].complete === complete) {
this.total += this.filteredWishlist[i].price}
}
```

### Slideshow
- this.wishlist from all users
- Recursion because setTimeout was non-blocking
- Use Angular $timeout instead of setTimeout in order to initiate Angular digest cycle
- Use this.isRunning = false to ensure slideShow() is only called on load since it's part of the getWishlist()
```js
slideShow = () => {

  if (k >= this.wishlist.length-3) {
    k= -1;
  }
  k++;

$timeout(() => {

  this.slideImage = this.wishlist[k].image;
  this.slideLink = this.wishlist[k].storeUrl;
  this.slideImage1 = this.wishlist[k+1].image;
  this.slideLink1 = this.wishlist[k+1].storeUrl;
  this.slideImage2 = this.wishlist[k+2].image;
  this.slideLink2 = this.wishlist[k+2].storeUrl;

  slideShow();

}, 3000)

}
```

## Work Flow
### Tuesday
1. Slack to agree on the Christmas Shopping App
2. Brainstorm to come up with features and extras (after we meet MVP)
3. Started trello for key items and dates

### Wednesday
1. Updated schematic after class and reading project markdown
2. Zoom to set up git repo, Atlas and deploy to heroku
3. Divide and conquer.  Agreed on meeting MVP by the end of Saturday
4. Set up file structure, server.js, controller and models Schema
5. Test via POSTMAN.  Data was not posting because of the missing app.use(express.json());
6. Set up basic html per wireFraming.  Create New Item added.  app.js in progress

### Thursday
1. Nav in partials. Moved Create New Item into modal.  Edit modal in progress
2. Set up Budget table
3. Tried to AJAX another API for random cheesy X'mas songs on load
4. Looked into SOUNDCLOUD AND last.fm.  Bad UX and UI for songs on load => Went back to login in order to meet MVP
5. Filter by recipientCategory and user sort functions
6. Major CSS day


### Friday
1. Fix edit modal.  Took it out of the ng-repeat loop to avoid z-index issues.  Dryer codes without the use of $index
2. Clear edit form.
3. Push to Heroku
4. Carousel slideshow
5. More CSS
6. Started Login and sign up (only one person on the database)

### Saturday
1. Got the radio buttons to work on Edit and Create form
2. Merged branches to include carousel and countdown
3. Clear Create New Item form
4. ng-class the priority and closed Crete New Item form on submit
5. Fixed a bug on the recursion by introducing the isRunning variable
6. Updated Schema to required: true to prevent invalid entries in database
4. Merge with login and the code broke

### Monday
1. Pushed the primitive version with the login feature to Master as a backup plan
2. Everyone worked off the final branch with all the features and try to make the login work
3. Update the Budget table to show data for specific user only
4. Merged final with Master and pushed to Heroku
