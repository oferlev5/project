const express = require('express')
const app = express()
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
let data = []
let counter = 0


const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title:'Dive Shop Api',
            version: '1.0.0'
        }
    },
    apis: ['app.js'],
}
const swaggerDocs = swaggerJsDoc(swaggerOptions)

app.use(express.urlencoded({extended:false}))
app.use('/api-docs', swaggerUI.serve,swaggerUI.setup(swaggerDocs))

/**
 * @swagger
 * /:
 *  get:
 *    description: HomePage
 *    responses:
 *     200:
 *      description: Sucess
 */
app.get('/', function(req,res){
    console.log("user entered")
    res.sendFile(__dirname + '/index.html')
})


/**
 * @swagger
 * /shopping-cart:
 *  get:
 *    description: show shopping cart
 *    responses:
 *     200:
 *      description: Sucess
 */
app.get('/shopping-cart', function(req,res){
    if (data.length === 0) {
        return res.status(200).send({
            "success": true, 
            "msg":"your shopping cart is empty you fucking cunt"
        })
    } else {
        return res.status(200).send(data)
    }
})


/**
 * @swagger
 * /add-item:
 *  post:
 *    description: add new item to the shopping cart
 *    parameters:
 *    - item: name of the item
 *      description: name of the item
 *      in: formData
 *      required: true
 *      type: string
 *    responses:
 *     201:
 *      description: Created
 */
app.post('/add-item', function(req,res) {
    const input = req.body
    const inCart = data.find((item)=> item.item === input.item)
    if (inCart) {
        return res.status(200).send({
            "success": true,
            "msg":"this item is already in your shopping cart you son of a bitch"
        })
    }
    else {
        counter += 1
        const new_input = {"id":counter, "item": input.item}
        data.push(new_input)
        return res.status(201).send({
            "success": true,
            "msg":`${input.item} added to your shopping cart`})
        }
    })



/**
 * @swagger
 * /delete-item:
 *  post:
 *    description: del new item from the shopping cart
 *    parameters:
 *    - item: name of the item to del
 *      description: name of the item
 *      in: formData
 *      required: true
 *      type: string
 *    responses:
 *     200:
 *      description: Deleted
 */
app.post('/delete-item', function(req,res){
    const input = req.body
    const toDelete = data.find((item)=> item.item ===input.item)
    if (toDelete){
        data = data.filter((item)=> item.id != toDelete.id)
        return res.send({
            "success": true,
            "msg":`${toDelete.item} was removed from your shopping cart`
        })
    } else {
        return res.send({
            "success": true,
            "msg":`${input.item} was not in your shopping cart`
        })
    }
})

app.listen(5000, function () {
    console.log("server is listening on port 5000...")
})

