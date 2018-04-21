import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { User } from '../_models/index';
import { UserService, ChatService } from '../_services/index';
import * as io from "socket.io-client";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewChecked {
  typeingContent: string;
  isCurrentTypeing: boolean;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chats: any;
  msgData = { username: '', message: '' };
  socket = io('http://localhost:4000');

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private router: Router
  ) {
    this.isCurrentTypeing = false;
  }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if(user!==null) {
      this.getChats();
      this.msgData = { username: user.username, message: '' }
      this.scrollToBottom();
    }
    this.socket.on('new-message', function (data) {
      this.chats.push(data.message);
      this.msgData = { username: user.username, message: '' }
      this.scrollToBottom();
    }.bind(this));

    this.socket.on('keydown-event-send', function (data) {
      this.showTypeingUser(data);
    }.bind(this));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  removeTypingAlert() {
    if(!this.isCurrentTypeing) {
      this.typeingContent = '';
    }
  }

  showTypeingUser(data: Object) {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if(data['name'] !== user.username) {
      this.typeingContent = user.username + ' is typing...';
      this.isCurrentTypeing = true;
      setTimeout(() => this.isCurrentTypeing = false, 1000);
      setTimeout(() => this.removeTypingAlert(), 3000);
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  getChats() {
    this.chatService.getChats().then((res) => {
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }

  sendMessage() {
    this.chatService.saveChat(this.msgData).then((result) => {
      this.socket.emit('save-message', result);
    }, (err) => {
      console.log(err);
    });
  }

  logout() {
    let date = new Date();
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.socket.emit('save-message', { username: user.username, message: 'Left this chat room', updated_at: date });
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  onKeydown(event: any) {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.socket.emit('keydown-event-raise', {
      name: user.username
    });
  }

}
