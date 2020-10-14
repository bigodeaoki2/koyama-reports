import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CopyService {

  constructor(private db: AngularFireDatabase) {}

  copyPhotos () {
    this.db.object('/reports/-LkA7vuP9YTKTIHgJYyO').valueChanges().subscribe(
      (data:any) => {
        console.dir(data);
        const imgsList = data.imovel.imgs;
        let imgs  = []
        for (let i=8; i < 9; i++) {
          imgs.push(imgsList[i]);
        }
        let path = "/reports/-Lk9v9VFynCOp9I5xspF/imovel/categorias/3/entradas/5/imgs";

        this.db.object(path).update(imgs);

      }
    );

  }

}
