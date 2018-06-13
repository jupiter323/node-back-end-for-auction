import { Component, OnInit } from '@angular/core';
import { CarsService } from '../../../share/service/cars.service'
import { Sample } from '../../../sample';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private carservice: CarsService) { }

  ngOnInit() {
    this.carservice.getUsers().subscribe((data:Sample[]) => {
      console.log("companies", data);
    })

  }

}
