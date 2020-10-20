import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapsAPILoader, AgmMap } from '@agm/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit  {
  userObj:any={};
  userID = null;
  profilePicError = false;
  @ViewChild('fileInput') el: ElementRef;
  @ViewChild(AgmMap,{static: true}) public agmMap: AgmMap;

  
    constructor(private userService:UserService,
      private route:ActivatedRoute,
      public sanitizer: DomSanitizer,
      private modalService: NgbModal,      
    private apiloader:MapsAPILoader) {  }



//variables
    lat:any= 51.673858
    lng:any= 7.815982
    zoom:any= 8
  
    ngOnInit() {
      this.userService.userSource.subscribe(data => {
        console.log('userSource : ', data);
        this.userObj = data;
      },(error)=>{
        console.log('userSource error : ', error);
      });
      this.getParams();
      this.agmMap.triggerResize(true);
    }
  
    getParams()
    {
      this.route.params.subscribe((params)=>{
          console.log('data :',params);
          
          this.userID = params.id;
          this.getUserInfo();      
      },(error)=>{
        console.log('error :',error);
      })
    }
  
    getUserInfo()
    {
      if(this.userObj && this.userObj.id==undefined)
      {
          this.userService.getUser(this.userID).subscribe((response)=>{
            console.log('response : ',response);
            this.userObj = response;
          },(error)=>{
            console.log('error : ',error);
          })
      }
    }
  
    changeProfilePic(event)
    {
      const file = event.target.files[0];
      console.log('changeProfilePic file : ',file);
      if(file==undefined)
      {
        return false;
      }
     const finalPath = URL.createObjectURL(file);
     console.log('finalPath : ',finalPath);
     this.getFileDimension(file).then(({width, height}) => {
      console.log(width, height);
      if(width<=325 && height<=310)
      {
        this.profilePicError = false;
      }
      else{
        this.profilePicError = true;
      }
      this.userObj.profilePic = finalPath;
      this.updateUserProfie();
      });
      // this.registerForm.patchValue({profilePic:finalPath});
    }
  
    getFileDimension(file)
    {
      return new Promise((resolve, reject) => {
        try {
            let img = new Image()
            img.onload = () => {
                const width  = img.naturalWidth,
                      height = img.naturalHeight
                window.URL.revokeObjectURL(img.src)
                return resolve({width, height})
            }
            img.src = window.URL.createObjectURL(file)
        } catch (exception) {
            return reject(exception)
        }
    });
    }
  
    openModal() {
      this.userService.updateUser(this.userObj);
      const modalRef = this.modalService.open(RegisterComponent,{ size: 'lg', backdrop: 'static' });
        modalRef.result.then((result) => {
          console.log('modalRef.result : ',result);
          if (result) {
          }
          }).catch((error)=>{ 
            console.log('error : ',error);
          });
    }
  
    updateUserProfie()
    {
      this.userService.editUserProfile(this.userObj).subscribe((response)=>{
  
      },(error)=>{
  
      })
    }
  
    editProfile()
    {
  
    }
  }
  