const {Sequelize, DataTypes, Model} = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/one_piece_db');

class Pirate extends Model {}
class Crew extends Model {}

Pirate.init({
    
    name:{
        type:DataTypes.STRING,
    },
    bounty: DataTypes.INTEGER,
    devilFruit:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    }
},{sequelize:db, modelName:'pirate'});

Crew.init({
    name:{
        type:DataTypes.STRING,
        unique:true
    }
},{sequelize:db, modelName:'crew'});

Crew.belongsTo(Pirate, {as:'captain'});
Pirate.hasOne(Crew,{foreignKey:'captainId'});

Pirate.belongsTo(Pirate, {as:'nakama'});
Pirate.hasMany(Pirate,{foreignKey:'nakamaId'});



const syncAndSeed = async() => {
    try{
    await db.sync({force:true});

    const [strawHat,beastPirates,blackBeardP] = ['Straw Hats', 'Beast Pirates', 'BlackBeard Pirates'].map(currCrew => 
        new Crew({
            name:currCrew,
        }));
    await Promise.all([strawHat.save(),beastPirates.save(),blackBeardP.save()]);

    const [luffy,zoro,sanji] = await Promise.all([new Pirate({
        name:'Monkey D. Luffy',
        bounty: 150000000,
        devilFruit:true,
    }),
    new Pirate({
        name: 'Roronoa Zoro',
        bounty: 32000000,
    }),
    new Pirate({
        name: 'Vinsmoke Sanji',
        bounty:33000000,
    })
    ]);


    await Promise.all([luffy.save(), zoro.save(), sanji.save()]);

    const [kaido,jack,queen] = await Promise.all([new Pirate({
        name:'Kaido',
        bounty: 461110000,
        devilFruit:true,
    }),
    new Pirate({
        name: 'Jack',
        bounty: 100000000,
        devilFruit:true
    }),
    new Pirate({
        name: 'Queen',
        bounty:132000000,
        devilFruit:true,
    })
    ]);

    await Promise.all([kaido.save(), jack.save(), queen.save()]);

    const [teach,burgess,shiryu] = await Promise.all([new Pirate({
        name:'Marshall D. Teach',
        bounty: 224760000,
        devilFruit:true,
    }),
    new Pirate({
        name: 'Jesus Burgess',
        bounty: 2000000,
    }),
    new Pirate({
        name: 'Shiryu',
        bounty:33000000,
        devilFruit:true,
    })
    ]);
    
    await Promise.all([teach.save(), burgess.save(), shiryu.save()]);

    strawHat.captainId = luffy.id;
    beastPirates.captainId = kaido.id;
    blackBeardP.captainId = teach.id;

    await Promise.all([strawHat.save(), beastPirates.save(), blackBeardP.save()]);

    zoro.nakamaId = luffy.id;
    sanji.nakamaId = luffy.id;
    jack.nakamaId = kaido.id;
    queen.nakamaId = kaido.id;
    burgess.nakamaId = teach.id;
    shiryu.nakamaId = teach.id;

    await Promise.all([zoro.save(), sanji.save(), jack.save(), queen.save(), burgess.save(), shiryu.save()]);

    }
    catch(ex){
        console.log(ex);
    }
};

module.exports={
    db,
    syncAndSeed,
    models:{
        Pirate,
        Crew,
    },
}