'use strict'

const express = require('express')
const mongoose = require('mongoose')



mongoose.connect('mongodb://localhost:27017/productsDB',{ useNewUrlParser: true }, (err, res) =>{
    if(err) throw err
    console.log('Conexion a la base de datos establecida')
})

module.exports = mongoose
