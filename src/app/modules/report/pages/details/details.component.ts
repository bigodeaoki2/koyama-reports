import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/reports/report.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  private id;
  public report = [];
  public modal = {active: false, title: ''}
  public input = { value: '', status: false, path:'' };
  dateString = '';

  signs = ["Administradora: Koyama Imóveis Ltda."];

  files: File[] = [];

  filesCategorias = {};
  
  button = {
    text: "Esconder Imagem na Impressão",
    status: false
  }

  sign = {
    admin : ''
  }

  formCategoria: FormGroup = this.fb.group({
    title: this.fb.control('')
  })
  formComodo: FormGroup = this.fb.group({
    comodo: this.fb.control('')
  })

  public numbers = [1,2,3,4,5,6,7,8,9];

  private editObject = {}

  constructor(private reportService: ReportService, private activated: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.activated.params.subscribe( param => {
      this.id = param.id;
      this.getDetails();
    });
    this.getDate();
  }

  public getDetails() {
    this.reportService.getReports().subscribe( data => {

      this.report = data.filter(a => {
        if (a.key == this.id) return a;
      });

      // filesCategoria
      this.filesCategoria (this.report[0].info.imovel);

    });
  }

  filesCategoria (imovel) {

    if (imovel.categorias) {
      for (let i =0; i < imovel.categorias.length; i++) {
        this.filesCategorias[i] = {};
        if (imovel.categorias[i].entradas) {
          for( let j=0; j < imovel.categorias[i].entradas.length; j++) {
            this.filesCategorias[i][j] = [];
          }
        }
      }
    }

  }

  public editField(inside ,countParent ,countChild ,obj ,field) {

    this.modal.active = true;
    this.modal.title = field;
    
    this.input.value = obj[field];
    
    if (inside == 'cat') {
      this.input.status = true;
      this.input.path = "categorias/"+countParent+"/entradas/"+countChild
    }

    if (inside == 'nome') {
      this.input.status = true;
      this.input.path = "categorias/"+countParent;
    }
  }

  public endEditField (field) {
    this.modal.active = false;
    this.editObject = {};
    this.editObject[field] = this.input.value;
    this.reportService.editField(this.id, this.input, this.editObject);
  }

  public deleteImg (parentCounter, childCounter, counter, obj) {
    
    let imgsStatus = [];
    for (let i=0; i < obj.imgs.length; i++) {
      if ( i === counter) {
        imgsStatus.push(1);
      } else {
        imgsStatus.push(0);
      }
    }

    if (obj.hidemigs) {
      imgsStatus = obj.hidemigs;
    }

    imgsStatus[counter] = 1;

    let path = "categorias/"+parentCounter+"/entradas/"+childCounter+"/hidemigs/";
    this.reportService.removeImg(this.id, path, imgsStatus);
  }


  biggerImg (event) {
    let el = event.target.parentElement;
    el.classList.toggle('enlarge');
  }

  toggleModal () {
    this.modal.active = !this.modal.active;
  }

  setImage (val) {

    if (val) {
      this.button.text = "Esconder Imagem na Impressão";
    } else {
      this.button.text = "Mostrar Imagem na Impressão";
    }

    this.button.status = !val;
  }

  changeName () {
    if (this.sign.admin != '') {
      this.signs.push(this.sign.admin);
      this.sign.admin = "";
    }
  }

  getDate() {
    let d = new Date();
    let m = d.getMonth();
    const arr = ['Janeiro','Feveiro','Março','Abril','Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];


    this.dateString = `${d.getDate()} de ${arr[m]} de ${d.getFullYear()}`;
  }

  setNewName (event) {
    this.sign.admin = event.target.value;
  }

  check (key, i) {

    let answer = window.confirm("Tem Certeza?");
    if (answer) {

      this.reportService.deleteCategory(key, i);
    }
  }

  // Upload de fotos
  onSelect (e,i?,j?) {

    if (i != null) {
      this.filesCategorias[i][j].push(...e.addedFiles);  
    } else {
      this.files.push(...e.addedFiles);  
    }
  }

  onRemove(event, i?, j?) {
    console.log('oi');
    console.log(j);
    if (i != null) {
      this.filesCategorias[i][j].splice(this.filesCategorias[i][j].indexOf(event), 1);
    } else {
      this.files.splice(this.files.indexOf(event), 1);
    }
  }

  addFotos (content: string, counter: number, j:number) {
    let target;

    if(content === "gerais") {
      target = this.report[0].info.imovel.imgs = [];
      for (let i = 0; i < this.files.length; i++) { 
        let img = new FileReader()
        img.readAsDataURL(this.files[i])
        img.onload = (_event) => {
          target.push(img.result)
        }
      }    
    } else {
      target = this.report[0].info.imovel.categorias[counter].entradas[j].imgs = [];
      for (let i = 0; i < this.filesCategorias[counter][j].length; i++) { 
        let img = new FileReader()
        //console.dir(this.filesCategorias[counter][j]);
        img.readAsDataURL(this.filesCategorias[counter][j][i])
        img.onload = (_event) => {
          target.push(img.result)
        }
      }
    }

  }

  addCategoria () {
    this.reportService.addCategory(this.formCategoria, this.report[0]);
    if (this.report[0].info.imovel.categorias) {
      this.filesCategorias[this.report[0].info.imovel.categorias.length] = {}
    }else {
      this.filesCategorias[0] = {}
    }
    //console.dir(this.report[0])
  }
  addComodo(i) {
    this.reportService.addComodo(this.formComodo, this.report[0], i);
    if (this.report[0].info.imovel.categorias[i].entradas) {
      this.filesCategorias[i][this.report[0].info.imovel.categorias[i].entradas.length] = [];
    }else {
      this.filesCategorias[i][0] = [];
    }
    
  }

}
