import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { planificacionProgramaCabecera, planificacionProgramaDetalle } from 'src/app/model/PlanificacionPrograma';
import { LoadingController, ToastController, Platform, AlertController } from '@ionic/angular';
import { PlanificacionaguajeService } from 'src/app/api/logistica/planificacionaguaje.service';
import { PlanificacionprogramaService } from 'src/app/api/logistica/planificacionprograma.service';
import { HomeService } from 'src/app/api/home/home.service';
//import {Chart} from 'chart.js/auto'
import { ChartType } from 'chart.js';

import { Chart, ChartItem, registerables } from 'chart.js'; Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit  {
  // Importing ViewChild. We need @ViewChild decorator to get a reference to the local variable 
  // that we have added to the canvas element in the HTML template.
  listAguaje:any                  = [];
  listPuertos:any                  = [];
  listDetallePrograma:any         = [];
  rowData:any                     = [];
  lista2:any                      = [];
  ///lista:any                       = [];
  loading:any
  
  objeto:planificacionProgramaCabecera;
  myChart: any;
  constructor(public loadingController: LoadingController,
    public toastController: ToastController, public alertController: AlertController,
    private servicePlanificacionAguaje: PlanificacionaguajeService , 
    private servicePlanificacionPrograma: PlanificacionprogramaService,
    private serviceHome:HomeService) {

    this.objeto         = new planificacionProgramaCabecera();
    
  }

  ngOnInit() {
    this.getDatos();
  }


  async getDatosTabla(){
    try {
      await this.presentLoading();
      await this.serviceHome.getEProgramaByIdAguaje(this.objeto.idaguaje).then((respuesta:any) => {
        this.lista2=respuesta
        this.rowData = respuesta;
        console.log('respuesta2:' , this.rowData)
        
      }).finally(() => { 
        this.closeLoading() 
      })
    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    }
  }


  async onAguajeSelected(){
    //limpiar objeto detalle 
    //this.objetodetalle  = new planificacionProgramaDetalle();
    //consultar datos cabecera y detalle
    //this.getDatosTabla();

    //console.log("idaguaje: " + this.objeto.idaguaje);
    this.getHieleras(this.objeto.idaguaje);
    this.getPuertos(this.objeto.idaguaje);
    this.getClientes(this.objeto.idaguaje);
    this.getProveedores(this.objeto.idaguaje);

    try {
    //  await this.presentLoading();
      await this.serviceHome.getEProgramaByIdAguajeTabla(this.objeto.idaguaje).then((respuesta:any) => {
        this.lista2=respuesta
        this.rowData = respuesta;
        console.log('respuesta2:' , this.rowData)
        
      }).finally(() => { 
        this.closeLoading() 
      })
    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    }


    let lista=[];
    let item:any;
    const set1 = new Set();
    await this.serviceHome.getEProgramaByIdAguaje(this.objeto.idaguaje).then((respuesta:any) => {
      console.log('list datos:' , respuesta)
      
      if(respuesta.length > 0){
        lista = respuesta;
        let slabel: any[] = [];
        let y: any[] = [];
        let z: any[] = [];
        let v: any[] = [];
        
        let sd1:any[][];
        var sdata: {x: any; y: any;z: any,v :any }[] = [];
      
            lista.map((item: {
             remitidas: any; fechadespacho: any; programadas: any; efectividad: any }) => {
              slabel.push(item.fechadespacho);

              y.push(item.programadas);
              z.push(item.remitidas);
              v.push(item.efectividad);
              //  sd1[item.fechadespacho].push(item.programadas);
             // sd1[item.fechadespacho].push(item.remitidas);
               sdata.push({ x: item.fechadespacho, y: item.programadas,z:item.remitidas,v:item.efectividad});



      console.log("SDATA: ",sdata);

   //            myData.push({id: req.body.id, population: req.body. population});
           
      
          });

          const printCharts= ()=>{
      
          renderModelsChart();
         
          }

        const renderModelsChart=()=>{
          const data1 =sdata;

          
        try {
          this.myChart=new Chart('modelsChart',   {
            type:'bar',
            data:{
              labels: slabel,
              datasets: [{
                  label: 'Lb Programadas',
                  data: data1,
                  backgroundColor:'#AFC48B',
                  parsing: {
                    yAxisKey: 'y'
                  }
                }, {
                  label: 'Lb Remitidas',
                  data: data1,
                  backgroundColor:'#6B9328',
                  parsing: {
                    yAxisKey: 'z'
                  }
                  
                }, {
                  type:'line',
                  backgroundColor:'#406503',
                  fill:'#406503',
                  label: '% Efectividad',
                  data: v,
                  yAxisID: 'v'
                 
              }]
            },
            options: {
              responsive: true,
              interaction: {
                intersect: false,
               // mode: 'index',
                //axis: 'y'
              },
              //indexAxis: 'x',
              scales: {
                
                
                xAxis: {
                  stacked: false,
                  display:false,
                  ticks: {
                    stepSize: 1 ,
                    maxRotation:90,
                    minRotation:90
                  },
           
                  beginAtZero: true
                },
                y: {
                  type:'linear',
                  position:'left',
                  ticks: {
                    stepSize: 0.5
                  },
                },
                v: {
                  axis:"y",
                  type:'linear',
                  position:'right',
                  min:0,
                  max:100,
                  ticks: {
                    stepSize: 0.5
                  },
                  grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                  },
                }
              }
            }
          } );
          
        } catch (error) {
          this.myChart.destroy();
          this.myChart=new Chart('modelsChart',  {
            type:'bar',
            data:{
              labels: slabel,
              datasets: [{
                  label: 'Lb Programadas',
                  data: data1,
                  backgroundColor:'#AFC48B',
                  parsing: {
                    yAxisKey: 'y'
                  }
                }, {
                  label: 'Lb Remitidas',
                  data: data1,
                  backgroundColor:'#6B9328',
                  parsing: {
                    yAxisKey: 'z'
                  }
                  
                }, {
                  type:'line',
                  label: '% Efectividad',
                  backgroundColor:'#406503',
                  fill:'#6B9328',
                  data: v,
                // type:'scatter',
                    yAxisID: 'v'
                  
              }]
            },
            options: {
              responsive: true,
              interaction: {
                intersect: false,
               // mode: 'index',
                //axis: 'y'
              },
              indexAxis: 'x',
              scales: {
                xAxis: {
                  stacked: false,
                  display:false,
                  ticks: {
                    stepSize: 1
                  },
                  beginAtZero: true
                },
                y: {
                  type:'linear',
                  position:'left',
                  ticks: {
                    stepSize: 0.5
                  },
                },
                v: {
                  axis:"y",
                  type:'linear',
                  position:'right',
                  min:0,
                  max:100,
                  ticks: {
                    stepSize: 0.5
                  },
                  grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                  },
                }
              }
            }
          } );
        }
        
        
          
        }
        

          printCharts();

       

       //   this.myChart.destroy();
      }else{
        console.log('sin datos'  )
      }
     
    }) 

  }
  

  async showMessage(messagex:any, positionx:any="bottom",  colorx="primary" , durationx=2000){
    const toast = await this.toastController.create({ 
      message: messagex,
      position: positionx, 
      duration: durationx,
      color:colorx,
    })
    toast.present();
  }

  async presentLoading(message='Espere un momento') {
    this.loading = await this.loadingController.create({
      message: message
    });
    await this.loading.present();
  }

  async closeLoading(){
    //await this.loading.dismiss();
  }

