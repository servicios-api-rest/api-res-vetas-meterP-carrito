'use strict'

const mogoose =require('mongoose')
const connect =  require('../../../database/collections/connect')
const Registro = require('../../../database/collections/users');
const Product = require('../../../database/collections/products');
const Ventas = require('../../../database/collections/ventas');

const express = require('express')

const route = express.Router()

//////////// metodos de peticion GET, POTS, PUT, DELETE///////////////////////////////

route.get('/', (req, res) =>{
    res.status(200).send({ message:'Service api-rest Product Store'})
})



//registro de usuarios de prueba
route.post('/registro', (req, res) =>{
    console.log('POST /api/registro')
    console.log(req.body)

    let registro = new Registro()
    registro.name = req.body.name
    registro.lastname = req.body.lastname
            registro.save((err, usertStored) =>{

                if(err) {
                  res.status(404).send({messaje: `Error al salvar la base de datos:${err}`})
                 console.log(err)
                }
                res.status(200).send(usertStored)
            })
    //res.status(404).send
})


/// Listar los usuarios --> purreba para consumir esto datos 
route.get('/user', (req, res, next)=>{

    Registro.find({}, (err, user)=>{
    var user2 = user.map(u=>{
            return ({
                id:u.id,
                name:u.name,
                lastname:u.lastname
            })
        })
        res.status(200).send(user2);
    })
});


//:::::: PRODUCTOS::::::::::::::::::
// registro de los productos-----------------------
route.post('/registerproduct', (req, res, next)=>{
    console.log(req.body);

    let product = new Product();
    product.name_p = req.body.name_p
    product.marca_p = req.body.marca_p
    product.price_p = req.body.price_p
    product.description_p = req.body.description_p  

    product.save((err, res_pro)=>{
        if(err){
            res.status(404).send({message:`Error al salvar los datos:${err} `});
            console.log(err)
        }
        res.status(200).send(res_pro);
    })

});


// muestra los pordcutos
route.get('/products', (req, res, next)=>{

    Product.find({}, (err, products_res)=>{
        console.log(products_res)
        
        var ListProducts = products_res.map(u=>{
            return({
                id: u.id,
                name : u.name_p,
                price: u.price_p,
                marca: u.marca_p,
                description: u.description_p    
            })
               
        })

        console.log(ListProducts);
        console.log(err);
        res.status(200).json(ListProducts);
    })

});


// ------Añadir productos al carrito (Ventas)-----------------

route.post('/anadircompra', (req, res, next)=>{
    //console.log(req.body);

    var id_user = req.body.id_user;
    var id_product = req.body.id_product;

   var prod
    
    Product.find({_id:id_product},(err, p)=>{
          prod=p[0]
          console.log(p[0])
    })
    
    console.log(prod)

    Ventas.findOne({id_user:id_user},(err, resp)=>{
            if(resp){
                var array={
                    carrito: new Array()
                };
                array.carrito=resp.carrito;
                array.carrito.push(prod)

                Ventas.findOneAndUpdate({_id : resp._id}, array, (err, params)=>{
                    if (err) {
                        res.status(500).json({
                          "msn" : "error en la actualizacion del usuario"
                        });
                        return;
                      }
                })
               res.status(200).send(resp);
            }
            else
            {
                var venta = new Ventas();
                venta.id_user = id_user
                venta.carrito = prod
            
                venta.save((err, carrito)=>{
                    if(err){
                        res.status(404).send({message:`error al salvar los datos ${err}`})
                    }
                    res.status(200).send(carrito);
                });
            }
    })


})



//mostrar el carrito de compras
route.get('/carrito',(req, res, next)=>{

    Ventas.find({},(err, carritos)=>{
        console.log(carritos)
        const carritos2 = carritos.map(u=>{
            return({
                carrito:u.carrito,
                id: u._id,
                id_user: u.id_user,
                         
            })
        })
        res.status(200).send(carritos2)
        
    })
    
});



module.exports = route
