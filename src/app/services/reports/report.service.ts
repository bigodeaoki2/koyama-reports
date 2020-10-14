import { getAttrsForDirectiveMatching } from '@angular/compiler/src/render3/view/util';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

//import jsonTest from '../reports/koyama.json';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  Pushed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private db: AngularFireDatabase) {}

  public getReports() : Observable<any> {
    return this.db.list("reports").snapshotChanges().pipe( map(items => {
      return items.map( a => {
        let obj = {
          info: a.payload.val(),
          key: a.payload.key
        }
        return obj;
      })
    }));
  }

  public getReportsCount () {
    return this.db.list("entries").valueChanges()
  }

  public getReportsList () {
    return this.db.list("list").valueChanges()
  }

  public editField (id, obj, fieldValue){

    const path = "reports/"+id+"/imovel/"+ obj.path;
    return this.db.object(path).update(fieldValue);

  }

  public removeImg (id, imgpath, updatedObj) {
    const path = "reports/"+id+"/imovel/"+imgpath;
    return this.db.object(path).update(updatedObj);
  }

  public getErrorReport() {
    return this.db.list("backup/imgs").snapshotChanges().pipe( map(items => {
      return items.map( a => {
        let obj = a.payload.val();
        return obj;
      })
    }));
  }

  editReport (id1, id2, id3) {
    let path = "reports/"+id1;
    let path2 = "reports/"+id2;
    let path3 = "reports/"+id3;
    
    let a;
    let b;
    let c;

    let obj;

    this.db.list(path).valueChanges().subscribe(
      (res) => { 
        a = res;
        this.db.list(path2).valueChanges().subscribe(
          (res) => {
            b = res; 
            obj = this.setNewObj(a,b);
            if (id3 != '') {
              this.db.list(path3).valueChanges().subscribe(
                (res) => {
                  c = res; 
                  obj = this.setNewObj(obj,c);
                  this.pushNewEntry(obj);
                }
              );
            } else {
              this.pushNewEntry(obj);
            }
          }
        );
      }
    );
    

  }

  setNewObj (a,b) {
    for (let i=0; i < b[0].categorias.length; i++) {
      a[0].categorias.push(b[0].categorias[i]);
    }
    return a;
  }

  pushNewEntry (a) {
    let obj = {
      imovel : a[0]
    }
    obj.imovel.id = "Relatorio - " + obj.imovel.id;
    const pushedElementResponse = this.db.list("/reports").push(obj);
    let key = pushedElementResponse.key;

    let objList = {
      corretor: obj.imovel.corretor,
      data: obj.imovel.data,
      id: key,
      imovel: obj.imovel.corretor
    }

    this.db.list("/list").push(objList);
  }


  deleteCategory (key, i) {
    let path = "/reports/"+key;
    let a;
    this.db.list(path).valueChanges().subscribe(
      (res) => {
        a = res;

        let obj = a[0].categorias;
        obj.splice(i,1);

        let b = {
          imovel: a[0]
        }

        return this.db.object("/reports/"+key).update(b);
        
      }
    );
  }

  /*
  addTestReport () {
    
    console.dir(jsonTest);
    
    let obj = {
      imovel : jsonTest.imovel
    }
    
    //obj.imovel.id = "Relatorio - " + obj.imovel.id;
    console.dir(obj);

    const pushedElementResponse = this.db.list("/reports").push(obj);

    let key = pushedElementResponse.key;
    
    console.dir(key);

    let objList = {
      corretor: obj.imovel.corretor,
      data: obj.imovel.data,
      id: key,
      imovel: obj.imovel.id
    }

    this.db.list("/list").push(objList);
  }
  */


  // novos

  createReport(form: FormGroup){
    
    //console.dir(form);
    
    var data = new Date(form.value.date);
    var dia  = data.getDate().toString().padStart(2, '0');
    var mes  = (data.getMonth()+1).toString().padStart(2, '0');
    var ano  = data.getFullYear();

    const obj = {
      imovel: {
        corretor: form.value.corretor,
        idImovel: form.value.id,
        data: dia+"/"+mes+"/"+ano,
        imovel: form.value.endereco,
        status: form.value.status,
        obs: "",
        categorias: []
      }
    }
    console.dir(obj);
    const pushedElementResponse = this.db.list("/reports").push(obj);

    let key = pushedElementResponse.key;

    let objList = {
      corretor: form.value.corretor,
      data: dia+"/"+mes+"/"+ano,
      id: key,
      imovel: form.value.endereco,
      idImovel: form.value.id
    }

    this.db.list("/list").push(objList).then( () => {
      this.Pushed.next(true);
    })

  }

  addCategory (form, report) {
    //console.dir(report);
    
    const obj = [];

    if (report.info.imovel.categorias) {
      for(let i=0; i < report.info.imovel.categorias.length; i++) {
        obj.push(report.info.imovel.categorias[i]);
      }
    }

    //console.dir(obj)

    let newObj = {
      nome: form.value.title,
      entradas: []
    }

    obj.push(newObj);
    
    const path = "reports/"+report.key+"/imovel/categorias";
    return this.db.object(path).update(obj);
  }
  addComodo (form, report, i) {
    
    const obj = [];
    //console.log(i);
    //console.dir(report);
    if (report.info.imovel.categorias[i].entradas) {
      for(let j=0; j < report.info.imovel.categorias[i].entradas.length; j++) {
        obj.push(report.info.imovel.categorias[i].entradas[j]);
      }
    }        
    
    let newObj = {
      nome: form.value.comodo
    }

    obj.push(newObj);
    const path = "reports/"+report.key+"/imovel/categorias/"+i+"/entradas/";
    //console.dir(path)
    return this.db.object(path).update(obj);
  }  
}
