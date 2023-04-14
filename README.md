# Application Builder for Cumulocity
The Application Builder for Cumulocity provides a simple, coding-free way to create new applications inside Cumulocity. 
Application Builder is an open-source tool for you to create web applications in a no-code environment. It's being managed by the Software AG's open-source community but not officially supported by Software AG. You can log any issues at [GitHub](https://github.com/SoftwareAG/cumulocity-app-builder/issues) or ask any question on the Software AG Tech Community. Support will provided on best endeavours.

![](https://user-images.githubusercontent.com/38696279/72333172-47cec300-36b3-11ea-9abf-1bb29b490a22.png)

## What's new?

* **Widgets turned plugins:** Application builder now support micro-frontend plugins. Standard widgets are already available as plugin in widget catalog.
* **Optimized Performance:** Application builder now provide faster response times, reduced resource usage, and improved user experience.
* **Custom Branding:** Provides flexibility and control over application’s look and feel.
* **Dashboards:** Simplified the dashboard navigation by introducing path while creating dashboard.
* **Seamless upgrade experience:** Upgrade of application builder made simpler.
* **Cumulocity upgrade:** Application Builder is now based on Cumulocity 1016.0.170
* **Various bug fixes**

## Features
* **Browser-based Device Simulators:** Create device simulators that run directly in your browser.
* **DTDL Simulator:** User can now create simulator based on [DTDL](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md)(Digital Twins Definition Language).
* **Group Simulator:** User can create simulator for existing device group or new device group.
* **Runtime widgets plugin:** Install widgets without re-compiling. Please refer our [Demo Widget](https://github.com/SoftwareAG/cumulocity-demo-widget-plugin).
* **Group template dashboards:** Give every device in a group an identical dashboard (but customized to the device).
* **Create an App with a custom contextPath:** Change the URL used to access a particular app.
* **Application Clone**: User can now clone existing application while creating new one.
* **GainSight Integration:** Gainsight is integrated with app builder and user can control it from settings page.
* **Home Page:** User can find quick start videos, help and support information on home page.
* **Tabs:** Group your dashboards into tabs.
* **Dashboard Catalog:** User can select any pre-designed template for dashboard and ability to install dependent runtime widgets.
* **Widget Catalog:** Now user has ability to install/update widgets directly from Widget Catalog. This is single place where user can also find widget details such as documentation, preview, license and author details.
*  **Branding:** Now user can use color picker to choose millions of colors to customize branding. Header, Action bar and tab bar are also customizable.
*  **Theme:** Application builder now support one clicks theme selection and custom theme creation.
*  **Server-Side Simulators:** Application Builder now supports Server-side simulators. User just need to install micro-service from [here](https://github.com/SoftwareAG/cumulocity-app-builder/releases/download/v1.3.1/simulator-app-builder.zip) and you will get option while creating simulator to "Run on Server".
* **Role Based Access:** User can now control dashboard visibility in application builder by assigning global role(s) to a dashboard.
* **File(CSV/JSON) Based Simulator:** Application Builder now supports File Based Simulators(Server-side). User just need to install micro-service from [here](https://github.com/SoftwareAG/cumulocity-app-builder/releases/download/v1.3.1/csv-simulator-ms.zip) and use simulator type as File(CSV/JSON). User can import CSV/JSON file to create measurements/events to simulate use cases.
*  **Help & Support:** Try out our new help & support dashboard template while creating dashboard. This will help user to quickly create help and support page for cumulocity application.
*  **Demo Catalog:** User now able to try out pre-built cumulocity demos by installing Demo Catalog which is available in your home page.
*  **Auto Upgrade Notification:** From Application Builder 1.3.0 onwards user will get notification whenever new version of app builder available and ability to seamless upgrade by single click.
*  **Settings:** Now user has abilities to control various features such as hide logo, disable auto upgrade, hide tabs for device specific dashboards, etc.

## Installation

### Install Application Builder
**First Time:**
1. Grab the **[Latest Release Zip](https://github.com/SoftwareAG/cumulocity-app-builder/releases)**
2. Go to the **Administration view** in your tenant (/apps/administration)
3. Open the **Ecosystem** section in the navigator and click **Applications**
4. Click **Add application**
5. Select **Upload web application**
6. Select the Zip you downloaded earlier

**Incremental Upgrade:**
1. Grab the **[Latest Release Zip](https://github.com/SoftwareAG/cumulocity-app-builder/releases)**
2. Go to the **Administration view** in your tenant (/apps/administration)
3. Open the **Ecosystem** section in the navigator and click **Applications**
4. Click **Application Builder**
5. Click **Upload a *.zip file**
6. Select the Zip you downloaded earlier

### Install Micro Service for Server-Side Simulators
**First Time:**
1. Download **[simulator-app-builder](https://github.com/SoftwareAG/cumulocity-app-builder/releases/download/v1.3.1/simulator-app-builder.zip)**
2. Go to the **Administration view** in your tenant (/apps/administration)
3. Open the **Ecosystem** section in the navigator and click **Microservices**
4. Click **Add microservice**
5. Select **Upload microservice**
7. Select the Zip you downloaded earlier
8. Click on **Subscribe** button

**Incremental Upgrade:**
1. Download **[simulator-app-builder](https://github.com/SoftwareAG/cumulocity-app-builder/releases/download/v1.3.1/simulator-app-builder.zip)**
2. Go to the **Administration view** in your tenant (/apps/administration)
3. Open the **Ecosystem** section in the navigator and click **Microservices**
4. Click **Simulator-app-builder**
5. Click **Upload a *.zip file**
6. Select the Zip you downloaded earlier
7. Unsubscribe and subscribe again microservice


### Install Micro Service for File Based Simulators(Server Side)
**First Time:**
1. Download **[csv-simulator-ms](https://github.com/SoftwareAG/cumulocity-app-builder/releases/download/v1.3.1/csv-simulator-ms.zip)**
2. Go to the **Administration view** in your tenant (/apps/administration)
3. Open the **Ecosystem** section in the navigator and click **Microservices**
4. Click **Add microservice**
5. Select **Upload microservice**
7. Select the Zip you downloaded earlier
8. Click on **Subscribe** button

**Incremental Upgrade:**
1. Download **[csv-simulator-ms](https://github.com/SoftwareAG/cumulocity-app-builder/releases/download/v1.3.1/csv-simulator-ms.zip)**
2. Go to the **Administration view** in your tenant (/apps/administration)
3. pen the **Ecosystem** section in the navigator and click **Microservices**
4. Click **csv-simulator-ms**
5. Click **Upload a *.zip file**
6. Select the Zip you downloaded earlier
7. Unsubscribe and subscribe again microservice

## Build Instructions
**Note:** It is only necessary to follow these instructions if you are modifying/extending the Application Builder (such as adding custom widgets, branding, etc.), otherwise see the [Installation Guide](#Installation).

**Requirements:**
* Git
* NodeJS (release builds are currently built with `v14.18.0`)
* NPM (Included with NodeJS)

**Instructions**
1. Clone the repository: 
```
git clone https://github.com/SoftwareAG/cumulocity-app-builder.git
```
2. Change directory: 
```
cd cumulocity-app-builder
```
2. (Optional) Checkout a specific version: 
```
git checkout v2.0.0
```
3. Install the dependencies: 
```
npm install
```
4. (Optional) Local development server: 
```
npm start
```
5. Build the app: 
```
npm run build
```
6. Deploy the app: 
```
npm run deploy
```

## QuickStart

This guide will teach you how to create your first application using the Application Builder.

**NOTE:** This guide assumes you have followed the [Installation instructions](#Installation)

1. Open the Application Builder from the app switcher (Next to your username in the top right)
2. Click `Add application`
3. Enter the application details and click `Save`
4. Select `Add dashboard`
5. Click `Blank Dashboard`
6. Enter the dashboard details and click `Save`
7. Select the dashboard from the navigation

Congratulations! You have created an application and added your first screen.

## User Guide

### How to convert existing widget into plugin
We are going to publish video tutorial where you will find detailed instructions about converting your existing widget into plugin.

### How to upgrade Application Builder to 2.0
Application Builder 2.0 is based on micro-frontend architecture and existing Custom Widgets/Runtime widgets are no longer compatible.
For seamless upgrade experience, please follow below steps:
 1. Upgrade your Application Builder to 1.3.4 (In case if you are using earlier version).
 2. Upgrade your Application Builder to 2.0 using upgrade option in bottom of your page(Available only to admin user).
 
Please note that if your widgets are part of Widget Catalog(maintained by community), then Application Builder will automatically delete existing widget and install corresponding plugin. In case if custom widget please see [How to convert existing widget into plugin](#how-to-convert-existing-widget-into-plugin)

### How to upgrade Context Path Application to 2.0
If your existing application is created with providing context path, then it will not be going to upgrade using Application Builder upgrade functionality since it is running in its own application context.

Here are steps to upgrade Context Path application. Please note that this action is **non-reversible**:

 1. Go to Application Builder -> Add Application.
 2. Give name of your application.
 3. Do not provide any context path.
 4. Select your existing application from "Clone Existing Application".
 5. This will clone your app and bring it into Application Builder context.
 6. Verify your newly created application for all functionalities.
 7. Delete existing application.
 8. If all functionalities are working as expected, then clone application again with context path
 9. Congratulations, you have upgraded your app to 2.0.

### How to downgrade Application Builder to 1.3.x
If you already upgraded Application Builder to 2.0 and wanted to downgrade back to 1.3.x for any reason, you can follow below steps:

1. Download Application Builder 1.3.x binary from release section.
2. Go to Administration -> Ecosystem -> All Applications.
3. Click  "Application Builder"
4. Click "Upload a *.zip file".
5. Upload 1.3.4 binary
6. Go to Application Builder from app switcher.
7. Click on "Widget Catalog"
8. Click on "Uninstall All" button.
9. This will delete all widgets.
10. Install required widget again.
11. Congratulations, you have downgraded your app to 1.3.x


A more detailed user guide and quick start videos are available in the Home section of the Application Builder app.

**NOTE:** This is only shown in the main page of the Application Builder, not when editing an individual application.

## Runtime Widgets

Application Builder supports  widget deployment. Some of the  widget plugins are already available in widget catalog.
You can find widgets at [Software AG Open Source](https://open-source.softwareag.com/?search=plugin&topic=cumulocity-iot)

Would you like to create your own Custom Runtime widget? Please refer our [Demo Widget](https://github.com/SoftwareAG/cumulocity-demo-widget-plugin).


## Troubleshooting

 ### Application Builder 2.0.0 and later
 
 *  **Widget/plugins are not installed after upgrade:**
 There are multiple reasons that your widgets/plugins might not installed such as browser page refreshed, network error, etc.
 In this scenario you can follow any of the below approach:
   1. If you have installed many widgets in earlier version of application builder then you can downgrade application builder by following [How to downgrade Application Builder to 1.3.x](https://github.com/SoftwareAG/cumulocity-app-builder/edit/2.0.0-dev-1/README.md#how-to-downgrade-application-builder-to-13x) and try again.
   2. If you have few widgets installed in earlier version of application builder, then you can just uninstall those widgets manually from Administration -> Ecosystem -> All Applications and install corresponding plugin either from Widget Catalog or from Administration -> Ecosystem -> Packages.
 
 
 ### Application Builder 1.3.x and earlier
 
 *  **Failed to load a runtime custom widget:**
 ```
 	Failed to load a runtime custom widget, it may have been compiled for a different Cumulocity version
 ```
  There is multiple reason for above error while loading page:
   1. **Browser cashing issue:** Try again after clearing browser cache or run incognito/private mode in browser. This is usually happened when new version of application builder installed or upgraded.
   2. **Widget is not compatible with current version of Application builder:** There are possibilities that your widget is no longer compatible with application builder due to angular/cumulocity upgrade.

If your widget is listed in widget catalog, then follow below steps:
 1. Go to widget catalog --> My Widgets
 2. Delete the widget which is giving error (You can identify widget by looking for this icon![icon](https://user-images.githubusercontent.com/32765455/163791806-86468ac3-5072-4516-85d8-6ef65eff73d7.png))
 4. Go to "Get More Widget" page
 5. Install the compatible widget/alternate widget
 6. Refresh page
	
If your widget is not listed in widget catalog, then you may need to upgrade your custom widget to make it compatible with current version of application builder.
 
*  **Demo App(Demo Catalog App) not working after upgrade:** There are possibilities that demo installed via demo catalog earlier may not work properly after upgrading application builder. In that scenario, you can perform following steps:
 1. Delete Demo using existing Demo Catalog
 2. Go to Administration -> Applications -> Own Applications
 3. Delete Demo Catalog App 
 4. Click on App Switcher and navigate to Application builder  
 5. In "Home" Page of application builder, you can find "Install Demo Catalog" option   
 6. Install the latest version of Demo Catalog    
 7. Install your demo application      
 
 *  **Application Builder keep loading:** 
  If you are building your own version of app builder, you may experience below error in browser console due to nv.d3.js bug.
  ```
  Uncaught (in promise) TypeError: true is not a function
    at eval (nv.d3.js?4bd4:9)
    at eval (nv.d3.js?4bd4:14365)
  ```
  If you encounter above error, please follow below steps:
  
   1. Stop the server.
   2. Go to /cumulocity_app_builder/node_modules/nvd3 folder
   3. Open nv.d3.js file
   4. add ";" at line number 7. Refer below code snippet.
    
    ```
      (function(){

      var nv = window.nv || {};


      nv.version = '1.1.15b';
      nv.dev = true; //set false when in production

      window.nv = nv;
    
    ```
   5. Save file
   6. Go to /cumulocity_app_builder/patches 
   7. Delete nvd3+0.0.1.patch file
   8. Go to /cumulocity_app_builder 
   9. Execute "npx patch-package nvd3" command in your terminal
   10. Start the server

------------------------------
## Contributing to Application Builder

If you like to submit a pull request,  please follow below guidelines:


#### Guidelines
- Please describe the changes that you are making
- For features, please describe how to use the new feature
- please include a reference to an existing issue, if applicable
- Specify type of change
	- Bug Fix
	- Feature
	- Other(Refactoring, Documentation, etc..)
- Does this change Introduce any breaking change ? Yes/No
- Follow below checklist:
	- Commit Messages follow the pattern
		- A feature commit message is prefixed "feature:"
		- A bugfix commit message is prefixed "fix:"
	-   Tests for the changes have been added


------------------------------

These tools are provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.
_____________________
For more information you can Ask a Question in the [TECH Community Forums](https://tech.forums.softwareag.com/tag/Cumulocity-IoT).
