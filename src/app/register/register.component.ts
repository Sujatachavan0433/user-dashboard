import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Options } from 'ng5-slider';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import { AgmMap, MapsAPILoader } from '@agm/core';

declare var google;

@Component({ selector: 'app-register', templateUrl: './register.component.html', styleUrls: ['./register.component.scss'] })
export class RegisterComponent implements OnInit {
  @ViewChild('fileInput') el: ElementRef;
  @ViewChild(AgmMap, { static: true }) public agmMap: AgmMap;

  updateUserObj: any = {};

  options: Options = {
    floor: 0,
    ceil: 100,
    enforceStep: false,
    enforceRange: false,
    showSelectionBar: true
  };
  profilePicError = false;
  registerForm: FormGroup;
  getAddress: number;
  latitude: any;
  longitude: any;
  currentLoc: string = "";
  arrayLoc: any[]
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    public sanitizer: DomSanitizer,
    private userService: UserService,
    private apiloader: MapsAPILoader
  ) { }



  lat = 51.678418;
  lng = 7.809007;


  async ngOnInit() {
    this.initForm();
    this.userService.userSource.subscribe((data: any) => {
      console.log('userSource : ', data);
      if (data && data.id != undefined) {
        this.updateUserObj = data;
        this.updateFormFields(data);
      }

    }, (error) => {
      // console.log('userSource error : ', error);
    });

    await this.getCurrentLocation()
    this.agmMap.triggerResize(true);

  }

  ngDoCheck() {

  }


  // Region Google map

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
          var LoCa = '';
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.getAddress = (this.lat, this.lng)

          console.log(position)

          const self = this;
          this.apiloader.load().then(() => {
            let geocoder = new google.maps.Geocoder;
            let latlng = { lat: this.lat, lng: this.lng };

            geocoder.geocode({ 'location': latlng }, function (results) {
              if (results[0]) {
                LoCa = results[0].formatted_address;
                console.log('current loaction', this.currentLocation);
                console.log('self.register form', self.registerForm);
                this.currentLoc = this.currentLocation;
                self.registerForm.patchValue({ address: LoCa })

              } else {
                console.log('Not found');
              }

            });

          });

          this.registerForm.patchValue({ lat: position.coords.latitude, long: position.coords.longitude })

        }
      })
    }

  }






  // endreqion google map


  updateFormFields(fields) {
    this.registerForm.patchValue({
      firstName: fields.firstName,
      lastName: fields.lastName,
      profilePic: fields.profilePic,
      mobile: fields.mobile,
      email: fields.email,
      age: fields.age,
      gender: fields.gender,
      lat: fields.lat,
      long: fields.long,
      address: fields.address,

    })
  }

  initForm() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z \-\']+')]],
      lastName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z \-\']+')]],
      profilePic: [null],
      mobile: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      age: [10],
      gender: [''],
      lat: [''],
      long: [''],
      address: ['']
    });
  }

  passBack() {
    this.activeModal.close({
      random: Math.random()
    });
  }
  submit() {
    console.log('this.registerForm : ', this.registerForm);
    const finalObj = this.registerForm.value;
    if (this.registerForm.valid == true) {
      if (this.updateUserObj && this.updateUserObj.id != undefined) {
        finalObj.id = this.updateUserObj.id;
        this.editProfile(finalObj);
      }
      finalObj.id = (Math.random() * 10000).toString();
      console.log('finalObj : ', finalObj, this.registerForm.status);
      this.userService.registerUser(finalObj).subscribe((response) => {
        console.log('response : ', response)
        this.activeModal.close(response);
        this.userService.updateUser(response)
      }, (error) => {
        console.log('error : ', error);
      })
    }
  }

  editProfile(userObj) {
    this.userService.editUserProfile(userObj).subscribe((response) => {
      this.activeModal.close(response);
      this.userService.updateUser(response)
    }, (error) => {
      this.activeModal.close(null);
    })
  }

  changeProfilePic(event) {
    const file = event.target.files[0];
    console.log('changeProfilePic file : ', file);
    if (file == undefined) {
      return false;
    }
    const finalPath = URL.createObjectURL(file);
    console.log('finalPath : ', finalPath);
    this.getFileDimension(file).then(({ width, height }) => {
      console.log(width, height);
      if (width <= 325 && height <= 310) {
        this.profilePicError = false;
      }
      else {
        this.profilePicError = true;
      }
    });
    this.registerForm.patchValue({ profilePic: finalPath });
  }

  getFileDimension(file) {
    return new Promise((resolve, reject) => {
      try {
        let img = new Image()
        img.onload = () => {
          const width = img.naturalWidth,
            height = img.naturalHeight
          window.URL.revokeObjectURL(img.src)
          return resolve({ width, height })
        }
        img.src = window.URL.createObjectURL(file)
      } catch (exception) {
        return reject(exception)
      }
    });
  }


}