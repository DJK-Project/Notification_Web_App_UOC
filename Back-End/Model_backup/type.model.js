'use strict';

module.exports= (sequelize, Datatypes)=>{
    return sequelize.define('user', {
        id:{
            type: Datatypes.UUID,
            primaryKey: true,
            defaultValue:Datatypes.UUIDV4
        },
        description:{
            type: Datatypes.STRING,
            isAlphanumeric:true,
            required:true,
            allowNull:true

        },
        updated_at:{ type: Datatypes.DATE},
        deleted_at:{ type: Datatypes.DATE}
    },
        {
            underscored:true,
            paranoid:true
        });
};
