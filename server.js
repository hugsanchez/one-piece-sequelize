const {db,syncAndSeed} = require('./db/dataLayer');
const express = require('express');
const path = require('path')

const app = express();

const port = process.env.PORT || 3000;
app.use(require('method-override')('_method'));
app.use(express.urlencoded({extended:false}))
app.use('/', require('./routes.js'));

app.use('/styles.css', express.static(path.join(__dirname, 'styles.css')));


const init = async() => {
    try{
        await db.sync({force:true});
        await syncAndSeed();
        app.listen(port, ()=> console.log(`listening on port ${port}`));
    }
    catch(ex){
        console.log(ex);
    }
};
init();