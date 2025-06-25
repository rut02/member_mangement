import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { ChartConfiguration } from 'chart.js';
// import { NgChartsModule } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective, provideCharts } from 'ng2-charts';

@Component({
  selector: 'app-age-report',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatCardModule,
  ],
  templateUrl: './age-report.component.html',
  styleUrl: './age-report.component.scss',
})
export class AgeReportComponent implements OnInit {
  barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'จำนวนสมาชิกตามอายุ' }],
  };
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
  };

  constructor(private membersService: MembersService) {}

  ngOnInit() {
    this.membersService.getAgeReport().subscribe({
      next: (report) => {
        this.barChartData.labels = report.map((item) => item.age.toString());
        this.barChartData.datasets[0].data = report.map((item) => item.count);
      },
    });
  }
}