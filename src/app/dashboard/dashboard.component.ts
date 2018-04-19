import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { User } from '../_models/index';
import { UserService, ChatService } from '../_services/index';
import * as io from "socket.io-client";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewChecked {
  currentUser: any;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chats: any;
  joinned: boolean = false;
  newUser = { username: '', room: '' };
  msgData = { username: '', message: '' };
  socket = io('http://localhost:4000');

  constructor(private chatService: ChatService, private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
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
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
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

  // joinRoom() {
  //   let date = new Date();
  //   localStorage.setItem("user", JSON.stringify(this.newUser));
  //   this.getChatByRoom(this.newUser.room);
  //   this.msgData = { username: 'jack', message: '' };
  //   this.joinned = true;
  //   this.socket.emit('save-message', { username: 'jack', message: 'Join this room', updated_at: date });
  // }

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
    this.socket.emit('save-message', { username: user.username, message: 'Left this room', updated_at: date });
    localStorage.removeItem('currentUser');
    this.joinned = false;
  }

}
