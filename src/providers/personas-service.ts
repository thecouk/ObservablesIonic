import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
//Incluyo las dependencias para trabajar con Observables
import { Observable } from 'rxjs/rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

//Incluyo mi modelo de datos
import { Person } from '../models/person.model';

@Injectable()
export class PersonasService {
  personas: Observable<Person[]> //Variable que tendra las personas observadas
  private _todas: BehaviorSubject<any[]>;//Es necesario crear un Sujeto que sera el encargado de inicializar el observable
  private baseUrl: string;//Variable para definir mi ruta al API
  //Creo un objeto que contendra todos los datos
  private almacenDatos: {
    personas: Person[] //Asigno los datos en base a mi model
  };

  constructor(public http: Http) {
        this.baseUrl = 'http://localhost:3000/personas';//Ruta al API recuerda estoy utilizando json-server
        //Inicializo el objeto contenedor de datos
        this.almacenDatos = { 
                            personas: [] 
                          };
        this._todas = <BehaviorSubject<Person[]>>new BehaviorSubject([]); //Inicializo el sujeto
        this.personas = this._todas.asObservable();//Le digo a mi objeto de personas que el sujeto sera un observable        
  }

  //Función para invocar los datos
  cargarTodas() {
    //llamo la primera vez al despliegue de datos (esto para que en cuanto cargue la aplicación se muestren los datos)
    this.todoslosDatos();
    
    /*Configuro el tiempo de llamada de actualización de datos
    Recuerdas que si hay un cambio en la base de datos 
    o si alguna otra persona con la aplicacion hace algun evento
    no nos enterariamos a menos que llamemos nuevamente al API?
    Bueno con esto conseguimos lograrlo sino hay otro evento como
    GET,POST,PUT,DELETE*/
    this.configurarTiempo();
    
  }

  //Función para invocar los datos
  todoslosDatos()
  {
   this.http.get(this.baseUrl)    //Invoco el API        
            .map(response => response.json())  //Mapeo los datos        
            .subscribe(data => { //Realizo la suscripcion 
                                  //Actualizo el contenedor de datos con los datos recibidos
                                  this.almacenDatos.personas = data;
                                  //Pido que se refleje los cambios basado en la nueva data
                                  this._todas.next(Object.assign({}, this.almacenDatos).personas);            
                               }, 
                       error => console.log('No se pueden cargar los datos.'));
  }

  //Función para configurar el tiempo
  configurarTiempo(){
        //Configuro que cada segundo invoque al API
        /*Esto definitivamente sobre cargara nuestra API
        pero para que veas incluso en dos navegadores al mismo 
        tiempo como se actualiza las vistas si es que hay un evento en una de ellas
        luego puedes subirla a unos 60000 que seria un minuto o la cantidad que consideres mejor
        */
        setInterval(() => {
          //Llamo a la funcion de solicitud de datos
           this.todoslosDatos();       
        }, 1000);
  }

  //Función para actualizar le gusta de la persona
  marcarMeGusta(persona:Person,estado:boolean) {
    //Modifico la propiedad megusta con el estado
    //antes de enviar la peticion 
    persona.megusta=estado;
            //Invoco al API y envio los datos a cambiar
            this.http.put(this.baseUrl+'/'+persona.id, persona)
            .map(response => response.json()) //Mapeo la respuesta
            .subscribe(data => {
               //Recorro el objeto ya visualizado para poder actualizar
               //solo el item que nos interesa
                this.almacenDatos.personas.forEach((t, i) => {
                  if (t.id === data.id) { 
                    this.almacenDatos.personas[i] = data; 
                  }
                });
                //Pido que se refleje los cambios basado en la nueva data
                this._todas.next(Object.assign({}, this.almacenDatos).personas);
            }, error => console.log('No Puede Actualizar'));

          }
         //Función para invocar crear una persona
          agregarPersona(){
            //Configuro el objeto persona para crearse
            let nuevapersona = new Person(0,'Persona Nueva',"Programador",false);
            this.http.post(this.baseUrl, nuevapersona)
                     .map(response => response.json()).subscribe(data => {
                        this.almacenDatos.personas.push(data);
                        this._todas.next(Object.assign({}, this.almacenDatos).personas);
                      }, error => console.log('No puede crearse.'));
                
          }

          //Función para invocar elminar a una persona
          eliminarPersona(id:number){
                this.http.delete(this.baseUrl+"/"+id)
                .subscribe(response => {
                this.almacenDatos.personas.forEach((t, i) => {
                  if (t.id === id) { 
                    this.almacenDatos.personas.splice(i, 1); 
                  }
                });
                this._todas.next(Object.assign({}, this.almacenDatos).personas);
              }, error => console.log('No se puede eliminar.'));
          }

}
