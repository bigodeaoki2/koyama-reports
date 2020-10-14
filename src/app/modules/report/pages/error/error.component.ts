import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/reports/report.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  private id;
  public imgs = [];

  constructor(private reportService: ReportService, private activated: ActivatedRoute) { }

  ngOnInit() {
    this.activated.params.subscribe( param => {
      this.id = param.id;
      this.getErrorInfo();
    });
  }

  getErrorInfo() {
    this.reportService.getErrorReport().subscribe( data => {
      let arr = [];
      let bigArr:any = [];
      for (let i = 0; i < data.length; i++) {
        if (typeof data[i] == "string") {
          arr.push(data[i])
        }

        if (typeof data[i] == "object") {
          bigArr = data[i]
        }
      }
      this.imgs = arr.concat(bigArr);
    });
  }

}
