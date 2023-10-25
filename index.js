const restify = require("restify");
const errors = require("restify-errors");

const servidor = restify.createServer({
    name : 'loja' ,
    version : '1.0.0'
});

servidor.use( restify.plugins.acceptParser(servidor.acceptable) );
servidor.use( restify.plugins.queryParser());
servidor.use( restify.plugins.bodyParser());

servidor.listen( 8001 , function(){
    console.log("%s executando em http://127.0.0.1:8001", 
    servidor.name);
});

var knex = require('knex')({
    client : 'mysql' ,
    connection : {
        host : 'localhost' ,
        user : 'root' ,
        password : '' ,
        database : 'loja'
    }
});

servidor.get( '/' , (req, res, next) => {
    res.send('Bem-vindo(a) `a API Loja!');
});

servidor.get( '/produtos' , (req, res, next) => {
    knex('produtos').then( (dados) =>{
        res.send( dados );
    }, next) ; 
});

servidor.get( '/produtos/:idProd' , (req, res, next) => {
    const idProduto = req.params.idProd;
    knex('produtos')
        .where( 'id' , idProduto)
        .first()
        .then( (dados) =>{
            if( !dados || dados =="" ){
                return res.send(
                    new errors.BadRequestError('Produto não encontrado'));
            }
            res.send( dados );
        }, next) ; 
});

servidor.get( '/pedidos' , (req, res, next) => {
    knex('pedidos').then( (dados) =>{
        res.send( dados );
    }, next) ; 
});

servidor.get( '/clientes' , (req, res, next) => {
    knex('clientes').then( (dados) =>{
        res.send( dados );
    }, next) ; 
});

servidor.get( '/pedidos_produtos' , (req, res, next) => {
    knex('pedidos_produtos').then( (dados) =>{
        res.send( dados );
    }, next) ; 
});


servidor.post( '/produtos' , (req, res, next) => {
    knex('produtos')
        .insert( req.body )
        .then( (dados) =>{
            res.send( dados );
        }, next) ; 
});

servidor.post( '/pedidos' , (req, res, next) => {
    knex('pedidos')
        .insert( req.body )
        .then( (dados) =>{
            res.send( dados );
        }, next) ; 
});

servidor.post( '/clientes' , (req, res, next) => {
    knex('clientes')
        .insert( req.body )
        .then( (dados) =>{
            res.send( dados );
        }, next) ; 
});

servidor.post( '/pedidos_produtos' , (req, res, next) => {
    knex('pedidos_produtos')
        .insert( req.body )
        .then( (dados) =>{
            res.send( dados );
        }, next) ; 
});

servidor.put('/produtos/:idProd', (req, res, next) => {
    const idProduto = req.params.idProd;
    const { nome, preco, quantidade, categoria_id } = req.body;

    knex('produtos')
        .where('id', idProduto)
        .update({
            nome: nome,
            preco: preco,
            quantidade: quantidade,
            categoria_id: categoria_id
        })
        .then((dados) => {
            if (dados === 0) {
                return res.send(new errors.BadRequestError('Produto não encontrado'));
            }
            res.send("Produto Atualizado");
        })
        .catch(next);
});

servidor.del('/produtos/:idProd', (req, res, next) => {
    const idProduto = req.params.idProd;
    knex('produtos')
        .where('id', idProduto)
        .delete()
        .then((dados) => {
            if (dados === 0) {
                return res.send(new errors.BadRequestError('Produto não encontrado'));
            }
            res.send("Produto Deletado");
        })
        .catch(next);
});

servidor.del( '/clientes/:idCli' , (req, res, next) => {
    const idCliente = req.params.idCli;
    knex('clientes')
        .where( 'id' , idCliente)
        .delete()
        .then((dados) => {
            if (dados === 0) {
                return res.send(
                    new errors.BadRequestError('Cliente não encontrado'));
            }
            res.send( "Cliente Deletado" );
        }, next) ;
});
