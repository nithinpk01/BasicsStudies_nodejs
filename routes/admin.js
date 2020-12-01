var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
       res.render('admin/view-product',{products});
  })
  
    })
  router.get('/add-product',function(req,res){
    res.render('admin/add-product')
  })
  router.post('/add-product',function(req,res){
    
    productHelpers.addProduct(req.body,(id)=>{
      let image=req.files.image
            image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
        if(!err)
        res.render("admin/add-product")
        else console.log(err)
      })
   
    })
  })
  router.get('/delete-product/:id',(req,res)=>{
    let proId=req.params.id
           productHelpers.deleteProduct(proId).then((response)=>{
      res.redirect('/admin')
    })
  })
  router.get('/edit-product/:id',async(req,res)=>{
  let product=await productHelpers.getproductDetails(req.params.id)
        res.render('admin/edit-product',{product})
      })
 router.post('/edit-product/:id',(req,res)=>{
  id=req.params.id
  let image=req.files.image
   productHelpers.updateProduct(req.params.id,req.body).then(()=>{
     res.redirect('/admin')
   
     if(req.files.image){
      image.mv('./public/product-images/'+id+'.jpg')
     }
     
     
   })
 })

module.exports = router;
