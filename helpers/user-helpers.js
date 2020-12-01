var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
const { ObjectId } = require('mongodb')
const { response } = require('express')
const { reject } = require('promise')

module.exports={
    doSignup:(userData)=>{
        
            return new Promise(async(resolve,reject)=>{
                userData.Password=await bcrypt.hash(userData.Password,10)
                db.get().collection(collection.USER_COLLECTIONS).insertOne(userData).then((data)=>{
                    resolve(data.ops[0])

                })
            })
        
    },
    doLogin:(userData)=>{
        let loginStatus=false
        let response={}
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collection.USER_COLLECTIONS).findOne({email:userData.email})
                        if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("login success")
                        response.user=user
                        response.status=true
                        resolve(response)
                    }
                    else
                    {
                        console.log("login failed")
                        resolve({status:false})
                    }
                })
            }
            else{
                console.log("no user registered")
            }
          })
    },
    addtoCart:(proid,userid)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTIONS).findOne({user:ObjectId(userid)})
            if(userCart){

                db.get().collection(collection.CART_COLLECTIONS)
                .updateOne({user:ObjectId(userid)},
                {
                    $push:{products:ObjectId(proid)}
                }
                ).then((response)=>{
                    resolve()
                })
            }
            else{
                cartObj={
                    user:ObjectId(userid),
                    products:[ObjectId(proid)]
                }
                db.get().collection(collection.CART_COLLECTIONS).insertOne(cartObj).then((response)=>{
                    resolve()
                })

            }
        })
    },
    getcartProducts:(userid)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.CART_COLLECTIONS).aggregate([
                {
                    $match:{user:ObjectId(userid)}
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTIONS,
                        let:{proList:'$products'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$proList"]
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
                
            ]).toArray()
            resolve(cartItems[0].cartItems)  
        })
    }
}