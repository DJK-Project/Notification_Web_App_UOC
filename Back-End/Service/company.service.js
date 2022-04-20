
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');


module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Company.findAll();
}

async function getById(id) {
    return await getCompany(id);
}

async function create(params) {
    // validate
    if (await db.Company.findOne({ where: { companyname: params.companyname } })) {
        throw 'typecode "' + params.typecode + '" is already registered';
    }

    const company = new db.Company(params);
    
    
    // save company
    await company.save();
}

async function update(id, params) {
    const company = await getUser(id);

    // validate
    const typeChanged = params.typecode && company.typecode !== params.typecode;
    if (typeChanged && await db.Company.findOne({ where: { typecode: params.typecode } })) {
        throw 'typecode "' + params.typecode + '" is already registered';
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // copy params to company and save
    Object.assign(company, params);
    await company.save();
}

async function _delete(id) {
    const company = await getUser(id);
    await company.destroy();
}

// helper functions

async function getCompany(id) {
    const company = await db.Company.findByPk(id);
    if (!company) throw 'Company not found';
    return company;
}
