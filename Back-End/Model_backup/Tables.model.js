const { DataTypes } = require('sequelize');
const Sequelize = require('sequelize')

/*******************
** DB DEFINITIONS **
********************/
module.exports = model;


function model(sequelize) {

    var User = sequelize.define('Users', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },

        email: { type: DataTypes.STRING, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        mobile:{type: DataTypes.INTEGER(11), allowNull: false},
        role: { type: DataTypes.STRING, allowNull: false },
    

    created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
} 
);

var Marker = sequelize.define('Markers', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },

    location: { type: DataTypes.STRING, allowNull: false },
        media: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.BOOLEAN, allowNull: false },
        datetime: { type: DataTypes.DATE, allowNull: false },

    created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
});

var Company = sequelize.define('companies', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },

    email: { type: DataTypes.STRING, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        companyname: { type: DataTypes.STRING, allowNull: false },
        mobile:{type: DataTypes.INTEGER(11), allowNull: false},
        role: { type: DataTypes.STRING, allowNull: false },

    created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
});
var Type = sequelize.define('types', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },

    description: { type: DataTypes.STRING, allowNull: false },

    created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}
);





/********************
** DB RELATIOSHIPS **
*********************/

User.hasMany(Marker,{onDelete:'CASCADE',onUpdate:'CASCADE'});

Marker.belongsTo(User);
Marker.belongsTo(Type);

Company.hasMany(Type,{onUpdate:'CASCADE'});

Type.hasMany(Marker,{onDelete:'CASCADE',onUpdate:'CASCADE'});
Type.belongsTo(Company);

return (sequelize);
}