export class Usuario{
    id:number
    nickname:string
    clave:string
    estado:number
    nombres:string
    apellidos:string
     
     
    constructor(){
        this.id= 0; //id=0
        this.nickname=''
        this.clave=''
        this.estado=0       
        this.nombres = ''
        this.apellidos = ''
    }
}