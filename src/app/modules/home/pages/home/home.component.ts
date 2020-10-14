import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/reports/report.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  public count;
  constructor(private reportService: ReportService, private router: Router) { }

  ngOnInit() {
    this.getReports();
  }

  getReports () {
    this.reportService.getReportsCount().subscribe( (data:any) => {
      this.count = data[0];
    });
  }

  goToReportList () {
    this.router.navigate(["/reports"]);
  }

  goToJoint() {
    this.router.navigate(['/join'])
  }

  goToAgenda () {}

  addTestReport () {
    //this.reportService.addTestReport();
  }

}
