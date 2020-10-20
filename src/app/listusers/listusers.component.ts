import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-listusers',
  templateUrl: './listusers.component.html',
  styleUrls: ['./listusers.component.scss']
})
export class ListusersComponent implements OnInit {

  constructor(private userService:UserService,private router:Router,public activeModal : NgbActiveModal) { }

  ngOnInit() {
    this.getAllUsers();
  }


  //variables
  frameworkComponents: any;
  rowData:any=[];
  columnDefs:any=[];
  data:any=[];

  getAllUsers(){
    this.userService.getAllUsers().subscribe((response)=>{
      this.data=response;

      // this.columnDefs = [
      //   {headerName: "firstName",field: 'firstName', sortable: true, filter: true ,resizable: true},
      //   {headerName: "lastName",field: 'lastName', sortable: true, filter: true ,resizable: true},
      //   {headerName: "mobile",field: 'mobile', sortable: true, filter: true ,resizable: true},
      //   {headerName: "email",field: 'email', sortable: true, filter: true ,resizable: true},
      //   {headerName: "age",field: 'age', sortable: true, filter: true ,resizable: true},
      //   {headerName: "gender",field: 'gender', sortable: true, filter: true ,resizable: true},

      // ];
      //   this.rowData = this.data;
      
    },(error)=>{
      console.log('error : ',error);
    })
  }

  RedirectToProfile(m)
  {
    this.activeModal.close(m);   
  }

}
