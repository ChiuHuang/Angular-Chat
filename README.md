# Angular 聊天應用
## 概述
這是一個使用 Angular 構建的簡單聊天應用程序，利用 WebSocket 進行實時通信。該應用程序允許用戶設置他們的用戶名並實時向彼此發送消息。

## 功能特點
- **實時消息傳遞**：用戶可以使用 WebSocket 即時發送和接收消息。
- **用戶友好界面**：該應用程序使用 Angular Material 設計，具有響應式且美觀的界面。
- **用戶名管理**：用戶可以輸入自己的名字並在聊天中顯示。

## 使用的技術
- **前端**：Angular, Angular Material
- **後端**：Node.js, Express, WebSocket
- **WebSocket**：用於客戶端之間的實時通信

## 安裝
### 前提條件
- Node.js (>= 14.x)
- Angular CLI (>= 12.x)

## 構建/託管
### 方法一（在線）無需安裝
#### 基於 **stackblitz**
### 步驟
1. **在瀏覽器中打開此項目**
    [點擊這裡](https://stackblitz.com/~/github.com/ChiuHuang/Angular-Chat) 
   `https://stackblitz.com/~/github.com/ChiuHuang/Angular-Chat`
2. **等待魔法發生**
    可能需要等待一分鐘。
5. **打開應用程序**：
   在瀏覽器中訪問 
   [`https://angularchat-4y5b-bmkesdkt--4200--e7ca9335.local-credentialless.webcontainer.io`](https://angularchat-4y5b-bmkesdkt--4200--e7ca9335.local-credentialless.webcontainer.io)。

### 方法二（本地）
   
1. **克隆存儲庫**：
   ```bash
   git clone https://github.com/ChiuHuang/Angular-Chat
   cd https://github.com/ChiuHuang/Angular-Chat
   ```
3. **安裝依賴項並啟動 Angular 應用程序和服務器**：
   在單獨的終端窗口中，導航到 Angular 應用程序文件夾**並編輯服務器 URL**，然後運行：
   ```bash
   npm install && npm start
   ```
4. **打開應用程序**：
   在瀏覽器中訪問 `http://localhost:4200`。

## 使用方法
- 加載應用程序後，用戶將通過對話框被提示輸入他們的姓名。
- 設置姓名後，用戶可以通過在輸入欄位中輸入並按下 Enter 鍵或點擊發送按鈕來發送消息。
- 所有消息將在聊天區域中實時顯示。

## 貢獻
歡迎提交問題或拉取請求。歡迎任何貢獻！
