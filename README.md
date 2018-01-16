# 新闻管理系统

## 基于express和mongodb开发的新闻管理系统

### 1. 开发环境

- node v6.9.1
- mongodb

### 2. 运行

**克隆项目**

	git clone https://github.com/xianhaiyuan/NMS.git
	
**项目初始化**

	cd NMS
	
	npm install

**开启mongodb服务**

	mongod --dbpath /var/lib/mongodb/ --logpath /var/log/mongodb/mongodb.log --logappend &

**运行项目**	

	node index.js