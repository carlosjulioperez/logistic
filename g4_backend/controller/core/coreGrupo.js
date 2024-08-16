const db = require("../../config/db");

class coreGrupo {

    //get all   
    async getAll() {
        let results = await db.query(`SELECT * FROM core_grupo where estado = 1 order by nombre asc`)
                            .catch(console.log);
        //console.log(results.rows);                 
        return results.rows;
    }

    async getObjectById(id) {
        let results = await db.query(`SELECT * FROM core_grupo where idgrupo = $1 `,[id])
                            .catch(console.log);
        //console.log(results.rows);                 
        return results;
    }

     
    async create(data) {
        try {
           let resul = await db
                .query("INSERT INTO core_grupo (nombre , descripcion, estado) VALUES ($1, $2 , $3) RETURNING idgrupo", [data.nombre , data.descripcion, 1])
                 
                data.idgrupo = resul.rows[0].idgrupo     
            return data;
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }    
    }

    async createOrUpdate(data) {
        try {
            let resul ;

            if (data.idgrupo == 0) {
                resul = await db
                    .query("INSERT INTO core_grupo (nombre , descripcion, estado) VALUES ($1, $2 , $3) RETURNING idgrupo"
                     ,[data.nombre , data.descripcion, 1])                 
                data.idgrupo = resul.rows[0].idgrupo     
            }else{
                resul = await db
                    .query("UPDATE core_grupo set nombre = $2 , descripcion = $3, estado = $4 where idgrupo = $1 "
                     ,[ data.idgrupo , data.nombre , data.descripcion, data.estado])   

            }

            return data;
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }    
    }

    async update(id , estado) {
        try {
            await db.query(`Update core_grupo set estado = $2 where idgrupo = $1`, [id , estado])
            //.catch(console.log);  
            return id;
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }           
    }

}

module.exports = coreGrupo;