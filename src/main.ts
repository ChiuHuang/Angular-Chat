import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatCommonModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Message {
  text: string;
  sender: string;
  timestamp: Date;
}

@Component({
  selector: 'app-name-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: `
    <h1 mat-dialog-title>請輸入您的姓名</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <input matInput [formControl]="nameControl" placeholder="姓名">
        <mat-error *ngIf="nameControl.hasError('required')">
          姓名不能為空
        </mat-error>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()" *ngIf="data.showCancel">取消</button>
      <button mat-button (click)="onSave()" [disabled]="nameControl.invalid" cdkFocusInitial>儲存</button>
    </div>
  `,
})
export class NameDialogComponent {
  nameControl = new FormControl('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<NameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { showCancel: boolean }
  ) {}

  onSave(): void {
    if (this.nameControl.valid) {
      this.dialogRef.close(this.nameControl.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatCommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Angular 聊天室</span>
      
      <span class="username" *ngIf="username">使用者名稱: {{ username }}</span>
      <span class="username" *ngIf="!username">尚未設置使用者名稱</span>
      <button
        mat-fab extended
        (click)="openNameDialog()"
        aria-label="設定名稱"
      >
        <mat-icon>edit</mat-icon>
        設定名稱
      </button>
    </mat-toolbar>

    <div class="container">
      <div class="chat-messages">
        <div
          *ngFor="let message of messages"
          class="message"
          [ngClass]="{
            sent: message.sender === '你',
            received: message.sender !== '你'
          }"
        >
          <strong>{{ message.sender }}</strong>
          <p>{{ message.text }}</p>
          <small>{{ message.timestamp | date: 'short' }}</small>
        </div>
      </div>

      <div class="chat-input">
        <mat-form-field appearance="fill" class="full-width">
          <input
            matInput
            [(ngModel)]="newMessage"
            placeholder="輸入訊息"
            (keyup.enter)="sendMessage()"
            [disabled]="!username"
          />
        </mat-form-field>
        <button
          mat-flat-button
          color="primary"
          (click)="sendMessage()"
          [disabled]="!username"
        >
          發送
        </button>
      </div>
    </div>
  `,
  styles: [
    `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');

    body, input, textarea, button {
      font-family: 'Roboto', sans-serif;
    }

    .mat-icon {
      font-family: 'Material Icons' !important;
    }

    body {
      overflow: hidden; /* 隱藏滾動條 */
    }
    mat-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px; /* 標準的 Material 工具列高度 */
    }

    .chat-messages {
      height: calc(100vh - 190px); /* 調整工具列和輸入區域的高度 */
      border: 1px solid #ccc;
      padding: 10px;
      margin-bottom: 20px;
      font-family: 'Roboto', sans-serif;
    }

    .message {
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 5px;
      font-family: 'Roboto', sans-serif;
    }

    .sent {
      background-color: #e3f2fd;
      text-align: right;
    }

    .received {
      background-color: #f5f5f5;
    }

    .chat-input {
      display: flex;
      gap: 10px;
      padding: 10px;
    }

    .full-width {
      width: 100%;
    }

    .toolbar-center {
      display: grid;
      grid-template-columns: 1fr auto 1fr; /* 將工具列分成三個區塊 */
      align-items: center; /* 垂直居中對齊 */
      height: 100%;
    }

    .username {
      text-align: center;
      grid-column: 2; /* 將使用者名稱置於第二區塊 */
    }
    `,
  ],
})
export class App implements OnInit, OnDestroy {
  messages: Message[] = [];
  newMessage = '';
  username = '';
  private socket: WebSocket | null = null;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.connectWebSocket();
    this.openNameDialog();
  }

  ngOnDestroy() {
    this.disconnectWebSocket();
  }

  connectWebSocket() {
    this.socket = new WebSocket(
      'wss://nodelkvhqz-nwae--3000--e7ca9335.local-credentialless.webcontainer.io/'
    );

    this.socket.onopen = () => {
      console.log('WebSocket 連線已建立');
    };

    this.socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      this.messages.push({
        text: message.text,
        sender: message.sender,
        timestamp: new Date(message.timestamp),
      });
    };

    this.socket.onclose = () => {
      console.log('WebSocket 連線已關閉');
    };
  }

  disconnectWebSocket() {
    if (this.socket) {
      this.socket.close();
    }
  }

  sendMessage() {
    if (
      this.newMessage.trim() &&
      this.socket &&
      this.socket.readyState === WebSocket.OPEN
    ) {
      const message: Message = {
        text: this.newMessage,
        sender: this.username || '你',
        timestamp: new Date(),
      };
      this.messages.push(message);
      this.socket.send(JSON.stringify(message));
      this.newMessage = '';
    }
  }

  openNameDialog(): void {
    const dialogRef = this.dialog.open(NameDialogComponent, {
      width: '250px',
      disableClose: !this.username, // 如果尚未設定使用者名稱，禁用點擊外部關閉
      data: { showCancel: !!this.username }, // 傳遞是否顯示取消按鈕
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const previousUsername = this.username; // 保存之前的使用者名稱
        this.username = result;

        // 設置或更新使用者名稱時，顯示 Snackbar 提示
        let snackBarRef = this.snackBar.open(
          `使用者名稱設定為: ${this.username}`,
          '復原',
          {
            duration: 3000,
          }
        );

        // 處理 '復原' 動作
        snackBarRef.onAction().subscribe(() => {
          this.username = previousUsername; // 還原到之前的使用者名稱

          this.snackBar.open('使用者名稱已復原', '', {
            duration: 2000,
          });
        });
      } else if (!this.username) {
        // 如果取消對話框並且未設定使用者名稱，重新打開
        this.openNameDialog();
      } else {
        console.log('對話框已取消，保留現有的使用者名稱');
      }
    });
  }
}

bootstrapApplication(App, {
  providers: [provideAnimationsAsync()],
});
