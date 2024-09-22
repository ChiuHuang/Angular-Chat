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
    <h1 mat-dialog-title>Enter Your Name</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <input matInput [formControl]="nameControl" placeholder="Name">
        <mat-error *ngIf="nameControl.hasError('required')">
          Name cannot be empty
        </mat-error>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()" *ngIf="data.showCancel">Cancel</button>
      <button mat-button (click)="onSave()" [disabled]="nameControl.invalid" cdkFocusInitial>Save</button>
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
      <span>Angular Chat</span>
      
      <span class="username"*ngIf="username">Username: {{ username }}</span>
        <span class="username"*ngIf="!username">Username Not set</span>
        <button
          mat-fab extended
          (click)="openNameDialog()"
          aria-label="Set name"
        >
          <mat-icon>edit</mat-icon>
          Set name
        </button>
    </mat-toolbar>

    <div class="container">
      <div class="chat-messages">
        <div
          *ngFor="let message of messages"
          class="message"
          [ngClass]="{
            sent: message.sender === 'You',
            received: message.sender !== 'You'
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
            placeholder="Type a message"
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
          Send
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
      overflow: hidden; /* Hide scrollbars */
    }
    mat-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px; /* Standard Material toolbar height */
    }


    .chat-messages {
      height: calc(100vh - 190px); /* Adjust for toolbar and input area */
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
  grid-template-columns: 1fr auto 1fr; /* Divide toolbar center into three sections */
  align-items: center; /* Center items vertically */
  height: 100%;
}

.username {
  text-align:center
  grid-column: 2; /* Place username in the second section */
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
      console.log('WebSocket connection established');
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
      console.log('WebSocket connection closed');
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
        sender: this.username || 'You',
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
      disableClose: !this.username, // Disable closing by clicking outside only if username is not set
      data: { showCancel: !!this.username }, // Pass whether to show cancel button
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const previousUsername = this.username; // Store the previous username
        this.username = result;

        // Show a snackbar notification when the username is set or updated
        let snackBarRef = this.snackBar.open(
          `Name set to: ${this.username}`,
          'Undo',
          {
            duration: 3000,
          }
        );

        // Handle the 'Undo' action
        snackBarRef.onAction().subscribe(() => {
          this.username = previousUsername; // Reset to the previous username

          this.snackBar.open('Username reset', '', {
            duration: 2000,
          });
        });
      } else if (!this.username) {
        // If the dialog was cancelled and no username is set, reopen it
        this.openNameDialog();
      } else {
        console.log('Dialog was cancelled, keeping existing username');
      }
    });
  }
}

bootstrapApplication(App, {
  providers: [provideAnimationsAsync()],
});
