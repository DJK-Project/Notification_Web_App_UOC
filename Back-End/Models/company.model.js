const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        companyname: { type: DataTypes.STRING, allowNull: false },
        typecode: { type: DataTypes.STRING, allowNull: false }
        
    };

    const options = {
        
    };

    return sequelize.define('Company', attributes, options);
    
}