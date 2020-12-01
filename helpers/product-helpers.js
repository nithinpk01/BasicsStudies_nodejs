var db=require('../config/connection')
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectId
module.exports={
    addProduct:(product,callback)=>{
        db.get().collection(collection.PRODUCT_COLLECTIONS).insertOne(product).then((data)=>{
            
            callback(data.ops[0]._id)
        
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTIONS).find().toArray();
            resolve(products)
        })
    },
    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            
            db.get().collection(collection.PRODUCT_COLLECTIONS).removeOne({_id:objectId(prodId)}).then((response)=>{
               resolve(response)
            })
        })
    

    },
    getproductDetails:(prodId)=>{
        return new Promise((resolve,reject)=>{
            
            db.get().collection(collection.PRODUCT_COLLECTIONS).findOne({_id:objectId(prodId)}).then((product)=>{
                resolve(product)
            })
    })
},
updateProduct:(proid,prodetails)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTIONS).updateOne({_id:objectId(proid)},{
            $set:{
                name:prodetails.name,
                price:prodetails.price,
                category:prodetails.category,
                //image:prodetails.image,
            }
        }).then((response)=>{
            resolve()
        })
    })
}
}
