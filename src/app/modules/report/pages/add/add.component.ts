import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { ReportService } from 'src/app/services/reports/report.service';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  
  locale = 'pt-br';

  text = "adicionar novo relatorio";

  loading = false;

  msg = null;

  form: FormGroup = this.fb.group({
    corretor: this.fb.control(''),
    id: this.fb.control(''),
    status: this.fb.control(''),
    endereco: this.fb.control(''),
    date: this.fb.control(''),
  })

  constructor(
    private fb: FormBuilder,
    private _localeService: BsLocaleService,
    private rs: ReportService
  ) {
    this._localeService.use(this.locale);
  }

  ngOnInit() {
    this.rs.Pushed.subscribe(data => {
      if (data) {
        this.loading = false;
        this.text = "adicionar novo relatorio";
        this.form.reset();
        this.msg = true;
      }
    })
  }

  adicionarVistoria () {
    this.loading = true;
    this.text = "enviado...";
    this.rs.createReport(this.form);
    
  }

}
