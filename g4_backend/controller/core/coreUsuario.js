const db = require("../../config/db");


class coreUsuario {

    //get all   
    async getAll() {
        let results = await db.query(`SELECT * FROM core_usuario where estado = 1 order by nombre asc`)
                            .catch(console.log);
        //console.log(results.rows);                 
        return results.rows;
    }

    async conUserNickV1(data){
        try {
            let resul = await db
                 .query("SELECT * FROM core_usuario where nickname = $1 ", [data.nickname ])                  
                 //data.idusuario = resul.rows[0].idusuario     
             return resul;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }

    async conUserNick(data){
        try {
            let resul = await db
                 .query("SELECT * FROM core_usuario where nickname = $1 and clave = $2 ", [data.nickname , data.clave])                  
                 //data.idusuario = resul.rows[0].idusuario     
             return resul;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }
     
    async create(data) {
        await db
            .query("INSERT INTO core_usuario (nickname , clave, estado) VALUES ($1, $2 , $3)", [data.nickname , data.clave, 1])
            .catch(console.log);
        return;
    }

    async getOpcionesMenubyIdUsuario(idusuario){
        try {
            let detalle = await db.query(`select co.* 
                                            from core_opcion co 
                                            inner join core_grupo_opcion cgo on cgo.idopcion = co.id 
                                            inner join core_grupo cg on cg.id = cgo.idgrupo
                                            inner join core_usuario cu on cu.idgrupo = cg.id 
                                            where cu.id = $1 and co.estado = 1 order by id asc`,[idusuario ]) // and d.estado = 1      

            return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }

}

module.exports = coreUsuario;