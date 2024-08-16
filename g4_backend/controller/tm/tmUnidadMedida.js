const db = require("../../config/db");

class tmUnidadMedida {

    //get all   
    async getAll() {
        let results = await db.query(`SELECT * FROM tm_unidad_medida where estado = 1 `)
                            .catch(console.log);
        //console.log(results.rows);                 
        return results.rows;
    }

     
    async create(data) {
        await db
            .query("INSERT INTO tm_unidad_medida (nombre , descripcion, estado) VALUES ($1, $2 , $3)", [data.nombre , data.descripcion,1])
            .catch(console.log);
        return;
    }

}

module.exports = tmUnidadMedida;