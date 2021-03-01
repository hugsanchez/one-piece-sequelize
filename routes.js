const {models:{ Pirate, Crew, }} = require('./db/dataLayer');
const router = require('express').Router();
module.exports = router;

router.get('/', async(req,res,next) => {
    try{
        const [crews, pirates] = await Promise.all([
            Crew.findAll({
                include:[{model:Pirate, as:'captain'}],
                order:[['id']]}), 
            Pirate.findAll({
                order:[['name']]
            })
        ]);

        res.send(`<html>
            <head>
                <link rel='stylesheet' href='styles.css' />        
            </head>
            <body>
                <h1>ONE PIECE</h1>
                <div>
                    ${
                        crews.map(currCrew => `
                            <div>
                                <ul ${currCrew.id ===2 ? 'class="middle"' : ''}>${currCrew.name.toUpperCase()}
                                <br/>
                                <a class='links' href='/addNakama/${currCrew.captainId}'>ADD NAKAMA </a>
                                
                                <li>(CAPTAIN: ${currCrew.captain.name.toUpperCase()})</li>
                                <div class='money'>Bounty: $${currCrew.captain.bounty}</div>
                                <div class='fruit'>Devil Fruit: ${currCrew.captain.devilFruit}</div>
                                ${
                                    pirates.map(currP => `
                                        ${currP.nakamaId === currCrew.captain.id ? `<li>${currP.name.toUpperCase()}</li>
                                                                                 <div class='money'>Bounty: $${currP.bounty}</div>
                                                                                <div class='fruit'>Devil Fruit: ${currP.devilFruit}</div>
                                        ` : ''}
                                        
                                    `).join('')   
                                }
                                </ul>
                            </div>
                        `).join('')
                    }
                </div>
            </body>
        </html>`)
    }
    catch(ex){
        next(ex);
    }
})

router.get('/addNakama/:id', (req,res,next) => {
    try{
        res.send(`
        <html>
            <body>
                <form method="post" action="/?_method=PUT">
                    <label for="name">Name</label>
                    <input type="DataTypes.STRING" name="name" required/>
                    <label for="bounty">Bounty</label>
                    <input type="number" name="bounty" required/>
                    <label for="devilFruit">Devil Fruit</label>
                    <input type="boolean" name="devilFruit" placeholder="true or false" required/>
                    <label for="nakamId">ID SET</label>
                    <input name='nakamaId' value="${req.params.id}" readonly/>
                <button type="submit">Submit</button>
                </form>
            </body>
        </html>
        `)
    }
    catch(ex){
        next(ex);
    }
});

router.put('/', async(req,res,next) => {
    try{
    const name = req.body.name;
    const bounty = req.body.bounty;
    const devilFruit = req.body.devilFruit;
    const id = req.body.nakamaId;
    

    await Pirate.create({
        name: name,
        bounty: bounty,
        devilFruit: devilFruit,
        nakamaId: id
    });

    res.redirect('/')

    }
    catch(ex){
        next(ex)
    }
})

