const { DataTypes } = require('sequelize');

 

module.exports = model;


function model(sequelize) {
    const attributes = {
        location: { type: DataTypes.STRING, allowNull: false },
        typecode: { type: DataTypes.STRING, allowNull: false },
        media: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.BOOLEAN, allowNull: false },
        statusupdatedby: { type: DataTypes.INTEGER, allowNull: false },
        datetime: { type: DataTypes.DATE, allowNull: false },

    };

    const options = {
        
        
                };

                

    return (sequelize).define('Marker', attributes, options);
}
