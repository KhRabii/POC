import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as Plotly from 'plotly.js';
import {DataService} from "../services/DataService";
import * as echarts from "echarts";

@Component({
  selector: 'app-heatmap',
  standalone: true,
  templateUrl: './correlation.component.html'
})
export class CorrelationComponent implements OnInit, AfterViewInit  {
  @ViewChild('heatmapContainer') heatmapContainer!: ElementRef;
  heatmapChart?: echarts.ECharts;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    console.log("correlation component");
    this.dataService.getCorrelationMatrix().subscribe(response => {
      const options = this.prepareOptionsForEChart(response);
      this.initializeChart(options);
    });
  }

  ngAfterViewInit() {
    this.heatmapChart = echarts.init(this.heatmapContainer.nativeElement);
  }

  initializeChart(options: any) {
    if (this.heatmapChart) {
      this.heatmapChart.setOption(options);
    }
  }

  prepareOptionsForEChart(jsonData: any) {
    const keys = Object.keys(jsonData);
    const data: HeatmapDataPoint[] = []; // Use the defined type here

    // Transforming the data into the format required by ECharts
    keys.forEach((rowKey, rowIndex) => {
      keys.forEach((colKey, colIndex) => {
        // Ensure that the value exists; otherwise, use a default value like 0
        const value = jsonData[rowKey][colKey] != null ? jsonData[rowKey][colKey] : 0;
        data.push([rowIndex, colIndex, value]);
      });
    });

    // ECharts options for heatmap
    return {
      tooltip: {
        position: 'top'
      },
      grid: {
        height: '50%',
        top: '10%'
      },
      xAxis: {
        type: 'category',
        data: keys,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: keys,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: 1,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
      },
      series: [{
        name: 'Correlation',
        type: 'heatmap',
        data: data,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  }


}
type HeatmapDataPoint = [number, number, number];
