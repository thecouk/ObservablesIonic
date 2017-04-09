import { Component } from '@angular/core';
import { Observable } from 'rxjs/rx';
import 'rxjs/add/operator/map';

//Agrego el modelo de datos
import { Person } from '../../models/person.model';
//Incluyo el servicio de personas
import { PersonasService } from '../../providers/personas-service'


@Component({
  selector: 'mis-personas',
  templateUrl: 'mis-personas.html'
})
export class MisPersonasComponent {
  //Creo mi variable que contendra los datos observados
  personas: Observable<Person[]>;    

  constructor(public personasService : PersonasService) {
  }

  //Cuando ya esta lista la aplicacion realizo la invocación del servicio
  ngOnInit() {
        //Solicito la peticion de los datos
        this.personasService.cargarTodas();
        //Asigno a mi variable los datos actualizados
        this.personas = this.personasService.personas;
    }

  //Función para indicar que le gusta una persona
  marcarMeGusta(persona:Person,estado:boolean)
  {      
      //Solicito petición de actualizar
      this.personasService.marcarMeGusta(persona,estado);      
  }

  //Función para agregar una nueva persona
  agregar()
  {      
      //Solicito petición de agregar personas y actualizar
      this.personasService.agregarPersona();      
  }

  //Función para agregar una nueva persona
  eliminar(id:number)
  {    
      //Solicito petición de elminar personas y actualizar  
      this.personasService.eliminarPersona(id);      
  }

}
