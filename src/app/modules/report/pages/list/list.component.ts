import { CopyService } from './../../../../services/copy/copy.service';
import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/reports/report.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  
  public list;
  constructor(private reportService: ReportService, private copyService: CopyService) { }

  ngOnInit() {
    this.getReports();
    //this.copyPhotos();
  }

  public getReports () {
    this.reportService.getReportsList().subscribe( data => {
      this.list = data;
    })
  }

  copyPhotos () {
    this.copyService.copyPhotos()
  }


}
