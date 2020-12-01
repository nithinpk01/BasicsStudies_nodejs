var express = require('express');
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();

const verifyLogin=(req,res,next)=>{
  if(req.session.user){
    next()
  }
  else{
    res.redirect('/')
  }
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/user',{products,user});
  })
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }
  else{ 
    res.render('user/login',{'loginErr':req.session.loginErr})
    req.session.loginErr=false
  }
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
     userHelpers.doSignup(req.body).then((response)=>{
       console.log(response)
     })  
        
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    
  }
  else{
    req.session.loginErr="Invalid Username or Password"
      res.redirect('/login')
    }
  
})
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')

})
router.get('/cart',verifyLogin,async(req,res)=>{
  let products=await userHelpers.getcartProducts(req.session.user._id)
  console.log(products)
  res.render('user/cart')
})
router.get('/addtocart/:id',verifyLogin,(req,res)=>{
  userHelpers.addtoCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/')
  })
})


module.exports = router;
