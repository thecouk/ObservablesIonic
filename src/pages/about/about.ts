import { Component , ViewChild} from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  twitter: string = "@TheCouk";
  @ViewChild('myVar') myVar:HTMLElement;
  constructor(public navCtrl: NavController) {

  }

  showAlert(){
    alert('hola');
  }

  changeDom(){
    this.myVar.innerHTML='Hola Universo...';
  }

}
