const express = require('express')
const router = express.Router()
const Wishlist = require('../models/wishlist.js')
const wishlistSeed = require('../models/seed.js');


///////////////////
// seed
///////////////////
router.get("/seed", (req, res) => {
  Wishlist.create(wishlistSeed, (err, seedData) => {
    // res.json(seedData);
    console.log(seedData);
  })
})


///////////////////
// index
///////////////////
router.get('/', (req, res) => {
    console.log(req.session.user)
    Wishlist.find({}, (err, foundWishlist) => {
        res.json(foundWishlist);
    }).sort({price:1})
});

router.post('/', (req, res) => {
    Wishlist.create(req.body, (error, createdWishlist) => {
        res.json(createdWishlist);
    });
});

router.delete('/:id', (req, res) => {
    Wishlist.findByIdAndRemove(req.params.id, (error, deletedWishlist) => {
        res.json(deletedWishlist);
    });
});

router.put('/:id', (req, res) => {
    Wishlist.findByIdAndUpdate(req.params.id, req.body, {new:true}, (error, updatedWishlist) => {
        res.json(updatedWishlist);
    })
});




module.exports = router;