async getDatos(){

  try {
    //await this.presentLoading();
     
    await this.servicePlanificacionAguaje.getAll().then((respuesta:any) => {
      console.log('lista aguaje' , respuesta)
      this.listAguaje=respuesta
    }) 

  } catch (error:any) {
    this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
  } finally {
    //this.closeLoading() 
  }
}


async getHieleras(idaguaje:any){
  try {
    await this.serviceHome.getHieleras(idaguaje).then((respuesta:any) => {
      console.log('lista de hieleras' , respuesta);
      var i = 0;
      var listLabel:any = [];
      var listData:any = [];
      for (var key in respuesta) {
       listLabel.push(respuesta[i].descripcion);
       listData.push(respuesta[i].sum);
       i++;
      }

      this.graficoLineHieleras(listLabel, listData);
    }) 

  } catch (error:any) {
    this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
  } finally {
    //this.closeLoading() 
  }
}
  async getPuertos(idaguaje:any){
    try {
      //await this.presentLoading();
      
      await this.serviceHome.getPuertos(idaguaje).then((respuesta:any) => {
        console.log('lista de puertos' , respuesta);
        //console.log(respuesta[0].descripcion);

        //let varjson = JSON.stringify(respuesta);
        //console.log(varjson);

        //console.log("ok");
        //let varjson = JSON.parse(respuesta);
        //console.log(respuesta);

        //let vartest = Array.of(respuesta);
        //console.log(vartest);

        this.listPuertos=respuesta;

        var i = 0;
        var listLabel:any = [];
        var listData:any = [];
        for (var key in respuesta) {
         listLabel.push(respuesta[i].descripcion);
         listData.push(respuesta[i].count);
         i++;
        }

        this.graficoPiePuertos(listLabel, listData);
      }) 

    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    } finally {
      //this.closeLoading() 
    }
  }

  async getClientes(idaguaje:any){
    try {
      await this.serviceHome.getClientes(idaguaje).then((respuesta:any) => {
        console.log('lista de clientes' , respuesta);
        var i = 0;
        var listLabel:any = [];
        var listData:any = [];
        for (var key in respuesta) {
         listLabel.push(respuesta[i].etiqueta);
         listData.push(respuesta[i].sum);
         i++;
        }

        this.graficoClientes(listLabel, listData);
      }) 

    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    } finally {
      //this.closeLoading() 
    }
  }

  async getProveedores(idaguaje:any){
    try {
      //await this.presentLoading();
      
      await this.serviceHome.getProveedores(idaguaje).then((respuesta:any) => {
        console.log('lista de proveedores' , respuesta);

        var i = 0;
        var listLabel:any = [];
        var listData:any = [];
        for (var key in respuesta) {
         listLabel.push(respuesta[i].tipopropiedad);
         listData.push(respuesta[i].sum);
         i++;
        }

        this.graficoPieProveedores(listLabel, listData);
      }) 

    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    } finally {
      //this.closeLoading() 
    }
  }

  lineChart!:Chart;
  graficoLineHieleras(labels:any, datas:any){
    if(this.lineChart){
      this.lineChart.clear();
      this.lineChart.destroy();
    }

    var speedCanvas = document.getElementById("myChartLineHieleras") as ChartItem;

    this.lineChart = new Chart(speedCanvas, {
      type: "line",
      options: {
        scales: {
          x: {
            ticks: {
              font: {
                size: 8, // set the font size for x-axis labels
            },
            padding:1,
            maxTicksLimit:150,
            maxRotation: 90,
            minRotation: 90
            }
        }        

        }
    },
      data: {
        //labels: ["January", "February", "March", "April", "May", "June", "July"],
        labels: labels,
        datasets: [
          {
            label: "HIELERAS",
            fill: false, 
            //lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            //borderJoinStyle: "miter",
            pointBorderColor: "rgba(255,255,0,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 2,
            pointHoverRadius: 10,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            //data: [65, 59, 80, 81, 56, 55, 40],
            data: datas,
            spanGaps: false
          }
        ]
      }
    });
  }

  pieChart:any;
  graficoPiePuertos(labels:any, datas:any){

    if(this.pieChart){
      this.pieChart.clear();
      this.pieChart.destroy();
    }

    var speedData = {
      //labels: ["El Morro", "Duran"],
      labels: labels,
      datasets: [{
        //label: "Puertos",
        //data: [10, 501],
        data: datas
      }]
    };

    var speedCanvas = document.getElementById("myChartPiePuertos") as ChartItem;

  
    this.pieChart = new Chart(speedCanvas, {
      type: 'pie',
      data: speedData,
      //data: data2,
      //options: chartOptions
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
           
          },
          tooltip: {
            enabled: true,
            callbacks: {
              footer: (ttItem) => {
                let sum = 0;
                let dataArr = ttItem[0].dataset.data;
                dataArr.map(data => {
                  sum += Number(data);
                });
    
                let percentage = (ttItem[0].parsed * 100 / sum).toFixed(2) + '%';
                return `Porcentaje: ${percentage}`;
              }
            }
          },
          
          //outlabels:{},
          
          /*datalabels: {
            display: true,
            align: 'bottom',
            backgroundColor: '#ccc',
            borderRadius: 3,
            font: {
              size: 18,
            },
          },*/
          /*title: {
            display: true,
            text: 'PUERTOS'
          }*/
        }
      },
    });
  }

  barChart:any;
  graficoClientes(labels:any, datas:any){
    if(this.barChart){
      this.barChart.clear();
      this.barChart.destroy();
    }

    var speedCanvas = document.getElementById("myChartBarClientes") as ChartItem;
    this.barChart = new Chart(speedCanvas, {
      type: "bar",
      data: {
        //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        labels: labels,
        datasets: [
          {
            label: "CLIENTES",
            //data: [12, 19, 3, 5, 2, 3],
            data: datas,
            /*backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],*/
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          
          x: {
            ticks: {
              font: {
                size: 8, // set the font size for x-axis labels
            },
            padding:1,
            maxTicksLimit:150,
            maxRotation: 90,
            minRotation: 90
            }
        }
          /*yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]*/
        }
      }
    });
  }

  pieChartProveed:any;
  graficoPieProveedores(labels:any, datas:any){

    if(this.pieChartProveed){
      this.pieChartProveed.clear();
      this.pieChartProveed.destroy();
    }

    var speedData = {
      //labels: ["El Morro", "Duran"],
      labels: labels,
      datasets: [{
        //label: "Puertos",
        //data: [10, 501],
        data: datas
      }]
    };

    var speedCanvas = document.getElementById("myChartPieProveedor") as ChartItem;

    this.pieChartProveed = new Chart(speedCanvas, {
      type: 'doughnut',
      data: speedData,
      //data: data2,
      //options: chartOptions
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          /*title: {
            display: true,
            text: 'PROVEEDORES'
          }*/
        }
      },
    });
  }
}
