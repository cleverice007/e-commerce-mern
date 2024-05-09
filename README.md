# E-Commerce Website
![註冊](https://github.com/cleverice007/e-commerce-mern/blob/main/截圖%202024-05-09%20上午11.30.11.png)
![商品頁面](https://github.com/cleverice007/e-commerce-mern/blob/main/截圖%202024-05-09%20上午11.32.59.png)
![放入購物車](https://github.com/cleverice007/e-commerce-mern/blob/main/截圖%202024-05-09%20上午11.33.19.png)
![評論](https://github.com/cleverice007/e-commerce-mern/blob/main/截圖%202024-05-09%20上午11.33.37.png)
![展示評論](https://github.com/cleverice007/e-commerce-mern/blob/main/截圖%202024-05-09%20上午11.33.49.png)
![checkout](https://github.com/cleverice007/e-commerce-mern/blob/main/截圖%202024-05-09%20上午11.33.57.png)
![結帳](https://github.com/cleverice007/e-commerce-mern/blob/main/截圖%202024-05-09%20上午11.34.25.png)
![修改資料](https://github.com/cleverice007/e-commerce-mern/blob/main/截圖%202024-05-09%20上午11.35.06.png)
![admin](https://github.com/cleverice007/e-commerce-mern/blob/main/截圖%202024-05-09%20上午11.35.19.png)


## demo 連結
```bash
https://e-commerce-mern-3.onrender.com/login
email address = mason1@gmail.com
password = mason1

## Overview
前端使用 TypeScript，後端使用 JavaScript。project 具備用戶註冊、登入、將商品添加到購物車，並通過 PayPal 進行模擬結帳。
所有的產品資料都儲存在 Redis 中，同時使用 Redis 來確認電子郵件地址是否重複註冊。此外，本系統使用鎖機制來解決產品結帳時的concurrency。

## Features
- **用戶註冊和登入**：使用者可以註冊和登入網站。
- **商品管理**：用戶可以瀏覽商品，並將其添加到購物車。
- **模擬結帳**：整合了 PayPal 模擬支付流程。
- **數據管理**：
  - **Redis**：用於儲存產品資料和檢查電子郵件重複註冊。
  - **Concurrency Management**：在結帳過程中，對產品實施鎖機制以處理concurrency。

## Tech Stack
- **Frontend**: TypeScript, React, redux
- **Backend**: Node.js, Express
- **Database**: Redis
- **Payment Processing**: PayPal API
- **Concurrency Management**: Redis locks

# Authentication Features

## Overview
auth feature 提供用戶註冊、登入和基於admin的屬性

## Features

### Token-Based Authentication
當用戶成功註冊或登入後，系統將通過response的 Cookie 返回一個帶有expire時間的 JWT token。

### User Data Storage with Redis
用戶的註冊資料如姓名、年齡等存儲在 Redis 數據庫中，使用 Redis 的Hash資料結構來進行高效的讀寫操作（hset)。這種數據結構適合於快速查詢和更新用戶資訊。

### Email Duplicate Check
註冊過程中，系統利用 Redis 的集合（Set）功能來檢查提供的電子郵件地址是否已經存在於數據庫中(sIsMember)，從而防止用戶使用重複的電子郵件註冊。

### Admin Privileges
管理員具有特殊的 `admin` 屬性，使其能夠修改用戶資料並觀察所有用戶的訂單資訊。

# Product Features

## Features

### Pagination with Bootstrap
- 使用 Bootstrap 的Paginate component 實現產品的分頁功能。

### Product Storage and Sorting in Redis
- 所有產品資料都存儲在 Redis 中，利用 Redis 的有序集合（Sorted Set），使用 `ZCARD` 和 `ZRANGE`基於產品的rating進行排序。

### Retrieving Product Data
- 使用 Redis 的 `HGETALL` 獲取產品的詳細資料。

### Product Review Functionality
- 本平台提供了產品評論功能，允許用戶對購買的產品進行評價和留言。這增強了用戶間的互動，同時也幫助其他用戶在購買決策時獲得寶貴的參考信息。

# Order Features

## Overview
包括整合 PayPal 進行模擬支付、庫存檢查、產品鎖定等功能。

## Features

### PayPal Integration for Simulated Payments
- 在前端引入 react 的 paypal script ,使用 PayPal 來模擬支付過程。

### Stock Validation Before Purchase
- 在用戶完成訂單前，檢查所購買的產品數量是否超過了庫存數量。確保了不會發生超賣情況。

### Product Locking Mechanism with Redis
- 為了防止在訂單處理過程中發生concurrency issue，使用 Redis 來對訂單中的每個產品設定鎖。確保了在處理過程中產品的狀態不會被其他訂單影響。

### Automatic Lock Release to Prevent Deadlocks
- 鎖定的產品會設定過期時間，一旦達到指定時間，Redis 會自動釋放該鎖。防止deadlock



