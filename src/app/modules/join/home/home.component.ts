import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReportService } from 'src/app/services/reports/report.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild(`select1`) select1: ElementRef;
  @ViewChild(`select2`) select2: ElementRef;
  @ViewChild(`select3`) select3: ElementRef;
  active = true;
  items = [];

  constructor(private report: ReportService) { }

  ngOnInit() {
    this.report.getReportsList().subscribe( data => {
      this.active = false;
      this.items = data;
    })
  }

  check () {
    let confirm = window.confirm("Tem certeza?");
    if (confirm) {
      console.log("Enviando")
      let id1 = this.select1.nativeElement.value;
      let id2 = this.select2.nativeElement.value;
      let id3 = this.select3.nativeElement.value;
      console.log(id1, id2, id3);
      this.report.editReport(id1, id2, id3);
    }
  }

}
