const app = angular.module("MyApp", []);

app.controller("MyController", ["$http", "$timeout", function($http, $timeout){
// This variable ensures the slideshow function is only called on load
this.isRunning = false;

// get session on the very top of the code to ensure userWishlist can be populated
$http({
    method: "GET",
    url: "/session"
}).then(response => {
    if (response.data.username) {
        this.loggedInUser = response.data;

    }
});

///////////////////
// functions
///////////////////
this.displayEditInfo = null;

this.sectionShow = false;

this.item = ''

this.loggedInUser = false;


this.signup = function() {
    $http({
        url: "/users",
        method: "POST",
        data: {
            username: this.signupUsername,
            password: this.signupPassword
        }
    }).then(response => {
        this.loggedInUser = response.data;
        this.isRunning = true;
        this.getWishlist();
    });
};

this.login = function() {
    $http({
        url: "/session",
        method: "POST",
        data: {
            username: this.loginUsername,
            password: this.loginPassword
        }
    }).then(response => {
        if (response.data.username) {
            console.log('loggedInUser being set')
            this.loggedInUser = response.data;
            this.isRunning = true;
            this.getWishlist();

        } else {
            this.loginUsername = null;
            this.loginPassword = null;
        }
    });
};

this.logout = function() {
    $http({
        url: "/session",
        method: "DELETE"
    }).then(() => {
        this.loggedInUser = false;
    });
};

this.funcSectionShow = ( item) => {
    this.sectionShow = !this.sectionShow;

    console.log(item);

    this.item = item
    console.log(this.item);


}

this.displayCreateModal = () => {
    this.displayCreateInfo = !this.displayCreateInfo
}


// filter out the category on click
this.filterCategory = function(category){
this.searchBox = category;
}

this.allCategory = function(){
this.searchBox = undefined;
}

// Calculate Budget and Paid for each recipient category of specific user
this.budgetTable = function(){
  this.budgetArray = [0];
  this.paidArray = [0];
  this.recipientCategoryArray = [];
  for (var i = 0; i < this.userWishlist.length; i++) {
    if (this.userWishlist[i].complete) {
      this.paidArray.push(this.userWishlist[i].price);
    } else {
      this.budgetArray.push(this.userWishlist[i].price);
    }

    this.recipientCategoryArray.push(this.userWishlist[i].recipientCategory);
  }

  console.log(this.budgetArray);
  this.paid = this.paidArray.reduce((a, b) => a + b);
  this.budget = this.budgetArray.reduce((a, b) => a + b);

  // Create unique recipient category for table
  this.uniqueRecipientCategory = [...new Set(this.recipientCategoryArray)].sort();
  console.log(this.uniqueRecipientCategory);


}


this.sumMoney = function(category, complete){

this.filteredWishlist = this.userWishlist.filter((item) => {
return item.recipientCategory.toLowerCase()===category;
})

this.total = 0;
for (var i = 0; i < this.filteredWishlist.length; i++) {
if (this.filteredWishlist[i].complete === complete) {
this.total += this.filteredWishlist[i].price
}
}
return Math.round(this.total);
}


this.changeInclude = (path) => {
        this.includePath = 'partials/' + path + '.html'
    }

// Moves item from the Wishlist column to the Paid column and vice-verser
this.toggleComplete = function(item){
  this.isRunning = true;
  console.log(!item.complete);
  $http({
    method: "PUT",
    url: "/wishlist/"+item._id,
    data: {
      complete:!item.complete
    }
  }).then((response) => {
    console.log(response.data);
    this.getWishlist();
  })
}

///////////////////
// routes
///////////////////
this.createItem = function(){
    this.displayCreateInfo = false;

  if (this.name===undefined|this.name===""|
      this.recipient===undefined|this.recipient===""|
      this.recipientCategory===undefined|this.recipientCategory===""|
      this.price===undefined|this.price===""|
      this.image===undefined|this.image===""|
      this.storeName===undefined|this.storeName===""|
      this.storeUrl===undefined|this.storeUrl===""|
      this.priority===undefined|this.priority==="") {
    console.log("invalid");

  } else {
    $http({
      method: "POST",
      url: "/wishlist",
      data: {
        username: this.loggedInUser.username,
        name: this.name,
      	recipient: this.recipient,
      	recipientCategory: this.recipientCategory,
      	price: this.price,
      	image: this.image,
      	storeName: this.storeName,
      	storeUrl: this.storeUrl,
      	priority: this.priority,
      	notes: this.notes,
      	complete: this.complete
      }
    }).then((response) => {
      this.isRunning = true;
      console.log(response);
      this.getWishlist();

      this.name = "";
      this.recipient = "";
      this.recipientCategory = "";
      this.price = "";
      this.image = "";
      this.storeName = "";
      this.storeUrl = "";
      this.priority = "";
      this.notes = "";
    },(error) => {
      console.log(error);
    })
  }



}


this.deleteItem = function(item){
  $http({
    method: "DELETE",
    url: "/wishlist/"+item._id
  }).then((response) => {
    this.isRunning = true;
    this.getWishlist();
  })
}

this.editItem = function(item){

    this.sectionShow = false;

    console.log(item);

    console.log(item._id);

    if(this.updateName === ""){this.updateName=item.name;}
    if(this.updateRecipient === ""){this.updateRecipient=item.recipient;}
    if(this.updateRecipientCategory === ""){this.updateRecipientCategory=item.recipientCategory;}
    if(this.updatePrice === ""){this.updatePrice=item.Price;}
    if(this.updateImage === ""){this.updateImage=item.image;}
    if(this.updateStoreName === ""){this.updateStoreName=item.storeName;}
    if(this.updateStoreUrl === ""){this.updateStoreUrl=item.storeUrl;}
    if(this.updatePriority === ""){this.updatePriority=item.priority;}
    if(this.updateNotes === ""){this.updateNotes=item.notes;}



  $http({
    method: "PUT",
    url: "/wishlist/"+item._id,
    data: {
          username: this.loggedInUser.username,
          name: this.updateName,
          recipient: this.updateRecipient,
          recipientCategory: this.updateRecipientCategory,
          price: this.updatePrice,
          image: this.updateImage,
          storeName: this.updateStoreName,
          storeUrl: this.updateStoreUrl,
          priority: this.updatePriority,
          notes: this.updateNotes

    }
  }).then((response) => {
    this.isRunning = true;
    console.log(response);

    this.getWishlist();

    this.updateName = "";
    this.updateRecipient = "";
    this.updateRecipientCategory = "";
    this.updatePrice = "";
    this.updateImage = "";
    this.updateStoreName = "";
    this.updateStoreUrl = "";
    this.updatePriority = "";
    this.updateNotes = "";

  },(error) => {
    console.log(error);
  })
}


this.getWishlist = function(){
  $http({
    method: "GET",
    url: "/wishlist"
  }).then((response) => {

    console.log(response.data);
    response.data.forEach(obj=>obj.recipientCategory=obj.recipientCategory.toLowerCase() )

    this.wishlist = response.data;
    console.log(this.wishlist);

    // Calculate total Budget and Paid for username
    if (this.loggedInUser) {
      this.userWishlist = this.wishlist.filter((item) => {
        return item.username == this.loggedInUser.username;
      })

      this.budgetTable();
    }


    // functions for slideshowlet k = 0;
                        let k = 0;
                        this.slideImage = this.wishlist[0].image;
                        this.slideLink = this.wishlist[0].storeUrl;
                        this.slideImage1 = this.wishlist[0+1].image;
                        this.slideLink1 = this.wishlist[0+1].storeUrl;
                        this.slideImage2 = this.wishlist[0+2].image;
                        this.slideLink2 = this.wishlist[0+2].storeUrl;


                        slideShow = () => {

                          if (k >= this.wishlist.length-3) {
                            k= -1;
                          }
                          k++;


                        // console.log(this.slideImage);

                        $timeout(() => {

                          this.slideImage = this.wishlist[k].image;
                          this.slideLink = this.wishlist[k].storeUrl;
                          this.slideImage1 = this.wishlist[k+1].image;
                          this.slideLink1 = this.wishlist[k+1].storeUrl;
                          this.slideImage2 = this.wishlist[k+2].image;
                          this.slideLink2 = this.wishlist[k+2].storeUrl;
                          // console.log(this.slideLink);
                          // console.log(k);

                          slideShow();

                        }, 3000)

                        }

    if (this.isRunning === false) {
      slideShow();
    }



  })
}

// Populate index page on load
this.getWishlist();


}]) //closes controller

var timer;

var compareDate = new Date('December 25, 2019 23:15:30');
compareDate.setDate(compareDate.getDate());

timer = setInterval(function() {
  timeBetweenDates(compareDate);
}, 1000);

function timeBetweenDates(toDate) {
  var dateEntered = toDate;
  var now = new Date();
  var difference = dateEntered.getTime() - now.getTime();

  if (difference <= 0) {

    // Timer done
    clearInterval(timer);

  } else {

    var seconds = Math.floor(difference / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    hours %= 24;
    minutes %= 60;
    seconds %= 60;

    $("#days").text(days);
    $("#hours").text(hours);
    $("#minutes").text(minutes);
    $("#seconds").text(seconds);
  }
}
