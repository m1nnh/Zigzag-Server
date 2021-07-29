## :star: 소프트스퀘어드 13기 서버 모의외주 프로젝트

### 📝 Introduction

2주 동안 클라이언트 한 명과 짝을 이뤄 진행한 지그재그 앱 클론 프로젝트입니다.

### ✨ Directory Structure


```
📂 config
 ├── 📄 baseResponseStatus.js
 ├── 📄 email.js
 ├── 📄 express.js
 ├── 📄 jwtMiddleware.js
 ├── 📄 response.js
 └── 📄 winston.js                                      
📂 src
 └── 📂 app           			
      ├── 📂 Brand           		
      |    ├── 📄 BrandController.js          	
      |    ├── 📄 BrandDao.js 		
      |    ├── 📄 BrandProvider.js   		
      |    ├── 📄 BrandRoute.js   		 
      |    └── 📄 BrandService.js   		 
      ├── 📂 Product          		
      |    ├── 📄 ProductController.js          	
      |    ├── 📄 ProductDao.js 		
      |    ├── 📄 ProductProvider.js   		
      |    ├── 📄 ProductRoute.js   		 
      |    └── 📄 ProductService.js   	
      ├── 📂 Review         		
      |    ├── 📄 ReviewController.js          	
      |    ├── 📄 ReviewDao.js 		
      |    ├── 📄 ReviewProvider.js   		
      |    ├── 📄 ReviewRoute.js   		 
      |    └── 📄 ReviewService.js   	
      ├── 📂 Search          		
      |    ├── 📄 SearchController.js          	
      |    ├── 📄 SearchDao.js 		
      |    ├── 📄 SearchProvider.js   		
      |    ├── 📄 SearchRoute.js   		 
      |    └── 📄 SearchService.js   	
      ├── 📂 Store          	
      |    ├── 📄 StoreController.js          	
      |    ├── 📄 StoreDao.js 		
      |    ├── 📄 StoreProvider.js   	
      |    ├── 📄 StoreRoute.js   		 
      |    └── 📄 StoreService.js  
      └── 📂 User          		
           ├── 📄 UserController.js          	
           ├── 📄 UserDao.js 	
           ├── 📄 UserProvider.js   		
           ├── 📄 UserRoute.js   		 
           └── 📄 UserService.js  
📄 .gitignore                     		
📄 index.js                                                        	 
📄 package.json                      
📄 README.md
```

### ☑️ Role

- 서버 구축
- ERD 설계

![image](https://user-images.githubusercontent.com/78870076/120744839-dbb65e80-c536-11eb-8127-d85b001a7123.png)

  - [Aquerytool](https://aquerytool.com:443/aquerymain/index/?rurl=d4462468-9965-44d8-9a74-e10705ecee87)
  - Password : 71q41r

- API 구현 및 명세서 작성
- 카카오 로그인 (OAuth)
- 임시 비밀번호 발급 (Nodemailer)

### 📚 Architecture

![image](https://user-images.githubusercontent.com/78870076/120702010-8c4c4000-c4ee-11eb-85ec-763de534938a.png)

### 📹 Vedio

- 클라이언트 시연 영상
  - [Youtube](https://youtu.be/bTpqDzdvERw)
- 서버 시연 영상 (`Postman` Test)
  - [Youtube](https://youtu.be/0n2Rf837mBI)
