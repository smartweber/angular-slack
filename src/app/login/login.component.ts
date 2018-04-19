import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService } from '../_services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    ngOnInit() {
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        if(localStorage.getItem('currentUser')) { // user localstorage is existed
            this.router.navigate([this.returnUrl]);
        }
        
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.email, this.model.password)
            .subscribe(
                data => {
                    if(data.status) {
                        localStorage.setItem('currentUser', JSON.stringify(data['user']));
                        this.router.navigate([this.returnUrl]);
                    } else {
                        this.alertService.error(data.message);
                    }
                },
                error => {
                    this.alertService.error(error.error.message);
                    this.loading = false;
                });
    }
}