'use strict';

module.exports= (sequelize, Datatypes)=>{
    return sequelize.define('marker', {
        id:{
            type: Datatypes.UUID,
            primaryKey: true,
            defaultValue:Datatypes.UUIDV4
        },
        location:{
            type: Datatypes.STRING,
            isAlphanumeric:true,
            required:true,
            allowNull:true
        },
        media:{
            type: Datatypes.STRING,
            required:true,
            allowNull:true
        },
        description:{
            type:Datatypes.STRING,
            required:true,
            allowNull:true,
            len:[8, 20]
        },
        status:{
            type:Datatypes.BOOLEAN,
            required:true,
            allowNull:true,
            
        },
        datetime:{
            type:Datatypes.DATE,
            required:true,
            allowNull:true,
            
        },
        updated_at:{ type: Datatypes.DATE},
        deleted_at:{ type: Datatypes.DATE}
    },
        {
            underscored:true,
            paranoid:true
        });
};