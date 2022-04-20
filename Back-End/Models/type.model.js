const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        typecode: {type: DataTypes.STRING, allowNull: false},
        description: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        
                };

    return sequelize.define('Type', attributes, options);
}
